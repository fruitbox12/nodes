"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeliusApi {
    constructor() {
        this.name = 'heliusApi';
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
module.exports = { credClass: HeliusApi };
//# sourceMappingURL=HeliusApi.js.map