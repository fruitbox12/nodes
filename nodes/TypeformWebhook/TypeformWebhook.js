"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class TypeformWebhook {
    constructor() {
        this.webhookMethods = {
            async createWebhook(nodeData, webhookFullUrl) {
                // check for the webhooks
                var _a, _b;
                const credentials = nodeData.credentials;
                const inputParametersData = nodeData.inputParameters;
                const actionsData = nodeData.actions;
                if (inputParametersData === undefined || actionsData === undefined) {
                    throw (0, utils_1.handleErrorMessage)({ message: 'Required data missing' });
                }
                if (credentials === undefined) {
                    throw (0, utils_1.handleErrorMessage)({ message: 'Missing credentials' });
                }
                const accesToken = credentials.accessToken;
                const tag = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.tag;
                const formId = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.formId;
                let webhookExist = false;
                let webhookId = '';
                if (!accesToken)
                    throw (0, utils_1.handleErrorMessage)({ message: 'Access token required' });
                if (!tag)
                    throw (0, utils_1.handleErrorMessage)({ message: 'Tag is required' });
                if (!formId)
                    throw (0, utils_1.handleErrorMessage)({ message: 'FormId is required' });
                const axiosConfig = {
                    method: 'GET',
                    url: `https://api.typeform.com/forms/${formId}/webhooks/${tag}`,
                    headers: { Authorization: `Bearer ${accesToken}` }
                };
                try {
                    const res = await (0, axios_1.default)(axiosConfig);
                    webhookId = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.id;
                    webhookExist = true;
                }
                catch (err) {
                    if (err.response.status !== 404)
                        throw new Error(err);
                }
                if (!webhookExist) {
                    const axiosConfig = {
                        method: 'PUT',
                        url: `https://api.typeform.com/forms/${formId}/webhooks/${tag}`,
                        headers: { Authorization: `Bearer ${accesToken}` },
                        data: {
                            enabled: true,
                            url: webhookFullUrl
                        }
                    };
                    try {
                        const res = await (0, axios_1.default)(axiosConfig);
                        webhookId = (_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.id;
                    }
                    catch (err) {
                        return;
                    }
                }
                return webhookId;
            },
            async deleteWebhook(nodeData) {
                // delete webhook
                const credentials = nodeData.credentials;
                const inputParametersData = nodeData.inputParameters;
                const actionsData = nodeData.actions;
                if (inputParametersData === undefined || actionsData === undefined) {
                    throw (0, utils_1.handleErrorMessage)({ message: 'Required data missing' });
                }
                if (credentials === undefined) {
                    throw (0, utils_1.handleErrorMessage)({ message: 'Missing credentials' });
                }
                const accesToken = credentials.accessToken;
                const tag = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.tag;
                const formId = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.formId;
                const axiosConfig = {
                    method: 'DELETE',
                    url: `https://api.typeform.com/forms/${formId}/webhooks/${tag}`,
                    headers: { Authorization: `Bearer ${accesToken}` }
                };
                try {
                    await (0, axios_1.default)(axiosConfig);
                }
                catch (err) {
                    return false;
                }
                return true;
            }
        };
        this.label = 'Typeform Webhook';
        this.name = 'typeformWebhook';
        this.icon = 'typeform-webhook.svg';
        this.type = 'webhook';
        this.category = 'Communication';
        this.version = 1.0;
        this.description = 'Start workflow whenever Typeform webhook event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Event',
                name: 'webhook_type',
                type: 'options',
                options: [
                    {
                        label: 'Typeform Submission',
                        name: 'typeformSubmission',
                        description: 'Triggered anytime form typeform submit a response sent through typeform webhook.'
                    }
                ],
                default: 'typeformSubmission'
            }
        ];
        this.credentials = [
            // credentialMethod is mandatory field
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Typeform Access Token',
                        name: 'typeformApi'
                    }
                ],
                default: 'typeformApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Form Id',
                name: 'formId',
                type: 'string',
                description: 'Unique ID for the form. Find in your form URL. For example, in the URL "https://mysite.typeform.com/to/u6nXL7" the form_id is u6nXL7',
                show: {
                    'actions.webhook_type': ['typeformSubmission']
                }
            },
            {
                label: 'Webhook Tag',
                name: 'tag',
                type: 'string',
                placeholder: 'mywebhook',
                description: 'The name you want to use for your webhook',
                show: {
                    'actions.webhook_type': ['typeformSubmission']
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
module.exports = { nodeClass: TypeformWebhook };
//# sourceMappingURL=TypeformWebhook.js.map