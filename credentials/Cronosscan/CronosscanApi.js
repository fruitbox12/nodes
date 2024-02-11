"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CronosscanApi {
    constructor() {
        this.name = 'cronosscanApi';
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
module.exports = { credClass: CronosscanApi };
//# sourceMappingURL=CronosscanApi.js.map