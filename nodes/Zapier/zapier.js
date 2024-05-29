"use strict";
const axios = require("axios");
const utils = require("../../src/utils");

class Zapier {
    constructor() {
        this.label = 'Zapier';
        this.name = 'zapier';
        this.icon = 'zapier.svg';
        this.type = 'action';
        this.category = 'Integrations';
        this.version = 1.0;
        this.description = 'Execute Zapier API requests';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            // Define the endpoints
            { label: 'Get Apps [v1]', name: 'apps/v1', method: 'GET' },
            { label: 'Get Apps [v2]', name: 'apps/v2', method: 'GET' },
            { label: 'Get Categories', name: 'categories', method: 'GET' },
            { label: 'Create Account', name: 'accounts', method: 'POST' },
            { label: 'User Profile', name: 'accounts/profile', method: 'GET' },
            { label: 'Get Zap Templates', name: 'zap-templates', method: 'GET' },
            { label: 'Create a Zap', name: 'zaps', method: 'POST' },
            { label: 'Get Zaps [v1]', name: 'zaps/v1', method: 'GET' },
            { label: 'Get Zaps [v2]', name: 'zaps/v2', method: 'GET' },
            { label: 'Get Actions', name: 'actions', method: 'GET' },
            { label: 'Get Input Fields', name: 'actions/input-fields', method: 'POST' },
            { label: 'Get Output Fields', name: 'actions/output-fields', method: 'POST' },
            { label: 'Get Choices', name: 'actions/choices', method: 'POST' },
            { label: 'Step Test', name: 'actions/step-test', method: 'POST' },
            { label: 'Get Authentications', name: 'authentications', method: 'GET' },
            { label: 'Create Authentication', name: 'authentications', method: 'POST' },
        ];
        this.credentials = [
            {
                label: 'Authorization',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Bearer Token Auth',
                        name: 'zapierBearerTokenAuth'
                    }
                ],
                default: 'zapierBearerTokenAuth'
            }
        ];
        this.inputParameters = [
            {
                label: 'Payload',
                name: 'payload',
                type: 'json',
                placeholder: '{"key": "value"}',
                optional: true
            },
            {
                label: 'Query Parameters',
                name: 'queryParams',
                type: 'json',
                placeholder: '{"key": "value"}',
                optional: true
            }
        ];
    }

    async run(nodeData) {
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        
        if (!actionData || !inputParametersData || !credentials) {
            throw new Error('Required data missing');
        }

        const endpoint = actionData.endpoint;
        const authToken = credentials.token;
        const payload = inputParametersData.payload || {};
        const queryParams = inputParametersData.queryParams || {};
        
        const url = `https://api.zapier.com/${endpoint}`;
        const method = actionData.method;
        
        try {
            const response = await axios({
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                params: method === 'GET' ? queryParams : undefined,
                data: method === 'POST' ? payload : undefined
            });

            return utils.returnNodeExecutionData({ data: response.data, status: response.status, statusText: response.statusText });
        } catch (error) {
            throw utils.handleErrorMessage(error);
        }
    }
}

module.exports = { nodeClass: Zapier };
