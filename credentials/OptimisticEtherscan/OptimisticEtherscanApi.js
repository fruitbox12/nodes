"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OptimisticEtherscanApi {
    constructor() {
        this.name = 'optimisticEtherscanApi';
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
module.exports = { credClass: OptimisticEtherscanApi };
//# sourceMappingURL=OptimisticEtherscanApi.js.map