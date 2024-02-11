"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GnosisscanApi {
    constructor() {
        this.name = 'gnosisscanApi';
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
module.exports = { credClass: GnosisscanApi };
//# sourceMappingURL=GnosisscanApi.js.map