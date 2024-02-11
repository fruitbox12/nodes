"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MoonRiverScanApi {
    constructor() {
        this.name = 'moonRiverScanApi';
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
module.exports = { credClass: MoonRiverScanApi };
//# sourceMappingURL=MoonRiverScanApi.js.map