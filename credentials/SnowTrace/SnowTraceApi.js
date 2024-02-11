"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SnowTraceApi {
    constructor() {
        this.name = 'snowtraceApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: ''
            }
        ];
    }
}
module.exports = { credClass: SnowTraceApi };
//# sourceMappingURL=SnowTraceApi.js.map