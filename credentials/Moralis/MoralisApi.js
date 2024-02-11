"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MoralisApi {
    constructor() {
        this.name = 'moralisApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                description: 'How to get API key: https://docs.moralis.io/reference/getting-the-api-key'
            }
        ];
    }
}
module.exports = { credClass: MoralisApi };
//# sourceMappingURL=MoralisApi.js.map