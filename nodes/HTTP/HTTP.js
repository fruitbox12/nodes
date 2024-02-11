"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const is_localhost_ip_1 = __importDefault(require("is-localhost-ip"));
class HTTP {
    constructor() {
        this.label = 'HTTP';
        this.name = 'http';
        this.icon = 'http.svg';
        this.type = 'action';
        this.category = 'Development';
        this.version = 1.0;
        this.description = 'Execute HTTP request';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Method',
                name: 'method',
                type: 'options',
                options: [
                    {
                        label: 'GET',
                        name: 'GET'
                    },
                    {
                        label: 'POST',
                        name: 'POST'
                    },
                    {
                        label: 'PUT',
                        name: 'PUT'
                    },
                    {
                        label: 'DELETE',
                        name: 'DELETE'
                    },
                    {
                        label: 'HEAD',
                        name: 'HEAD'
                    }
                ],
                default: 'GET',
                description: 'HTTP method'
            }
        ];
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
                label: 'Query Params',
                name: 'queryParams',
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
                label: 'Body Type',
                name: 'bodyType',
                type: 'options',
                options: [
                    {
                        label: 'JSON',
                        name: 'json'
                    },
                    {
                        label: 'Text',
                        name: 'text'
                    }
                ],
                default: 'json',
                optional: true
            },
            {
                label: 'Body',
                name: 'body',
                type: 'json',
                show: {
                    'inputParameters.bodyType': ['json']
                },
                placeholder: '{"var1": "value1"}',
                optional: true
            },
            {
                label: 'Body',
                name: 'body',
                type: 'string',
                show: {
                    'inputParameters.bodyType': ['text']
                },
                default: '',
                optional: true
            },
            {
                label: 'Response Type',
                name: 'responseType',
                type: 'options',
                options: [
                    {
                        label: 'JSON',
                        name: 'json'
                    },
                    {
                        label: 'Text',
                        name: 'text'
                    },
                    {
                        label: 'Array Buffer',
                        name: 'arraybuffer'
                    },
                    {
                        label: 'Raw (Base64)',
                        name: 'base64'
                    }
                ],
                optional: true
            }
        ];
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const method = actionData.method;
        const credentialMethod = credentials.credentialMethod;
        const url = inputParametersData.url;
        const headers = inputParametersData.headers || [];
        const queryParams = inputParametersData.queryParams || [];
        const bodyType = inputParametersData.bodyType;
        const body = inputParametersData.body;
        const responseType = inputParametersData.responseType;
        const returnData = {};
        const urlHost = new URL(url).hostname;
        if ((await (0, is_localhost_ip_1.default)(urlHost)) || urlHost === '169.254.169.254' || urlHost === '[fd00:ec2::254]') {
            throw new Error('URL not allowed');
        }
        try {
            const queryParameters = {};
            const queryHeaders = {};
            let data = {};
            for (const params of queryParams) {
                const key = params.key;
                const value = params.value;
                if (key)
                    queryParameters[key] = value;
            }
            for (const header of headers) {
                const key = header.key;
                const value = header.value;
                if (key)
                    queryHeaders[key] = value;
            }
            if (bodyType && bodyType === 'json' && body) {
                data = JSON.parse(body.replace(/\s/g, ' '));
            }
            else if (bodyType && bodyType === 'text' && body) {
                data = body;
            }
            if (credentialMethod === 'httpBearerTokenAuth') {
                queryHeaders['Authorization'] = `Bearer ${credentials.token}`;
            }
            const axiosConfig = {
                method: method,
                url: url
            };
            if (Object.keys(data).length) {
                axiosConfig.data = data;
            }
            if (Object.keys(queryParameters).length) {
                axiosConfig.params = queryParameters;
                axiosConfig.paramsSerializer = (params) => (0, utils_1.serializeQueryParams)(params);
            }
            if (Object.keys(queryHeaders).length) {
                axiosConfig.headers = queryHeaders;
            }
            if (responseType) {
                axiosConfig.responseType = responseType;
                if (responseType === 'base64')
                    axiosConfig.responseType = 'arraybuffer';
            }
            if (credentialMethod === 'httpBasicAuth') {
                axiosConfig.auth = {
                    username: credentials.userName,
                    password: credentials.password
                };
            }
            const response = await (0, axios_1.default)(axiosConfig);
            if (responseType && responseType === 'base64') {
                const content = `data:${response.headers['content-type']};base64,${response.data.toString('base64')}`;
                const attachment = {
                    contentType: response.headers['content-type'],
                    size: response.headers['content-length'],
                    content
                };
                returnData['data'] = content;
                returnData.attachments = [attachment];
            }
            else {
                returnData['data'] = response.data;
            }
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
module.exports = { nodeClass: HTTP };
//# sourceMappingURL=HTTP.js.map