"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constructorio_client_javascript_1 = tslib_1.__importDefault(require("@constructor-io/constructorio-client-javascript"));
const agent_1 = tslib_1.__importDefault(require("./agent"));
const version_1 = tslib_1.__importDefault(require("../../version"));
class MockConstructorIOClient {
    constructor(options) {
        this.options = Object.assign({ version: options.version || `cio-ui-pia-${version_1.default}`, serviceUrl: options.serviceUrl || 'https://ac.cnstrc.com', quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzes.cnstrc.com', agentServiceUrl: options.agentServiceUrl || 'https://agent.cnstrc.com', sessionId: options.sessionId || 0, clientId: options.clientId || 'this-is-a-random-client-id', sendTrackingEvents: options.sendTrackingEvents !== undefined ? options.sendTrackingEvents : true, beaconMode: options.beaconMode !== undefined ? options.beaconMode : true, networkParameters: options.networkParameters || {} }, options);
        const cioClient = new constructorio_client_javascript_1.default(this.options);
        this.search = cioClient.search;
        this.browse = cioClient.browse;
        this.recommendations = cioClient.recommendations;
        this.tracker = cioClient.tracker;
        this.quizzes = cioClient.quizzes;
        // Use the mock agent instead of the one from the client
        this.agent = new agent_1.default(this.options);
    }
}
exports.default = MockConstructorIOClient;
