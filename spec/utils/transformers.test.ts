import { transformResultItem } from '../../src/utils/transformers';
import { testItem } from '../localExamples';

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
    const { id, ...rest } = testItem.data;
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

    expect(transformResultItem(item as any)).toBeNull();
  });

  it('should return null if data is an empty object', () => {
    const item = {
      ...testItem,
      data: {},
    };
    expect(transformResultItem(item as any)).toBeNull();
  });

  it('should return null if data is not an object', () => {
    const item = {
      ...testItem,
      data: 'not-an-object',
    };
    expect(transformResultItem(item as any)).toBeNull();
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
      const { image_url, ...dataWithoutImage } = testItem.data;
      const itemWithoutImage = {
        ...testItem,
        data: dataWithoutImage,
      };

      const result = transformResultItem(itemWithoutImage as any, formatImageUrl);

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

      const result = transformResultItem(itemWithEmptyImageUrl as any, formatImageUrl);

      expect(result).not.toBeNull();
      expect(result!.imageUrl).toBe('');
      expect(formatImageUrl).not.toHaveBeenCalled();
    });
  });
});
