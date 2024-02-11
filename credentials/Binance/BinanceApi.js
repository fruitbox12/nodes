"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinanceApi {
    constructor() {
        this.name = 'binanceApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: ''
            },
            {
                label: 'Secret Key',
                name: 'secretKey',
                type: 'password',
                default: ''
            }
        ];
    }
}
module.exports = { credClass: BinanceApi };
//# sourceMappingURL=BinanceApi.js.map