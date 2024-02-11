"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const is_localhost_ip_1 = __importDefault(require("is-localhost-ip"));
class GraphQL {
    constructor() {
        this.label = 'GraphQL';
        this.name = 'graphQL';
        this.icon = 'graphql.svg';
        this.type = 'action';
        this.category = 'Development';
        this.version = 1.0;
        this.description = 'Execute GraphQL request';
        this.incoming = 1;
        this.outgoing = 1;
        this.credentials = [
            {
                label: 'Authorization',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Basic Auth',
                        name: 'httpBasicAuth'
                    },
                    {
                        label: 'Bearer Token Auth',
                        name: 'httpBearerTokenAuth'
                    },
                    {
                        label: 'No Auth',
                        name: 'noAuth',
                        hideRegisteredCredential: true
                    }
                ],
                default: 'noAuth'
            }
        ];
        this.inputParameters = [
            {
                label: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'http://<your-url>.com/'
            },
            {
                label: 'Headers',
                name: 'headers',
                type: 'array',
                array: [
                    {
                        label: 'Key',
                        name: 'key',
                        type: 'string',
                        default: ''
                    },
                    {
                        label: 'Value',
                        name: 'value',
                        type: 'string',
                        default: ''
                    }
                ],
                optional: true
            },
            {
                label: 'GraphQL Body',
                name: 'body',
                type: 'json',
                placeholder: `{
  me {
    name
  }
}`,
                optional: true
            },
            {
                label: 'Variables',
                name: 'variables',
                type: 'json',
                placeholder: '{"var1": "value1"}',
                optional: true
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const credentialMethod = credentials.credentialMethod;
        const url = inputParametersData.url;
        const headers = inputParametersData.headers || [];
        const body = inputParametersData.body;
        const variables = inputParametersData.variables;
        const returnData = {};
        const urlHost = new URL(url).hostname;
        if ((await (0, is_localhost_ip_1.default)(urlHost)) || urlHost === '169.254.169.254' || urlHost === '[fd00:ec2::254]') {
            throw new Error('URL not allowed');
        }
        try {
            const queryHeaders = {};
            let data = {};
            for (const header of headers) {
                const key = header.key;
                const value = header.value;
                if (key)
                    queryHeaders[key] = value;
            }
            if (body) {
                data = { query: body.replace(/\s/g, ' ') };
            }
            if (variables) {
                const variablesJSON = JSON.parse(variables.replace(/\s/g, ''));
                if (Object.keys(variablesJSON).length) {
                    data.variables = variablesJSON;
                }
            }
            if (credentialMethod === 'httpBearerTokenAuth') {
                queryHeaders['Authorization'] = `Bearer ${credentials.token}`;
            }
            const axiosConfig = {
                method: 'POST',
                url
            };
            if (Object.keys(data).length) {
                axiosConfig.data = data;
            }
            if (Object.keys(queryHeaders).length) {
                axiosConfig.headers = queryHeaders;
            }
            if (credentialMethod === 'httpBasicAuth') {
                axiosConfig.auth = {
                    username: credentials.userName,
                    password: credentials.password
                };
            }
            const response = await (0, axios_1.default)(axiosConfig);
            returnData['data'] = response.data;
            returnData['status'] = response.status;
            returnData['statusText'] = response.statusText;
            returnData['headers'] = response.headers;
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: GraphQL };
//# sourceMappingURL=GraphQL.js.map