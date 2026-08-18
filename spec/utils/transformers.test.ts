import { extractAndTransformItems, transformResultItem } from '../../src/utils/transformers';
import { GetAnswerResultsResponse } from '../../src/types';
import { testGetAnswersApiResponse, testItem } from '../localExamples';

describe('Testing Transformers: transformResultItem', () => {
  it('should return all base properties as camelCased properties', () => {
    const result = transformResultItem(testItem);

    if (result === null) {
      throw new Error('transformResultItem returned null');
    }

    // Transformed base properties
    expect(typeof result.name).toBe('string');
    expect(result.name).toBe(testItem.value);

    expect(Array.isArray(result.matchedTerms)).toBe(true);
    expect(result.matchedTerms).toBe(testItem.matched_terms);

    expect(typeof result.variations).toBe('object');
    expect(result.variations?.length).toBe(testItem.variations.length);

    expect(result.variations_map).toBeNull(); // as per testItem

    // Flattened properties
    expect(typeof result.id).toBe('string');
    expect(result.id).toBe(testItem.data.id);

    expect(typeof result.variationId).toBe('string');
    expect(result.variationId).toBe(testItem.data.variation_id);

    expect(typeof result.url).toBe('string');
    expect(result.url).toBe(testItem.data.url);

    expect(typeof result.imageUrl).toBe('string');
    expect(result.imageUrl).toBe(testItem.data.image_url);

    expect(typeof result.description).toBe('string');
    expect(result.description).toBe(testItem.data.description);

    expect(typeof result.price).toBe('number');
    expect(result.price).toBe(testItem.data.price);
  });

  it('should return null if data.id is undefined', () => {
    const { id: _id, ...rest } = testItem.data;
    const item = {
      ...testItem,
      data: { ...rest },
    };

    expect(transformResultItem(item)).toBeNull();
  });

  it('should return null if value is undefined', () => {
    const item = {
      ...testItem,
      value: undefined,
    };

    expect(transformResultItem(item)).toBeNull();
  });

  it('should return null if data is an empty object', () => {
    const item = {
      ...testItem,
      data: {},
    };
    expect(transformResultItem(item)).toBeNull();
  });

  it('should return null if data is not an object', () => {
    const item = {
      ...testItem,
      data: 'not-an-object',
    };
    expect(transformResultItem(item)).toBeNull();
  });

  describe('formatImageUrl callback', () => {
    it('should apply formatImageUrl to the image URL when provided', () => {
      const formatImageUrl = (url: string) => `https://cdn.example.com${url}`;
      const itemWithRelativeUrl = {
        ...testItem,
        data: { ...testItem.data, image_url: '/images/product.jpg' },
      };

      const result = transformResultItem(itemWithRelativeUrl, formatImageUrl);

      expect(result).not.toBeNull();
      expect(result!.imageUrl).toBe('https://cdn.example.com/images/product.jpg');
    });

    it('should not modify imageUrl when formatImageUrl is not provided', () => {
      const result = transformResultItem(testItem);

      expect(result).not.toBeNull();
      expect(result!.imageUrl).toBe(testItem.data.image_url);
    });

    it('should not call formatImageUrl when image_url is undefined', () => {
      const formatImageUrl = jest.fn((url: string) => `https://cdn.example.com${url}`);
      const { image_url: _image_url, ...dataWithoutImage } = testItem.data;
      const itemWithoutImage = {
        ...testItem,
        data: dataWithoutImage,
      };

      const result = transformResultItem(itemWithoutImage, formatImageUrl);

      expect(result).not.toBeNull();
      expect(result!.imageUrl).toBeUndefined();
      expect(formatImageUrl).not.toHaveBeenCalled();
    });

    it('should not call formatImageUrl when image_url is an empty string', () => {
      const formatImageUrl = jest.fn((url: string) => `https://cdn.example.com${url}`);
      const itemWithEmptyImageUrl = {
        ...testItem,
        data: { ...testItem.data, image_url: '' },
      };

      const result = transformResultItem(itemWithEmptyImageUrl, formatImageUrl);

      expect(result).not.toBeNull();
      expect(result!.imageUrl).toBe('');
      expect(formatImageUrl).not.toHaveBeenCalled();
    });

    it('should fall back to original imageUrl when formatImageUrl throws', () => {
      const formatImageUrl = () => {
        throw new Error('formatter error');
      };

      const result = transformResultItem(testItem, formatImageUrl);

      expect(result).not.toBeNull();
      expect(result!.imageUrl).toBe(testItem.data.image_url);
    });
  });
});

describe('Testing Transformers: extractAndTransformItems', () => {
  it('should transform every result in the response', () => {
    const result = extractAndTransformItems(testGetAnswersApiResponse as GetAnswerResultsResponse);

    const { results } = testGetAnswersApiResponse.item_results.response;
    expect(result).toHaveLength(results.length);
    expect(result?.[0].id).toBe(results[0].data.id);
    expect(result?.[0].name).toBe(results[0].value);
  });

  it('should return null when there is no response at all', () => {
    expect(extractAndTransformItems(null)).toBeNull();
  });

  it('should return null when the response carries no item_results', () => {
    const { item_results: _itemResults, ...rest } = testGetAnswersApiResponse;

    expect(extractAndTransformItems(rest as GetAnswerResultsResponse)).toBeNull();
  });

  it('should return null rather than an empty array when results is empty', () => {
    const response = {
      ...testGetAnswersApiResponse,
      item_results: { response: { results: [] } },
    };

    expect(extractAndTransformItems(response as GetAnswerResultsResponse)).toBeNull();
  });

  it('should return null rather than an empty array when every item is unusable', () => {
    const { id: _id, ...dataWithoutId } = testGetAnswersApiResponse.item_results.response.results[0]
      .data as Record<string, unknown>;
    const response = {
      ...testGetAnswersApiResponse,
      item_results: {
        response: {
          results: [
            { ...testGetAnswersApiResponse.item_results.response.results[0], data: dataWithoutId },
          ],
        },
      },
    };

    expect(extractAndTransformItems(response as GetAnswerResultsResponse)).toBeNull();
  });

  it('should drop only the unusable items when some are fine', () => {
    const [firstResult, secondResult] = testGetAnswersApiResponse.item_results.response.results;
    const { id: _id, ...dataWithoutId } = secondResult.data as Record<string, unknown>;
    const response = {
      ...testGetAnswersApiResponse,
      item_results: {
        response: { results: [firstResult, { ...secondResult, data: dataWithoutId }] },
      },
    };

    const result = extractAndTransformItems(response as GetAnswerResultsResponse);

    expect(result).toHaveLength(1);
    expect(result?.[0].id).toBe(firstResult.data.id);
  });

  it('should pass formatImageUrl through to every item', () => {
    const formatImageUrl = jest.fn((url: string) => `${url}?width=200`);

    const result = extractAndTransformItems(
      testGetAnswersApiResponse as GetAnswerResultsResponse,
      formatImageUrl,
    );

    const { results } = testGetAnswersApiResponse.item_results.response;
    expect(formatImageUrl).toHaveBeenCalledTimes(results.length);
    expect(result?.[0].imageUrl).toBe(`${results[0].data.image_url}?width=200`);
  });
});
