import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';
import { Recommendations, Browse, Search, Tracker, Quizzes } from '@constructor-io/constructorio-client-javascript/lib/types/constructorio';
import MockAgent from './agent';
declare class MockConstructorIOClient {
    options: ConstructorClientOptions;
    search: Search;
    browse: Browse;
    recommendations: Recommendations;
    tracker: Tracker;
    quizzes: Quizzes;
    agent: MockAgent;
    constructor(options: ConstructorClientOptions);
}
export default MockConstructorIOClient;
