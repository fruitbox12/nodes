"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PolygonscanApi {
    constructor() {
        this.name = 'polygonscanApi';
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
module.exports = { credClass: PolygonscanApi };
//# sourceMappingURL=PolygonscanApi.js.map