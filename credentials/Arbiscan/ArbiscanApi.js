"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArbiscanApi {
    constructor() {
        this.name = 'arbiscanApi';
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
module.exports = { credClass: ArbiscanApi };
//# sourceMappingURL=ArbiscanApi.js.map