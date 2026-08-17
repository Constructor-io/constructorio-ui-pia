import {
  Formatters,
  GetAnswerResultsResponse,
  RecsRefinement,
  RecsResult,
  RecsStrategy,
  Translations,
} from '../types';
import { extractAndTransformItems } from './transformers';
import { translate } from './translate';
import { RECS_REFINEMENT_LABEL } from '../constants';

/**
 * Question text used to stand in for each strategy on the answers endpoint.
 *
 * ⚠ PROVISIONAL. The answers endpoint has no way to say which kind of recommendations to
 * fetch, so a phrasing is sent instead and the model decides whether to return products.
 * Verified against production 2026-08-17: an arbitrary phrase can return products and a
 * carefully worded one can return none, so these phrasings are a best effort, not a contract.
 */
export const PROVISIONAL_STRATEGY_QUESTIONS: Record<RecsStrategy, string> = {
  complementary_items: 'What products go well with this item?',
  alternative_items: 'What alternative products are available for this item?',
  bestsellers: 'What are the best selling products?',
  bundles: 'What products are sold together with this item?',
  buy_it_again: 'What products would I buy again?',
  recently_viewed_items: 'What products have I viewed recently?',
  visually_similar_items: 'What products look similar to this item?',
};

/**
 * Converts an answers response into the shape the pod renders.
 *
 * ⚠ PROVISIONAL. The answers endpoint returns Q&A-shaped content: `value` is a
 * multi-paragraph answer rather than a short title, and `follow_up_questions` are questions
 * about the product rather than refinement labels. Verified against production 2026-08-17.
 * Replace once we have either (a) the real question-format convention, or (b) the unified
 * agent insights endpoint with `mode: 'recommendations'`.
 *
 * Keeping the conversion here is what makes the endpoint swappable: nothing outside this file
 * and the client method that calls it knows the raw response shape.
 */
export function adaptLegacyAnswerToRecs(
  data: GetAnswerResultsResponse,
  formatImageUrl?: Formatters['formatImageUrl'],
): RecsResult {
  const followUpQuestions = data?.follow_up_questions || [];

  return {
    title: data?.value || '',
    items: extractAndTransformItems(data, formatImageUrl),
    refinement:
      followUpQuestions.length > 0
        ? { options: followUpQuestions.map((question) => question.value) }
        : null,
    resultId: data?.qna_result_id,
    threadId: data?.thread_id,
    status: 'complete',
  };
}

/**
 * The line that introduces the refinement options. Prefers the prompt the API sent, so our
 * copy and theirs cannot drift.
 */
export function resolveRefinementQuestion(
  refinement: RecsRefinement | null,
  translations?: Translations,
): string {
  return refinement?.question || translate(RECS_REFINEMENT_LABEL, translations);
}
