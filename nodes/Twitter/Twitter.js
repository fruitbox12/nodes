"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Twitter {
    constructor() {
        this.label = 'Twitter';
        this.name = 'twitter';
        this.icon = 'Twitter-Logo.png';
        this.type = 'action';
        this.category = 'Communication';
        this.description = "Search Twitter User's tweets by keyword";
        this.version = 1.0;
        this.incoming = 1;
        this.outgoing = 1;
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Twitter Bearer Token',
                        name: 'twitterApi'
                    }
                ],
                default: 'twitterApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Twitter ID',
                name: 'TwitterId',
                type: 'string',
                default: '',
                description: ''
            },
            {
                label: 'Keyword',
                name: 'Keyword',
                type: 'string',
                default: '',
                description: 'Message contents (up to 512 characters long)'
            },
            {
                label: 'From',
                name: 'fromDate',
                type: 'options',
                description: 'Date of start search',
                options: [
                    {
                        label: 'From Today UTC',
                        name: 'fromTodayUTC'
                    }
                ],
                default: 'fromTodayUTC'
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const returnData = [];
        const bearerToken = credentials.bearerToken;
        const TwitterId = inputParametersData.TwitterId;
        const keyword = inputParametersData.Keyword;
        const query = 'from:' + TwitterId + ' ' + keyword;
        const timestamp = new Date();
        timestamp.setUTCHours(0, 0, 0, 0);
        let responseData;
        let maxRetries = 5;
        do {
            try {
                const axiosConfig = {
                    method: 'GET',
                    url: `https://api.twitter.com/2/tweets/search/recent?query=${query}&start_time=${timestamp.toISOString()}&tweet.fields=created_at&sort_order=recency`,
                    headers: {
                        Authorization: `Bearer ${bearerToken}`
                    }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
                break;
            }
            catch (error) {
                throw (0, utils_1.handleErrorMessage)(error);
            }
        } while (--maxRetries);
        if (maxRetries <= 0) {
            throw new Error('Error getting message from twitter API. Max retries limit was reached.');
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
module.exports = { nodeClass: Twitter };
//# sourceMappingURL=Twitter.js.map