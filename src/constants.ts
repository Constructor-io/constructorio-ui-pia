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
 * API. All five are `Translations` keys, so reference the constants instead of retyping the
 * literals - a mistyped key falls back to itself with no warning.
 */
export const RECS_LOADING_TITLE = 'Adapting recommendations to your preference';
export const RECS_FALLBACK_TITLE = 'Best selling products';
export const RECS_UNSUPPORTED_REQUEST = 'Unsupported request, try a different feature.';
export const RECS_REFINEMENT_LABEL = "Not what you're looking for? Try:";
export const RECS_INPUT_PLACEHOLDER = 'Describe something else...';

/** The strategies served today. `RecsStrategy` is derived from this list. */
export const RECS_STRATEGIES = ['complementary_items', 'alternative_items'] as const;

/** Used when a caller names no strategy of its own. */
export const RECS_DEFAULT_STRATEGY = RECS_STRATEGIES[0];

/** Pod titles, one per strategy. */
export const RECS_TITLE_COMPLEMENTARY = 'Products that work well with this one';
export const RECS_TITLE_ALTERNATIVE = 'Similar products you might like';

/**
 * The question sent to `/v1/item_questions`: `PREFIX + tail` on the first request,
 * `PREFIX + 'are ' + shopperInput` on a refinement.
 *
 * The wording decides whether products come back at all. Across 16 catalog items the alternative
 * tail returned products for 93% and the complementary tail for 81%, against 68% for a bare
 * `complementary:` prefix. Reword only with fresh measurements in hand.
 */
export const RECS_QUESTION_PREFIX =
  "I'm looking for recommendations. Please recommend me products that ";
export const RECS_QUESTION_TAIL_COMPLEMENTARY = 'go well with this';
export const RECS_QUESTION_TAIL_ALTERNATIVE = 'are similar to this';

/**
 * Refinement options used when the response carries none of its own. These two scored highest of the
 * generic options tried, 6/6 and 5/6 across the items that had products to narrow. A refinement is
 * answered in the context of the previous turn, so relative wording ("a lower price") holds up where
 * an absolute threshold ("under $50") comes back empty.
 */
export const RECS_DEFAULT_REFINEMENT_OPTIONS = ['From a different brand', 'A lower price'];
