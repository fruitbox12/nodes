"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class HelioWebhook {
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
                const apiKey = credentials.apiKey;
                const secretKey = credentials.secretKey;
                const network = networksData.network;
                const baseUrl = network === 'test' ? 'https://dev.api.hel.io/v1' : 'https://api.hel.io/v1';
                const paylinkId = inputParametersData.paylinkId;
                const streamId = inputParametersData.streamId;
                const event = actionsData.event;
                const payType = paylinkId ? 'paylink' : 'stream';
                const payTypeId = paylinkId ? 'paylinkId' : 'streamId';
                const payId = paylinkId ? paylinkId : streamId;
                const axiosConfig = {
                    method: 'GET',
                    url: `${baseUrl}/webhook/${payType}/transaction?apiKey=${apiKey}&${payTypeId}=${payId}`,
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
                };
                try {
                    const response = await (0, axios_1.default)(axiosConfig);
                    const webhooks = response.data;
                    let webhookExist = false;
                    for (const webhook of webhooks) {
                        if (webhook.events.includes(event) && webhook.targetUrl === webhookFullUrl) {
                            // Check match pay link id
                            if (paylinkId) {
                                if (webhook.paylink === paylinkId) {
                                    webhookExist = true;
                                    break;
                                }
                            }
                            // Check match pay stream id
                            if (streamId) {
                                if (webhook.stream === streamId) {
                                    webhookExist = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!webhookExist) {
                        const data = {
                            events: [event],
                            targetUrl: webhookFullUrl
                        };
                        if (paylinkId)
                            data.paylinkId = paylinkId;
                        if (streamId)
                            data.streamId = streamId;
                        const axiosCreateConfig = {
                            method: 'POST',
                            url: `${baseUrl}/webhook/${payType}/transaction?apiKey=${apiKey}`,
                            data,
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
                        };
                        const response = await (0, axios_1.default)(axiosCreateConfig);
                        const createResponseData = response.data;
                        if (createResponseData && createResponseData.id) {
                            return createResponseData.id;
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
                const inputParametersData = nodeData.inputParameters;
                const networksData = nodeData.networks;
                const actionsData = nodeData.actions;
                if (inputParametersData === undefined || actionsData === undefined || networksData === undefined) {
                    throw new Error('Required data missing');
                }
                if (credentials === undefined) {
                    throw new Error('Missing credentials');
                }
                const apiKey = credentials.apiKey;
                const secretKey = credentials.secretKey;
                const network = networksData.network;
                const baseUrl = network === 'test' ? 'https://dev.api.hel.io/v1' : 'https://api.hel.io/v1';
                const paylinkId = inputParametersData.paylinkId;
                const payType = paylinkId ? 'paylink' : 'stream';
                const axiosConfig = {
                    method: 'DELETE',
                    url: `${baseUrl}/webhook/${payType}/transaction/${webhookId}?apiKey=${apiKey}`,
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
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
        this.label = 'Helio Webhook';
        this.name = 'helioWebhook';
        this.icon = 'helio.png';
        this.type = 'webhook';
        this.category = 'Payment';
        this.version = 1.0;
        this.description = 'Start workflow whenever Helio webhook event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                description: 'Network to execute API: Test or Prod',
                options: [
                    {
                        label: 'TEST',
                        name: 'test',
                        description: 'Test network: https://dev.hel.io/'
                    },
                    {
                        label: 'PROD',
                        name: 'prod',
                        description: 'Prod network: https://hel.io/'
                    }
                ],
                default: 'test'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Helio API Key',
                        name: 'helioApi'
                    }
                ],
                default: 'helioApi'
            }
        ];
        this.actions = [
            {
                label: 'Event',
                name: 'event',
                type: 'options',
                options: [
                    {
                        label: 'New payment on Pay Link',
                        name: 'CREATED',
                        description: 'Triggered upon new payment on the Pay Link'
                    },
                    {
                        label: 'New subscription on Pay Stream',
                        name: 'STARTED',
                        description: `Triggered upon new subscription/stream started on the Pay Stream`
                    },
                    {
                        label: 'Cancellation of subscription on Pay Stream',
                        name: 'ENDED',
                        description: `Triggered when a subscription/stream was stopped/ended on the Pay Stream`
                    }
                ]
            }
        ];
        this.inputParameters = [
            {
                label: 'Pay Link Id',
                name: 'paylinkId',
                type: 'string',
                placeholder: '63ea24cc1ea62a8e0d272444',
                description: 'For example, pay link id of https://hel.io/pay/63ea24cc1ea62a8e0d272444 is 63ea24cc1ea62a8e0d272444',
                show: {
                    'actions.event': ['CREATED']
                }
            },
            {
                label: 'Pay Stream Id',
                name: 'streamId',
                type: 'string',
                placeholder: '63ea543143507a1df4f6fccf',
                description: 'For example, pay stream id of https://hel.io/pay/63ea543143507a1df4f6fccf is 63ea543143507a1df4f6fccf',
                show: {
                    'actions.event': ['STARTED', 'ENDED']
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
module.exports = { nodeClass: HelioWebhook };
//# sourceMappingURL=HelioWebhook.js.map