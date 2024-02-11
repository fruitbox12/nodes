"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TwitterApi {
    constructor() {
        this.name = 'twitterApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Bearer Token',
                name: 'bearerToken',
                type: 'string',
                default: '',
                description: '<a target="_blank" href="https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api">Register Twitter Dev account and get your token.</a>"'
            }
        ];
    }
}
module.exports = { credClass: TwitterApi };
//# sourceMappingURL=TwitterApi.js.map