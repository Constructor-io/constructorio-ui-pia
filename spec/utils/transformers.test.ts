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

    expect(result.variation_map).toBeNull(); // as per testItem

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
});
