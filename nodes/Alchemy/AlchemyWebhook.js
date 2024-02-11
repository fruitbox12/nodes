"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class AlchemyWebhook {
    constructor() {
        this.webhookMethods = {
            async createWebhook(nodeData, webhookFullUrl) {
                // Check if webhook exists
                const credentials = nodeData.credentials;
                const inputParametersData = nodeData.inputParameters;
                const networksData = nodeData.networks;
                const actionsData = nodeData.actions;
                if (inputParametersData === undefined || actionsData === undefined || networksData === undefined) {
                    throw new Error('Required data missing');
                }
                if (credentials === undefined) {
                    throw new Error('Missing credentials');
                }
                const authToken = credentials.authToken;
                const axiosConfig = {
                    method: 'GET',
                    url: `https://dashboard.alchemyapi.io/api/team-webhooks`,
                    headers: { 'X-Alchemy-Token': authToken }
                };
                try {
                    const response = await (0, axios_1.default)(axiosConfig);
                    const responseData = response.data;
                    const webhooks = responseData.data;
                    const network = networksData.network;
                    const webhook_type = actionsData.webhook_type;
                    let webhookExist = false;
                    for (const webhook of webhooks) {
                        if (webhook.webhook_type === webhook_type && webhook.webhook_url === webhookFullUrl) {
                            if (webhook_type !== 'ADDRESS_ACTIVITY') {
                                const app_id = inputParametersData.app_id || '';
                                if (webhook.app_id === app_id) {
                                    webhookExist = true;
                                    break;
                                }
                                continue;
                            }
                            webhookExist = true;
                            break;
                        }
                    }
                    if (!webhookExist) {
                        const data = {
                            webhook_type,
                            network,
                            webhook_url: webhookFullUrl
                        };
                        if (webhook_type === 'ADDRESS_ACTIVITY') {
                            let addresses = inputParametersData.addresses || '[]';
                            //Remove whitespaces
                            addresses = addresses.replace(/\s/g, '');
                            if (addresses)
                                data.addresses = JSON.parse(addresses);
                        }
                        else {
                            const app_id = inputParametersData.app_id || '';
                            data.app_id = app_id;
                        }
                        const axiosCreateConfig = {
                            method: 'POST',
                            url: `https://dashboard.alchemyapi.io/api/create-webhook`,
                            data,
                            headers: { 'X-Alchemy-Token': authToken }
                        };
                        let createResponseData = await (0, axios_1.default)(axiosCreateConfig);
                        createResponseData = createResponseData.data;
                        if (createResponseData && createResponseData.data && createResponseData.data.id) {
                            return createResponseData.data.id;
                        }
                        return;
                    }
                }
                catch (error) {
                    return;
                }
            },
            async deleteWebhook(nodeData, webhookId) {
                const credentials = nodeData.credentials;
                if (credentials === undefined) {
                    throw new Error('Missing credentials');
                }
                const authToken = credentials.authToken;
                const axiosConfig = {
                    method: 'DELETE',
                    url: `https://dashboard.alchemyapi.io/api/delete-webhook?webhook_id=${webhookId}`,
                    headers: { 'X-Alchemy-Token': authToken }
                };
                try {
                    await (0, axios_1.default)(axiosConfig);
                }
                catch (error) {
                    return false;
                }
                return true;
            }
        };
        this.label = 'Alchemy Webhook';
        this.name = 'AlchemyWebhook';
        this.icon = 'alchemy.svg';
        this.type = 'webhook';
        this.category = 'Network Provider';
        this.version = 1.0;
        this.description = 'Start workflow whenever Alchemy webhook event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: 'Mainnet',
                        name: 'ETH_MAINNET'
                    },
                    {
                        label: 'Goerli',
                        name: 'ETH_GOERLI'
                    },
                    {
                        label: 'Polygon Mainnet',
                        name: 'MATIC_MAINNET'
                    },
                    {
                        label: 'Polygon Mumbai',
                        name: 'MATIC_MUMBAI'
                    },
                    {
                        label: 'Arbitrum Mainnet',
                        name: 'ARB_MAINNET'
                    },
                    {
                        label: 'Arbitrum Goerli',
                        name: 'ARB_GOERLI'
                    },
                    {
                        label: 'Optimism Mainnet',
                        name: 'OPT_MAINNET'
                    },
                    {
                        label: 'Optimism Goerli',
                        name: 'OPT_GOERLI'
                    }
                ],
                default: 'ETH_MAINNET'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Alchemy API Key',
                        name: 'alchemyApi'
                    }
                ],
                default: 'alchemyApi'
            }
        ];
        this.actions = [
            {
                label: 'Event',
                name: 'webhook_type',
                type: 'options',
                options: [
                    {
                        label: 'Mined Transactions',
                        name: 'MINED_TRANSACTION',
                        description: 'Triggered anytime a transaction sent through your API key gets successfully mined.'
                    },
                    {
                        label: 'Dropped Transactions',
                        name: 'DROPPED_TRANSACTION',
                        description: `The Dropped Transactions Webhook is used to notify your app anytime a transaction send through your API key gets dropped.`
                    },
                    {
                        label: 'Address Activity',
                        name: 'ADDRESS_ACTIVITY',
                        description: `The Address Activity Webhook allows you to track all ETH, ERC20 and ERC721 transfer events for as many Ethereum addresses as you'd like.`
                    }
                ],
                default: 'MINED_TRANSACTION'
            }
        ];
        this.inputParameters = [
            {
                label: 'App ID',
                name: 'app_id',
                type: 'string',
                default: '',
                description: 'App ID can be found within the URL of your specific app. For example, given the URL https://dashboard.alchemyapi.io/apps/xfu8frt3wf94j7h5 your App ID would be xfu8frt3wf94j7h5',
                show: {
                    'actions.webhook_type': ['MINED_TRANSACTION', 'DROPPED_TRANSACTION']
                }
            },
            {
                label: 'Ethereum Addresses',
                name: 'addresses',
                type: 'string',
                default: '',
                description: 'Ethereum addresses to track the transfer events',
                placeholder: '["<your-Ethereum-Address>"]',
                show: {
                    'actions.webhook_type': ['ADDRESS_ACTIVITY']
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
        //TODO: Verify webhook via signing key
        const returnData = [];
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
module.exports = { nodeClass: AlchemyWebhook };
//# sourceMappingURL=AlchemyWebhook.js.map