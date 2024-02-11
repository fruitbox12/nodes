"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BscscanApi {
    constructor() {
        this.name = 'bscscanApi';
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
module.exports = { credClass: BscscanApi };
//# sourceMappingURL=BscscanApi.js.map