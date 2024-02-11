"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPBasicAuth {
    constructor() {
        this.name = 'httpBasicAuth';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Username',
                name: 'userName',
                type: 'string',
                default: ''
            },
            {
                label: 'Password',
                name: 'password',
                type: 'password',
                default: ''
            }
        ];
    }
}
module.exports = { credClass: HTTPBasicAuth };
//# sourceMappingURL=HTTPBasicAuth.js.map