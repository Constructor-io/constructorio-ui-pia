"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const version_1 = tslib_1.__importDefault(require("../version"));
const MockConstructorIOClient_1 = tslib_1.__importDefault(require("./mocks/MockConstructorIOClient"));
const useCioClient = ({ apiKey, cioClient, options } = {}) => {
    if (!apiKey && !cioClient) {
        throw new Error('Api Key or Constructor Client required');
    }
    const memoizedCioClient = (0, react_1.useMemo)(() => {
        if (cioClient)
            return cioClient;
        if (apiKey) {
            return new MockConstructorIOClient_1.default(Object.assign({ apiKey, sendTrackingEvents: true, version: `cio-ui-pia-${version_1.default}` }, options));
        }
        return null;
    }, [apiKey, cioClient, options]);
    return memoizedCioClient;
};
exports.default = useCioClient;
