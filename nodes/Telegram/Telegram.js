"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Telegram {
    constructor() {
        this.label = 'Telegram';
        this.name = 'telegram';
        this.icon = 'telegram.svg';
        this.type = 'action';
        this.category = 'Communication';
        this.version = 1.0;
        this.description = 'Perform Telegram operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Telegram Bot Token',
                        name: 'telegramApi'
                    }
                ],
                placeholder: 'eg: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHI',
                default: ''
            }
        ];
        this.inputParameters = [
            {
                label: 'Channel ID',
                name: 'channelID',
                type: 'string',
                placeholder: 'eg: MyAwesomeChannel',
                default: '',
                description: 'Your channel ID. <a target="_blank" href="https://www.youtube.com/watch?v=gk_tPOY1TDM">See how to how to add bot in your channel.</a>',
                optional: true
            },
            {
                label: 'Content',
                description: 'Message contents (up to 2000 characters)',
                name: 'content',
                type: 'string',
                default: ''
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const botToken = credentials.botToken;
        const channelID = inputParametersData.channelID;
        const content = inputParametersData.content;
        const returnData = [];
        try {
            const response = await axios_1.default.get(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=@${channelID}&text=${content}`);
            returnData.push(response.data);
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: Telegram };
//# sourceMappingURL=Telegram.js.map