"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HuggingFaceAccessToken {
    constructor() {
        this.name = 'huggingFaceAccessToken';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: 'Navigate to the <a target="_blank" href="https://huggingface.co/settings/tokens">Access Token page</a> and copy your token'
            }
        ];
    }
}
module.exports = { credClass: HuggingFaceAccessToken };
//# sourceMappingURL=HuggingFaceAccessToken.js.map