"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EtherscanApi {
    constructor() {
        this.name = 'etherscanApi';
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
module.exports = { credClass: EtherscanApi };
//# sourceMappingURL=EtherscanApi.js.map