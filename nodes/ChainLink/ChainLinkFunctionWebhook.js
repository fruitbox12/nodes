"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
class ChainLinkFunctionWebhook {
    constructor() {
        this.loadMethods = {
            async getAPIKeys(nodeData, dbCollection, apiKeys) {
                const returnData = [];
                if (!apiKeys || !apiKeys.length)
                    return returnData;
                for (let i = 0; i < apiKeys.length; i += 1) {
                    const key = apiKeys[i];
                    const data = {
                        label: key.keyName,
                        description: key.apiKey,
                        name: key.apiSecret
                    };
                    returnData.push(data);
                }
                return returnData;
            }
        };
        this.label = 'Chainlink Function Webhook';
        this.icon = 'chainlink.svg';
        this.name = 'chainLinkFunctionWebhook';
        this.type = 'webhook';
        this.category = 'Decentralized Oracle Network';
        this.version = 1.0;
        this.description = 'Start workflow whenever chainlink function webhook is called';
        this.incoming = 0;
        this.outgoing = 1;
        this.inputParameters = [
            {
                label: 'HTTP Method',
                name: 'httpMethod',
                type: 'options',
                options: [
                    {
                        label: 'GET',
                        name: 'GET'
                    },
                    {
                        label: 'POST',
                        name: 'POST'
                    }
                ],
                default: 'GET',
                description: 'The HTTP method to listen to.'
            },
            {
                label: 'Authorization',
                name: 'authorization',
                type: 'options',
                options: [
                    {
                        label: 'API',
                        name: 'headerAuth',
                        description: 'Webhook header must contains "X-API-KEY" with matching key'
                    },
                    {
                        label: 'None',
                        name: 'none'
                    }
                ],
                default: 'none',
                description: 'The way to authorize incoming webhook.'
            },
            {
                label: 'API key',
                name: 'apiKey',
                type: 'asyncOptions',
                description: 'Incoming call must consists header "x-api-key" with matching API key. You can create new key from the dashboard',
                loadMethod: 'getAPIKeys',
                show: {
                    'inputParameters.authorization': ['headerAuth']
                }
            }
        ];
    }
    async runWebhook(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const req = nodeData.req;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        if (req === undefined) {
            throw new Error('Missing request');
        }
        const authorization = inputParametersData.authorization;
        const apiSecret = inputParametersData.apiKey;
        const returnData = [];
        if (authorization === 'headerAuth') {
            let suppliedKey = '';
            if (req.headers['X-API-KEY'])
                suppliedKey = req.headers['X-API-KEY'];
            if (req.headers['x-api-key'])
                suppliedKey = req.headers['x-api-key'];
            if (!suppliedKey)
                throw new Error('401: Missing API Key');
            const isKeyValid = (0, utils_1.compareKeys)(apiSecret, suppliedKey);
            if (!isKeyValid)
                throw new Error('403: Unauthorized API Key');
        }
        returnData.push({
            headers: req === null || req === void 0 ? void 0 : req.headers,
            params: req === null || req === void 0 ? void 0 : req.params,
            query: req === null || req === void 0 ? void 0 : req.query,
            body: req === null || req === void 0 ? void 0 : req.body,
            rawBody: req.rawBody,
            url: req === null || req === void 0 ? void 0 : req.url
        });
        return (0, utils_1.returnWebhookNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: ChainLinkFunctionWebhook };
//# sourceMappingURL=ChainLinkFunctionWebhook.js.map