import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';
import { QuestionResponse, GetSuggestedQuestionsProps, GetAnswerResultsStreamProps, GetAnswerResultsProps, GetAnswerResultsResponse } from './types';
declare class MockAgent {
    options: ConstructorClientOptions;
    constructor(options: ConstructorClientOptions);
    getSuggestedQuestions({ itemId, variationId, threadId, parameters, }: GetSuggestedQuestionsProps): Promise<QuestionResponse>;
    getAnswerResults({ itemId, variationId, threadId, question, parameters, }: GetAnswerResultsProps): Promise<GetAnswerResultsResponse>;
    getAnswerResultsStream({ itemId, threadId, variationId, question, parameters, onStart, onMessage, onEnd, }: GetAnswerResultsStreamProps): Promise<void>;
}
export default MockAgent;
