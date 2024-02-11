"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPBearerTokenAuth {
    constructor() {
        this.name = 'httpBearerTokenAuth';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Token',
                name: 'token',
                type: 'string',
                default: ''
            }
        ];
    }
}
module.exports = { credClass: HTTPBearerTokenAuth };
//# sourceMappingURL=HTTPBearerTokenAuth.js.map