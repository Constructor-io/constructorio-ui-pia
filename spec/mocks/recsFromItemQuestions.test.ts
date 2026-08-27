import {
  adaptAnswerToRecsResult,
  buildRecsQuestion,
} from '../../src/hooks/mocks/recsFromItemQuestions';
import {
  RECS_QUESTION_PREFIX,
  RECS_QUESTION_TAIL_ALTERNATIVE,
  RECS_QUESTION_TAIL_COMPLEMENTARY,
} from '../../src/constants';
import { GetAnswerResultsResponse } from '../../src/types';
import { testGetAnswersApiResponse } from '../localExamples';

const testResponse = testGetAnswersApiResponse as GetAnswerResultsResponse;

describe('Testing recsFromItemQuestions: buildRecsQuestion', () => {
  // The wording decides whether products come back at all, so assert it whole.
  it('asks for complementary products', () => {
    expect(buildRecsQuestion('complementary_items')).toBe(
      `${RECS_QUESTION_PREFIX}${RECS_QUESTION_TAIL_COMPLEMENTARY}`,
    );
  });

  it('asks for similar products', () => {
    expect(buildRecsQuestion('alternative_items')).toBe(
      `${RECS_QUESTION_PREFIX}${RECS_QUESTION_TAIL_ALTERNATIVE}`,
    );
  });

  it('folds the shopper text into the question', () => {
    expect(buildRecsQuestion('complementary_items', 'organic')).toBe(
      `${RECS_QUESTION_PREFIX}are organic`,
    );
  });

  // Restating the strategy alongside the shopper's own text would only compete with it.
  it('drops the strategy tail once there is shopper text', () => {
    const question = buildRecsQuestion('alternative_items', 'under $50');

    expect(question).toBe(`${RECS_QUESTION_PREFIX}are under $50`);
    expect(question).not.toContain(RECS_QUESTION_TAIL_ALTERNATIVE);
  });

  it('trims the shopper text', () => {
    expect(buildRecsQuestion('complementary_items', '  organic  ')).toBe(
      `${RECS_QUESTION_PREFIX}are organic`,
    );
  });

  it('falls back to the strategy tail when the shopper text is blank', () => {
    expect(buildRecsQuestion('complementary_items', '   ')).toBe(
      `${RECS_QUESTION_PREFIX}${RECS_QUESTION_TAIL_COMPLEMENTARY}`,
    );
  });
});

describe('Testing recsFromItemQuestions: adaptAnswerToRecsResult', () => {
  it('carries the products through', () => {
    const result = adaptAnswerToRecsResult(testResponse);

    const { results } = testGetAnswersApiResponse.item_results.response;
    expect(result.items).toHaveLength(results.length);
    expect(result.items?.[0].id).toBe(results[0].data.id);
  });

  it('carries the thread and result ids, which is what keeps a refinement in context', () => {
    const result = adaptAnswerToRecsResult(testResponse);

    expect(result.threadId).toBe(testGetAnswersApiResponse.thread_id);
    expect(result.resultId).toBe(testGetAnswersApiResponse.qna_result_id);
  });

  // `value` is prose and the follow-ups are full questions, so both are dropped for the pod's copy.
  it('drops the prose answer rather than using it as a title', () => {
    const result = adaptAnswerToRecsResult(testResponse);

    expect(testGetAnswersApiResponse.value).toBeTruthy();
    expect(result.title).toBe('');
  });

  it('drops the follow-up questions rather than offering them as options', () => {
    const result = adaptAnswerToRecsResult(testResponse);

    expect(testGetAnswersApiResponse.follow_up_questions.length).toBeGreaterThan(0);
    expect(result.refinement).toBeNull();
  });

  it('reports a settled response, so the pod does not treat it as degraded', () => {
    expect(adaptAnswerToRecsResult(testResponse).status).toBe('complete');
  });

  it('reports no products as null rather than an empty array', () => {
    const response = {
      ...testGetAnswersApiResponse,
      item_results: { response: { results: [] } },
    } as unknown as GetAnswerResultsResponse;

    expect(adaptAnswerToRecsResult(response).items).toBeNull();
  });

  it('applies formatImageUrl to every product', () => {
    const formatImageUrl = jest.fn((url: string) => `${url}?width=200`);

    const result = adaptAnswerToRecsResult(testResponse, formatImageUrl);

    const { results } = testGetAnswersApiResponse.item_results.response;
    expect(formatImageUrl).toHaveBeenCalledTimes(results.length);
    expect(result.items?.[0].imageUrl).toBe(`${results[0].data.image_url}?width=200`);
  });
});
