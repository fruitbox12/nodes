"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PinataApi {
    constructor() {
        this.name = 'pinataApi';
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
module.exports = { credClass: PinataApi };
//# sourceMappingURL=PinataApi.js.map