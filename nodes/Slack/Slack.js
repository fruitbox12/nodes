"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Slack {
    constructor() {
        this.label = 'Slack';
        this.name = 'slack';
        this.icon = 'slack.svg';
        this.type = 'action';
        this.category = 'Communication';
        this.version = 1.0;
        this.description = 'Post message in Slack channel';
        this.incoming = 1;
        this.outgoing = 1;
        this.inputParameters = [
            {
                label: 'Webhook URL',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                description: 'Webhook URL for the channel. Learn more: https://api.slack.com/messaging/webhooks'
            },
            {
                label: 'Message',
                description: 'Message contents',
                name: 'text',
                type: 'string',
                default: ''
            }
        ];
    }
    async run(nodeData) {
        var _a;
        const inputParametersData = nodeData.inputParameters;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const returnData = [];
        const body = {};
        const webhookUrl = inputParametersData.webhookUrl;
        const text = inputParametersData.text;
        body.text = text;
        let responseData;
        let maxRetries = 5;
        do {
            try {
                const axiosConfig = {
                    method: 'POST',
                    url: `${webhookUrl}`,
                    data: body,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
                break;
            }
            catch (error) {
                // Rate limit exceeded
                if (error.response && error.response.status === 429) {
                    const retryAfter = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.headers['retry-after']) || 60;
                    await new Promise((resolve, _) => {
                        setTimeout(() => {
                            resolve();
                        }, retryAfter * 1000);
                    });
                    continue;
                }
                throw (0, utils_1.handleErrorMessage)(error);
            }
        } while (--maxRetries);
        if (maxRetries <= 0) {
            throw new Error('Error posting message to Slack channel. Max retries limit was reached.');
        }
        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        }
        else {
            returnData.push(responseData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: Slack };
//# sourceMappingURL=Slack.js.map