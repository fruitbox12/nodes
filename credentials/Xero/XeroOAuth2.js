"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XeroOAuth2 {
    constructor() {
        this.name = 'xeroOAuth2Api';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Client ID',
                name: 'clientID',
                type: 'string',
                default: '',
                description: 'How to get Client ID & Secret: https://developer.xero.com/documentation/guides/oauth2/client-credentials/'
            },
            {
                label: 'Client Secret',
                name: 'clientSecret',
                type: 'password',
                default: '',
                description: 'How to get Client ID & Secret: https://developer.xero.com/documentation/guides/oauth2/client-credentials/'
            },
            {
                label: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
                default: 'https://login.xero.com/identity/connect/authorize'
            },
            {
                label: 'Access Token Url',
                name: 'accessTokenUrl',
                type: 'string',
                default: 'https://identity.xero.com/connect/token'
            },
            {
                label: 'Authorization URL Parameters',
                name: 'authorizationURLParameters',
                type: 'string',
                default: 'response_type=code'
            },
            {
                label: 'Scope',
                name: 'scope',
                type: 'json',
                default: `[
                    "openid", 
                    "profile", 
                    "email", 
                    "accounting.settings", 
                    "accounting.reports.read", 
                    "accounting.journals.read", 
                    "accounting.contacts", 
                    "accounting.attachments", 
                    "accounting.transactions", 
                    "offline_access"
                ]`
            }
        ];
    }
}
module.exports = { credClass: XeroOAuth2 };
//# sourceMappingURL=XeroOAuth2.js.map