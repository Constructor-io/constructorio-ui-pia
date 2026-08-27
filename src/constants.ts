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
