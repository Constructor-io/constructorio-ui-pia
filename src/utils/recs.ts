import { RecsRefinement, Translations } from '../types';
import { translate } from './translate';
import { RECS_REFINED_BY_LABEL, RECS_REFINEMENT_LABEL } from '../constants';

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

/**
 * The line under the title naming what the products on screen were narrowed by. Only the label is
 * translatable: the quoted part is the shopper's own words, so it is repeated back untouched.
 */
export function formatRefinedBy(value: string, translations?: Translations): string {
  return `${translate(RECS_REFINED_BY_LABEL, translations)} "${value}"`;
}
