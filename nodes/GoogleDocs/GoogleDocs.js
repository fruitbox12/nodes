"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class GoogleDocs {
    constructor() {
        this.loadMethods = {
            async getAllDocsFromDrive(nodeData) {
                const returnData = [];
                const credentials = nodeData.credentials;
                if (credentials === undefined) {
                    return returnData;
                }
                // Get credentials
                const token_type = credentials.token_type;
                const access_token = credentials.access_token;
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `${token_type} ${access_token}`
                };
                const axiosConfig = {
                    method: 'GET',
                    url: `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'`,
                    headers
                };
                let maxRetries = 5;
                do {
                    try {
                        const response = await (0, axios_1.default)(axiosConfig);
                        const responseData = response.data;
                        for (const file of responseData.files || []) {
                            returnData.push({
                                label: file.name,
                                name: file.id
                            });
                        }
                        return returnData;
                    }
                    catch (e) {
                        // Access_token expired
                        if (e.response && e.response.status === 401) {
                            const { access_token } = await (0, utils_1.refreshOAuth2Token)(credentials);
                            headers['Authorization'] = `${token_type} ${access_token}`;
                            continue;
                        }
                        return returnData;
                    }
                } while (--maxRetries);
                return returnData;
            }
        };
        this.label = 'GoogleDocs';
        this.name = 'googleDocs';
        this.icon = 'gdocs.svg';
        this.type = 'action';
        this.category = 'Productivity';
        this.version = 1.0;
        this.description = 'Execute GoogleDocs operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Create New Document',
                        name: 'create',
                        description: 'Create a new document'
                    },
                    {
                        label: 'Get All Values',
                        name: 'getAll',
                        description: 'Get all values from a document'
                    },
                    {
                        label: 'Update a Document',
                        name: 'update',
                        description: 'Update a document'
                    }
                ],
                default: 'create'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Google Docs OAuth2',
                        name: 'googleDocsOAuth2Api'
                    }
                ],
                default: 'googleDocsOAuth2Api'
            }
        ];
        this.inputParameters = [
            {
                label: 'Document Name',
                name: 'documentName',
                type: 'string',
                optional: true,
                description: 'Name of the document to create. Default to Untitled document.',
                show: {
                    'actions.operation': ['create']
                }
            },
            {
                label: 'Document',
                name: 'documentId',
                type: 'asyncOptions',
                loadMethod: 'getAllDocsFromDrive',
                hide: {
                    'actions.operation': ['create']
                }
            },
            /**
             *  batch update
             */
            {
                label: 'Requests',
                name: 'requests',
                description: "update a document. You can simply add one reequest data or add multiple request data. If request format is invalid, document won't be updated. The details about how to write a request data can be found at https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate",
                type: 'json',
                placeholder: `[
                    {
                        "insertText": {
                          "text": "new text",
                            "location": {
                                "index": 1 
                            }
                        }
                    },
                    {
                        "insertTable": {
                            "rows": 3,
                            "columns": 4,
                            "endOfSegmentLocation":{
                            }
                        }
                    }
]`,
                show: {
                    'actions.operation': ['update']
                }
            }
        ];
    }
    async run(nodeData) {
        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (actionsData === undefined) {
            throw new Error('Required data missing!');
        }
        if (credentials === undefined) {
            throw new Error('Missing credential!');
        }
        // Get operation
        const operation = actionsData.operation;
        // Get credentials
        const token_type = credentials.token_type;
        const access_token = credentials.access_token;
        const returnData = [];
        let responseData;
        let url = '';
        const queryParameters = {};
        let queryBody = {};
        let method = 'POST';
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `${token_type} ${access_token}`
        };
        const documentId = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.documentId;
        let maxRetries = 5;
        let oAuth2RefreshedData = {};
        do {
            try {
                if (operation === 'create') {
                    url = 'https://docs.googleapis.com/v1/documents';
                    const documentName = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.documentName;
                    if (documentName) {
                        queryBody['title'] = documentName;
                    }
                }
                else if (operation === 'getAll') {
                    method = 'GET';
                    url = `https://docs.googleapis.com/v1/documents/${documentId}`;
                }
                else if (operation === 'update') {
                    // batch update
                    url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
                    const requestsString = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.requests;
                    queryBody['requests'] = JSON.parse(requestsString);
                }
                const axiosConfig = {
                    method,
                    url,
                    headers
                };
                if (Object.keys(queryParameters).length > 0) {
                    axiosConfig.params = queryParameters;
                    axiosConfig.paramsSerializer = (params) => (0, utils_1.serializeQueryParams)(params);
                }
                if (Object.keys(queryBody).length > 0) {
                    axiosConfig.data = queryBody;
                }
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
                break;
            }
            catch (error) {
                // Access_token expired
                if (error.response && error.response.status === 401) {
                    const { access_token, expires_in } = await (0, utils_1.refreshOAuth2Token)(credentials);
                    headers['Authorization'] = `${token_type} ${access_token}`;
                    oAuth2RefreshedData = { access_token, expires_in };
                    continue;
                }
                throw (0, utils_1.handleErrorMessage)(error);
            }
        } while (--maxRetries);
        if (maxRetries <= 0) {
            throw new Error('Error executing GoogleDocs node. Max retries limit was reached.');
        }
        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        }
        else {
            returnData.push(responseData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData, oAuth2RefreshedData);
    }
}
module.exports = { nodeClass: GoogleDocs };
//# sourceMappingURL=GoogleDocs.js.map