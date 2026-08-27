import { Formatters, RecsResult, RecsStrategy } from '../../types';
import { GetAnswerResultsResponse } from './types';
import { extractAndTransformItems } from '../../utils/transformers';
import {
  RECS_QUESTION_PREFIX,
  RECS_QUESTION_TAIL_ALTERNATIVE,
  RECS_QUESTION_TAIL_COMPLEMENTARY,
} from '../../constants';

/**
 * Drives the recommendations pod off `/v1/item_questions`, the Q&A endpoint, until
 * `/v1/agent_insights` supports `mode: 'recommendations'`. Everything specific to that endpoint is
 * in this file, so the swap later is confined to it.
 */

/** The tail of the question, per strategy. A strategy absent here has no equivalent to ask for. */
const QUESTION_TAILS: Partial<Record<RecsStrategy, string>> = {
  complementary_items: RECS_QUESTION_TAIL_COMPLEMENTARY,
  alternative_items: RECS_QUESTION_TAIL_ALTERNATIVE,
};

/**
 * The question to send, or `null` when this endpoint cannot serve the strategy. A refinement
 * replaces the tail rather than extending it: restating the strategy competes with the shopper.
 */
export function buildRecsQuestion(strategy: RecsStrategy, shopperInput?: string): string | null {
  const refinement = shopperInput?.trim();
  if (refinement) return `${RECS_QUESTION_PREFIX}are ${refinement}`;

  const tail = QUESTION_TAILS[strategy];
  if (!tail) return null;

  return `${RECS_QUESTION_PREFIX}${tail}`;
}

/** A settled response carrying nothing to render. The pod renders no markup in this state. */
export const EMPTY_RECS_RESULT: RecsResult = {
  title: '',
  items: null,
  refinement: null,
  status: 'complete',
};

/**
 * Converts one Q&A answer into the shape the pod renders.
 *
 * `title` and `refinement` are left empty on purpose: this endpoint answers as a chat assistant, so
 * its own are prose and full questions rather than a label and short options. Leaving them empty is
 * what lets `useRecsPod` fall through to the pod's copy, and what makes the eventual swap free.
 */
export function adaptAnswerToRecsResult(
  response: GetAnswerResultsResponse,
  formatImageUrl?: Formatters['formatImageUrl'],
): RecsResult {
  return {
    title: '',
    items: extractAndTransformItems(response, formatImageUrl),
    refinement: null,
    resultId: response?.qna_result_id,
    threadId: response?.thread_id,
    status: 'complete',
  };
}
