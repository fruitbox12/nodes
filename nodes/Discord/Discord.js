"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Discord {
    constructor() {
        this.label = 'Discord';
        this.name = 'discord';
        this.icon = 'discord.svg';
        this.type = 'action';
        this.category = 'Communication';
        this.version = 1.0;
        this.description = 'Post message in Discord channel';
        this.incoming = 1;
        this.outgoing = 1;
        this.inputParameters = [
            {
                label: 'Webhook URL',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                description: 'Webhook URL for the channel. Learn how to get: https://www.youtube.com/watch?v=K8vgRWZnSZw'
            },
            {
                label: 'Content',
                description: 'Message contents (up to 2000 characters)',
                name: 'content',
                type: 'string',
                default: ''
            },
            {
                label: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                description: 'Override the default username of the webhook',
                optional: true
            },
            {
                label: 'Avatar URL',
                name: 'avatarUrl',
                type: 'string',
                default: '',
                description: 'Override the default avatar of the webhook',
                optional: true
            },
            {
                label: 'TTS',
                name: 'tts',
                type: 'boolean',
                default: false,
                description: 'Send as Text To Speech message',
                optional: true
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
        const content = inputParametersData.content;
        body.content = content;
        if (inputParametersData.username)
            body.username = inputParametersData.username;
        if (inputParametersData.avatarUrl)
            body.avatar_url = inputParametersData.avatarUrl;
        if (inputParametersData.tts)
            body.tts = inputParametersData.tts;
        let responseData;
        let maxRetries = 5;
        do {
            try {
                const axiosConfig = {
                    method: 'POST',
                    url: `${webhookUrl}?wait=true`,
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
            throw new Error('Error posting message to discord channel. Max retries limit was reached.');
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
module.exports = { nodeClass: Discord };
//# sourceMappingURL=Discord.js.map