"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotionApi {
    constructor() {
        this.name = 'notionApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Internal Integration Token',
                name: 'integrationToken',
                type: 'string',
                default: '',
                description: 'Get your <a target="_blank" href="https://www.notion.so/my-integrations">Internal Integration Token</a> for your workspace'
            }
        ];
    }
}
module.exports = { credClass: NotionApi };
//# sourceMappingURL=NotionApi.js.map