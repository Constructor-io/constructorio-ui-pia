import {
  adaptLegacyAnswerToRecs,
  PROVISIONAL_STRATEGY_QUESTIONS,
  resolveRefinementQuestion,
} from '../../src/utils/recs';
import { RECS_REFINEMENT_LABEL } from '../../src/constants';
import { GetAnswerResultsResponse } from '../../src/hooks/mocks/types';
import { testGetAnswersApiResponse } from '../localExamples';

const apiResponse: GetAnswerResultsResponse = testGetAnswersApiResponse;

describe('Testing Recs Utils: adaptLegacyAnswerToRecs', () => {
  it('maps the answer fields onto the pod shape', () => {
    const result = adaptLegacyAnswerToRecs(apiResponse);

    expect(result.title).toBe(apiResponse.value);
    expect(result.resultId).toBe(apiResponse.qna_result_id);
    expect(result.threadId).toBe(apiResponse.thread_id);
    expect(result.status).toBe('complete');
  });

  it('transforms the product results into items', () => {
    const result = adaptLegacyAnswerToRecs(apiResponse);
    const rawResults = apiResponse.item_results!.response!.results!;

    expect(result.items).toHaveLength(rawResults.length);
    expect(result.items![0].name).toBe(rawResults[0].value);
  });

  it('applies formatImageUrl while transforming', () => {
    const result = adaptLegacyAnswerToRecs(apiResponse, (url) => `https://cdn.example.com${url}`);

    expect(result.items![0].imageUrl).toContain('https://cdn.example.com');
  });

  it('turns the follow-up questions into refinement options', () => {
    const result = adaptLegacyAnswerToRecs(apiResponse);

    expect(result.refinement).toEqual({
      options: apiResponse.follow_up_questions!.map((question) => question.value),
    });
  });

  it('drops repeated follow-up questions, keeping the order they arrived in', () => {
    const result = adaptLegacyAnswerToRecs({
      ...apiResponse,
      follow_up_questions: [{ value: 'Slim fit' }, { value: 'Oxford' }, { value: 'Slim fit' }],
    });

    expect(result.refinement).toEqual({ options: ['Slim fit', 'Oxford'] });
  });

  it('returns no refinement when the response carries no follow-up questions', () => {
    const result = adaptLegacyAnswerToRecs({ ...apiResponse, follow_up_questions: [] });

    expect(result.refinement).toBeNull();
  });

  it('returns no items rather than an empty list when there are no product results', () => {
    const result = adaptLegacyAnswerToRecs({ ...apiResponse, item_results: undefined });

    expect(result.items).toBeNull();
  });

  it('returns an empty title when the response has no answer text', () => {
    const result = adaptLegacyAnswerToRecs({ qna_result_id: 'id', value: '' });

    expect(result.title).toBe('');
    expect(result.items).toBeNull();
    expect(result.refinement).toBeNull();
  });
});

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

describe('Testing Recs Utils: PROVISIONAL_STRATEGY_QUESTIONS', () => {
  it('has one phrasing per strategy and no duplicates', () => {
    const phrasings = Object.values(PROVISIONAL_STRATEGY_QUESTIONS);

    expect(phrasings).toHaveLength(7);
    expect(new Set(phrasings).size).toBe(phrasings.length);
    phrasings.forEach((phrasing) => {
      expect(phrasing.length).toBeGreaterThan(0);
    });
  });
});
