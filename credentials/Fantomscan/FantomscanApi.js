"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FantomscanApi {
    constructor() {
        this.name = 'fantomscanApi';
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
module.exports = { credClass: FantomscanApi };
//# sourceMappingURL=FantomscanApi.js.map