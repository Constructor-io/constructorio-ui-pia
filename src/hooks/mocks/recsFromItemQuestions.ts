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
 * `/v1/agent_insights` supports `mode: 'recommendations'`.
 *
 * Everything specific to that endpoint is in this one file, so the swap later is confined to it.
 * Two things about that endpoint shape what is here:
 *
 * 1. It answers free text, so which recommendations come back - and whether any do - is decided by
 *    how the question is worded. `buildRecsQuestion` is that wording, and the constants it uses
 *    were chosen by measuring hit rates against a real catalog.
 * 2. It answers as a chat assistant, so the title and follow-ups it sends are prose: a few
 *    sentences of explanation, and follow-ups phrased as questions rather than the short labels the
 *    pod's options need. Both are dropped here, and the pod falls back to its own copy.
 */

/** The tail of the question, per strategy. A strategy absent here has no equivalent to ask for. */
const QUESTION_TAILS: Partial<Record<RecsStrategy, string>> = {
  complementary_items: RECS_QUESTION_TAIL_COMPLEMENTARY,
  alternative_items: RECS_QUESTION_TAIL_ALTERNATIVE,
};

/**
 * The question to send for one request, or `null` when this endpoint cannot serve the strategy.
 *
 * A refinement replaces the tail rather than being appended to it, because the endpoint reads the
 * whole question in the context of the conversation so far. The shopper's text is already narrowing
 * the previous response, so restating the strategy alongside it only competes with it.
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
 * `title` and `refinement` are deliberately left empty: this endpoint's own are unusable, and
 * leaving them empty is what lets `useRecsPod` fall through to the pod's configured copy. It is
 * also what makes the eventual swap free - once a response carries a real title and real options,
 * populating them here is the only change needed.
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
