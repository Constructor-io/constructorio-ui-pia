import { formatRefinedBy, resolveRefinementQuestion } from '../../src/utils/recs';
import { RECS_REFINED_BY_LABEL, RECS_REFINEMENT_LABEL } from '../../src/constants';

describe('Testing Recs Utils: resolveRefinementQuestion', () => {
  it('prefers the prompt the API sent', () => {
    expect(resolveRefinementQuestion({ question: 'Refine by:', options: ['Slim fit'] })).toBe(
      'Refine by:',
    );
  });

  it('falls back to the built-in label when the API sent no prompt', () => {
    expect(resolveRefinementQuestion({ options: ['Slim fit'] })).toBe(RECS_REFINEMENT_LABEL);
    expect(resolveRefinementQuestion(null)).toBe(RECS_REFINEMENT_LABEL);
  });

  it('translates the built-in label', () => {
    expect(
      resolveRefinementQuestion(null, { [RECS_REFINEMENT_LABEL]: 'Try one of these:' }),
    ).toBe('Try one of these:');
  });

  it('does not translate the prompt the API sent, because it is already localized', () => {
    expect(
      resolveRefinementQuestion({ question: 'Refine by:', options: [] }, {
        [RECS_REFINEMENT_LABEL]: 'Try one of these:',
      }),
    ).toBe('Refine by:');
  });
});

describe('Testing Recs Utils: formatRefinedBy', () => {
  it('quotes the value after the built-in label', () => {
    expect(formatRefinedBy('Under $50')).toBe('Refined by "Under $50"');
  });

  it('translates the label', () => {
    expect(formatRefinedBy('Under $50', { [RECS_REFINED_BY_LABEL]: 'Filtered by' })).toBe(
      'Filtered by "Under $50"',
    );
  });

  // The value is what the shopper picked or typed, so it is theirs to have repeated back exactly.
  it('repeats the value back untouched', () => {
    expect(formatRefinedBy('  something with more linen  ')).toBe(
      'Refined by "  something with more linen  "',
    );
  });
});
