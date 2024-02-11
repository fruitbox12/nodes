"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CeloscanApi {
    constructor() {
        this.name = 'celoscanApi';
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
module.exports = { credClass: CeloscanApi };
//# sourceMappingURL=CeloscanApi.js.map