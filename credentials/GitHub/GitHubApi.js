"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GitHubApi {
    constructor() {
        this.name = 'gitHubApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: '<a target="_blank" href="https://github.com/settings/tokens">Register GitHub and get your access token.</a>"'
            }
        ];
    }
}
module.exports = { credClass: GitHubApi };
//# sourceMappingURL=GitHubApi.js.map