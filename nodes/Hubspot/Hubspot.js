"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Hubspot {
    constructor() {
        this.loadMethods = {
            async getContacts(nodeData) {
                var _a;
                const returnData = [];
                const credentials = nodeData.credentials;
                const accessToken = credentials.accessToken;
                if (!accessToken)
                    return returnData;
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://api.hubapi.com/crm/v3/objects/contacts`,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const contacts = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results;
                    contacts.forEach((contact) => {
                        const data = {
                            label: contact.properties.email,
                            name: contact.id
                        };
                        returnData.push(data);
                    });
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            }
        };
        this.label = 'Hubspot';
        this.name = 'hubspot';
        this.icon = 'hubspot.svg';
        this.type = 'action';
        this.category = 'Communication';
        this.version = 2.0;
        this.description = 'Execute Hubspot API integration';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Create new contact',
                        name: 'addContact',
                        description: 'Create a new contact'
                    },
                    {
                        label: 'Get contact',
                        name: 'getContact',
                        description: 'Get a contact details'
                    },
                    {
                        label: 'Delete contact',
                        name: 'deleteContact',
                        description: 'Delete a contact'
                    },
                    {
                        label: 'Get list of contacts',
                        name: 'listContacts',
                        description: 'Get a list of contact details'
                    }
                ]
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
                        label: 'Hubspot Credentials',
                        name: 'hubspotCredential'
                    }
                ],
                default: 'hubspotCredential'
            }
        ];
        this.inputParameters = [
            {
                label: 'Customer Email',
                name: 'email',
                type: 'string',
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Customer First Name',
                name: 'firstname',
                type: 'string',
                optional: true,
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Customer Last Name',
                name: 'lastname',
                type: 'string',
                optional: true,
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Customer Company',
                name: 'company',
                type: 'string',
                optional: true,
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Contact',
                name: 'contactId',
                type: 'asyncOptions',
                loadMethod: 'getContacts',
                show: {
                    'actions.operation': ['getContact', 'deleteContact']
                }
            }
        ];
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (actionData === undefined) {
            throw (0, utils_1.handleErrorMessage)({ message: 'Required data missing' });
        }
        if (credentials === undefined) {
            throw new Error('Missing credential!');
        }
        const accessToken = credentials.accessToken;
        const operation = actionData.operation;
        async function makeApiCall(method, url, operation, body) {
            const axiosConfig = {
                method: method,
                url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            if (method === 'post' && body)
                axiosConfig.data = body;
            let responseData = [];
            try {
                const response = await (0, axios_1.default)(axiosConfig);
                if (response === null || response === void 0 ? void 0 : response.data) {
                    responseData.push(response === null || response === void 0 ? void 0 : response.data);
                }
            }
            catch (err) {
                if (operation === 'addContact' && err.response.data.message.includes('Contact already exists')) {
                    responseData.push(err.response.data);
                    // dont throw error
                }
                else
                    throw (0, utils_1.handleErrorMessage)(err);
            }
            return responseData;
        }
        let returnData = [];
        let url = `https://api.hubapi.com/crm/v3/objects`;
        const contactId = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.contactId;
        if (operation === 'listContacts') {
            returnData = await makeApiCall('get', `${url}/contacts`, operation);
        }
        else if (operation === 'getContact') {
            returnData = await makeApiCall('get', `${url}/contacts/${contactId}`, operation);
        }
        else if (operation === 'deleteContact') {
            returnData = await makeApiCall('delete', `${url}/contacts/${contactId}`, operation);
        }
        else if (operation === 'addContact') {
            const email = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.email;
            const firstname = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.firstname;
            const lastname = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.lastname;
            const company = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.company;
            const body = {
                properties: {
                    email
                }
            };
            if (firstname)
                body.properties.firstname = firstname;
            if (lastname)
                body.properties.lastname = lastname;
            if (company)
                body.properties.company = company;
            const createContactResponse = await makeApiCall('post', `${url}/contacts`, operation, body);
            if (createContactResponse[0].message && createContactResponse[0].message.includes('Contact already exists')) {
                const listContactsResponse = await makeApiCall('get', `${url}/contacts`, operation);
                const contacts = listContactsResponse[0].results || [];
                const findContact = contacts.find((contact) => contact.properties.email === email);
                if (findContact)
                    return (0, utils_1.returnNodeExecutionData)(findContact);
            }
            returnData = createContactResponse;
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: Hubspot };
//# sourceMappingURL=Hubspot.js.map