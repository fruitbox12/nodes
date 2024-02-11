"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeformApi {
    constructor() {
        this.name = 'typeformApi';
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
module.exports = { credClass: TypeformApi };
//# sourceMappingURL=TypeformApi.js.map