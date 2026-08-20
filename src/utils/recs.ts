import { RecsRefinement, Translations } from '../types';
import { translate } from './translate';
import { RECS_REFINEMENT_LABEL } from '../constants';

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
