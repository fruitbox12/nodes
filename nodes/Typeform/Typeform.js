"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Typeform {
    constructor() {
        this.label = 'Typeform';
        this.name = 'typeform';
        this.icon = 'typeform-icon.svg';
        this.type = 'action';
        this.category = 'Communication';
        this.version = 1.0;
        this.description = 'Perform Typeform operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get all forms',
                        name: 'getAllForms',
                        description: 'Returns all the forms associated with your account'
                    },
                    {
                        label: 'Get Typeform Responses',
                        name: 'getTypeformResponses',
                        description: 'Returns the submissions for your typeforms in JSON format'
                    },
                    {
                        label: 'Create Typeform ',
                        name: 'createTypeform',
                        description: 'Creates a typeform for you'
                    }
                ],
                default: 'getAllForms'
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
                        label: 'Typeform API Key',
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
                description: 'The form id to retrieve all the responses to your typeform',
                show: {
                    'actions.api': ['getTypeformResponses']
                }
            },
            {
                label: 'Request Body',
                name: 'requestBody',
                type: 'json',
                description: 'The json object to create or update your typeform',
                show: {
                    'actions.api': ['createTypeform']
                }
            }
        ];
    }
    async run(nodeData) {
        // function to start running the node
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        // GET api
        const api = actionData.api;
        // GET credentials
        const apiKey = credentials.apiKey;
        // GET formId
        const formId = inputParametersData.formId;
        let requestBody = inputParametersData.requestBody;
        requestBody = requestBody ? requestBody.replace(/\s/g, '') : requestBody;
        const returnData = [];
        let responseData;
        if (api === 'getAllForms') {
            try {
                const queryParameters = {};
                let url = `https://api.typeform.com/forms`;
                const axiosConfig = {
                    method: 'GET',
                    url,
                    params: queryParameters,
                    paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                    headers: { 'Content-Type': 'application/json', authorization: `bearer ${apiKey}` }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
                throw (0, utils_1.handleErrorMessage)(error);
            }
            if (Array.isArray(responseData))
                returnData.push(...responseData);
            else
                returnData.push(responseData);
            return (0, utils_1.returnNodeExecutionData)(returnData);
        }
        else if (api === 'getTypeformResponses') {
            try {
                const queryParameters = {};
                let url = `https://api.typeform.com/forms/${formId}/responses`;
                const axiosConfig = {
                    method: 'GET',
                    url,
                    params: queryParameters,
                    paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                    headers: { 'Content-Type': 'application/json', authorization: `bearer ${apiKey}` }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
                throw (0, utils_1.handleErrorMessage)(error);
            }
            if (Array.isArray(responseData))
                returnData.push(...responseData);
            else
                returnData.push(responseData);
            return (0, utils_1.returnNodeExecutionData)(returnData);
        }
        else if (api === 'createTypeform') {
            try {
                const body = JSON.parse(requestBody);
                let url = `https://api.typeform.com/forms`;
                const axiosConfig = {
                    method: 'POST',
                    url,
                    data: Object.assign({}, body),
                    headers: { 'Content-Type': 'application/json; charset=utf-8', authorization: `bearer ${apiKey}` }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
                throw (0, utils_1.handleErrorMessage)(error);
            }
            if (Array.isArray(responseData))
                returnData.push(...responseData);
            else
                returnData.push(responseData);
            return (0, utils_1.returnNodeExecutionData)(returnData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: Typeform };
//# sourceMappingURL=Typeform.js.map