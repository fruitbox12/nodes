"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MailchimpApi {
    constructor() {
        this.name = 'mailChimpCredential';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Mailchimp API Key',
                name: 'apiKey',
                type: 'string',
                default: ''
            }
        ];
    }
}
module.exports = { credClass: MailchimpApi };
//# sourceMappingURL=MailchimpApi.js.map