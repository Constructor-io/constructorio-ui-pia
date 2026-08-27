export const DEMO_API_KEY = 'key_13TO6qN9H3BP3Wrn';
export const DEMO_ITEM_ID = '149100215';
export const DEMO_ITEM_NAME = 'Ensure Original Nutrition Shake';
export const DEMO_QUESTION = 'What is the nutritional content of this shake?';
export const DEMO_QUESTION_ALTERNATIVE_PRODUCTS =
  'What alternative products are available for this item?';
export const MOCK_QUESTIONS = [
  { value: 'What is the nutritional content per serving?' },
  { value: 'How many calories does each bottle contain?' },
  { value: 'What is the shelf life of this product?' },
  { value: 'Is this shake suitable for specific dietary needs?' },
  { value: 'What flavor options are available for Ensure shakes?' },
  { value: 'What is the serving size and calorie count?' },
];
export const DISCLAIMER_TEXT =
  'AI-generated answers aim to help, but they may occasionally miss details or be inaccurate. Double-check important information before purchasing.';

/**
 * Recommendations pod strings the API cannot supply, because in these states there is either
 * no response yet or no usable response at all. Everything else the pod shows comes from the
 * API. All six are `Translations` keys, so reference the constants instead of retyping the
 * literals - a mistyped key falls back to itself with no warning.
 */
export const RECS_LOADING_TITLE = 'Adapting recommendations to your preference';
export const RECS_FALLBACK_TITLE = 'Best selling products';
export const RECS_UNSUPPORTED_REQUEST = 'Unsupported request, try a different feature.';
export const RECS_REFINEMENT_LABEL = "Not what you're looking for? Try:";
export const RECS_INPUT_PLACEHOLDER = 'Describe something else...';
/**
 * The pod's own title. Every response the pod shows today carries no title of its own, so this is
 * what the shopper sees on the first load and after each refinement. It matches the default
 * strategy, `complementary_items`; a pod set to `alternative_items` wants its own wording, either
 * through `recsPodParameters.defaultTitle` or `translations`.
 */
export const RECS_DEFAULT_TITLE = 'Pairs well with';

/**
 * The question sent to `/v1/item_questions`, assembled as `PREFIX + tail` on the first request and
 * `PREFIX + 'are ' + shopperInput` on a refinement.
 *
 * The wording is load-bearing, not decorative. The endpoint answers free text, so whether it looks
 * up products at all depends on how the question is phrased: measured across 16 catalog items, the
 * alternative tail returns products for 93% and the complementary tail for 81%, against 68% for a
 * bare `complementary:` prefix. Reword these only with fresh measurements in hand.
 */
export const RECS_QUESTION_PREFIX =
  "I'm looking for recommendations. Please recommend me products that ";
export const RECS_QUESTION_TAIL_COMPLEMENTARY = 'go well with this';
export const RECS_QUESTION_TAIL_ALTERNATIVE = 'are similar to this';

/**
 * Refinement options used when the response carries none of its own.
 *
 * Both were picked by measurement: of the generic options tried, these two were the only ones that
 * returned products on 6 of 8 items. Concrete attributes beat abstract qualifiers, so a retailer is
 * better served overriding these with nouns from their own catalog. Price options such as
 * `under $50` are a poor default in particular - they narrow the handful of products already on
 * screen rather than searching the catalog, so they come back empty more often than not.
 */
export const RECS_DEFAULT_REFINEMENT_OPTIONS = ['from a different brand', 'organic'];
