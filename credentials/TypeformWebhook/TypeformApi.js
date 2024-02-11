"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeformApi {
    constructor() {
        this.name = 'typeformApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Typeform Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: 'Get your access token from typeform account section'
            }
        ];
    }
}
module.exports = { credClass: TypeformApi };
//# sourceMappingURL=TypeformApi.js.map