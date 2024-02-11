"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OpenseaApi {
    constructor() {
        this.name = 'openSeaApi';
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
module.exports = { credClass: OpenseaApi };
//# sourceMappingURL=OpenseaApi.js.map