import ConstructorioClient from '@constructor-io/constructorio-client-javascript';
import MockAgent from './agent';
import version from '../../version';
class MockConstructorIOClient {
    options;
    search;
    browse;
    recommendations;
    tracker;
    quizzes;
    agent;
    constructor(options) {
        this.options = {
            version: options.version || `cio-ui-pia-${version}`,
            serviceUrl: options.serviceUrl || 'https://ac.cnstrc.com',
            quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzes.cnstrc.com',
            agentServiceUrl: options.agentServiceUrl || 'https://agent.cnstrc.com',
            sessionId: options.sessionId || 0,
            clientId: options.clientId || 'this-is-a-random-client-id',
            sendTrackingEvents: options.sendTrackingEvents !== undefined ? options.sendTrackingEvents : true,
            beaconMode: options.beaconMode !== undefined ? options.beaconMode : true,
            networkParameters: options.networkParameters || {},
            ...options,
        };
        const cioClient = new ConstructorioClient(this.options);
        this.search = cioClient.search;
        this.browse = cioClient.browse;
        this.recommendations = cioClient.recommendations;
        this.tracker = cioClient.tracker;
        this.quizzes = cioClient.quizzes;
        // Use the mock agent instead of the one from the client
        this.agent = new MockAgent(this.options);
    }
}
export default MockConstructorIOClient;
