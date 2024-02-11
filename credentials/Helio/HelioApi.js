"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HelioApi {
    constructor() {
        this.name = 'helioApi';
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
module.exports = { credClass: HelioApi };
//# sourceMappingURL=HelioApi.js.map