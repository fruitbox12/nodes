"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Mailchimp {
    constructor() {
        this.loadMethods = {
            async getCampaigns(nodeData) {
                var _a;
                const returnData = [];
                const credentials = nodeData.credentials;
                const apiKey = credentials.apiKey;
                const dc = ((apiKey && apiKey.split('-')[1]) || '');
                if (!apiKey || !dc)
                    return returnData;
                try {
                    const authObj = { username: '', password: apiKey };
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://${dc}.api.mailchimp.com/3.0/campaigns`,
                        headers: { 'Content-Type': 'application/json' },
                        auth: Object.assign({}, authObj)
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const campaigns = (_a = response.data) === null || _a === void 0 ? void 0 : _a.campaigns;
                    campaigns.forEach((campaign) => {
                        const data = {
                            label: campaign.settings.title || campaign.web_id,
                            name: campaign.id
                        };
                        returnData.push(data);
                    });
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
            async getLists(nodeData) {
                var _a;
                const returnData = [];
                const credentials = nodeData.credentials;
                const apiKey = credentials.apiKey;
                const dc = ((apiKey && apiKey.split('-')[1]) || '');
                if (!apiKey || !dc)
                    return returnData;
                try {
                    const authObj = { username: '', password: apiKey };
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://${dc}.api.mailchimp.com/3.0/lists`,
                        headers: { 'Content-Type': 'application/json' },
                        auth: Object.assign({}, authObj)
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const lists = (_a = response.data) === null || _a === void 0 ? void 0 : _a.lists;
                    lists.forEach((list) => {
                        const data = {
                            label: list.name || list.web_id,
                            name: list.id
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
        this.label = 'Mailchimp';
        this.name = 'mailchimp';
        this.icon = 'mailchimp.svg';
        this.type = 'action';
        this.category = 'Communication';
        this.version = 2.0;
        this.description = 'Execute Mailchimp API integration';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get list of campaigns',
                        name: 'listCampaigns',
                        description: 'Returns the list of campaigns'
                    },
                    {
                        label: 'Get campaign',
                        name: 'getCampaign',
                        description: 'Return single campaign'
                    },
                    {
                        label: 'Delete campaign',
                        name: 'deleteCampaign',
                        description: 'It will delete campaigns'
                    },
                    {
                        label: 'Add user to subscribe list',
                        name: 'addUser',
                        description: 'Add or update user to a subscribe list'
                    },
                    {
                        label: 'Get user',
                        name: 'getUser',
                        description: 'Get information about a specific audience'
                    },
                    {
                        label: 'Get list of users',
                        name: 'listUsers',
                        description: 'Get information about list of members in a specific audience list'
                    }
                ],
                default: 'listCampaigns'
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
                        label: 'Mailchimp Credentials',
                        name: 'mailChimpCredential'
                    }
                ],
                default: 'mailChimpCredential'
            }
        ];
        this.inputParameters = [
            {
                label: 'Campaign',
                name: 'campaignId',
                type: 'asyncOptions',
                loadMethod: 'getCampaigns',
                show: {
                    'actions.operation': ['deleteCampaign', 'getCampaign']
                }
            },
            {
                label: 'Audience List',
                name: 'listId',
                type: 'asyncOptions',
                loadMethod: 'getLists',
                show: {
                    'actions.operation': ['addUser', 'getUser', 'listUsers']
                }
            },
            {
                label: 'Customer Email',
                name: 'email',
                type: 'string',
                show: {
                    'actions.operation': ['addUser', 'getUser']
                }
            }
        ];
    }
    async run(nodeData) {
        var _a, _b, _c, _d, _e, _f, _g;
        // function to make calls
        let authObj;
        async function makeApiCall(method, url, operation, body) {
            const axiosConfig = {
                method: method,
                url,
                headers: { 'Content-Type': 'application/json' },
                auth: Object.assign({}, authObj)
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
                if (operation === 'addUser' && err.response.data.title.includes('Member Exists')) {
                    // dont throw error
                }
                else
                    throw (0, utils_1.handleErrorMessage)(err);
            }
            return responseData;
        }
        // function to start running the node
        const actionData = nodeData.actions;
        const credentials = nodeData.credentials;
        if (actionData === undefined || credentials === undefined) {
            throw (0, utils_1.handleErrorMessage)({ message: 'Required data missing' });
        }
        const operation = actionData.operation;
        const apiKey = credentials.apiKey;
        const dc = ((apiKey && apiKey.split('-')[1]) || '');
        if (!apiKey) {
            throw (0, utils_1.handleErrorMessage)({ message: 'Api key is required' });
        }
        if (!dc) {
            throw (0, utils_1.handleErrorMessage)({ message: 'Date center is required' });
        }
        let campaignId;
        if (['deleteCampaign', 'getCampaign'].includes(operation)) {
            if (((_a = nodeData === null || nodeData === void 0 ? void 0 : nodeData.inputParameters) === null || _a === void 0 ? void 0 : _a.campaignId) === undefined)
                throw (0, utils_1.handleErrorMessage)({ message: 'Campaign id is required' });
            else {
                campaignId = (_b = nodeData === null || nodeData === void 0 ? void 0 : nodeData.inputParameters) === null || _b === void 0 ? void 0 : _b.campaignId;
            }
        }
        let returnData = [];
        let url = `https://${dc}.api.mailchimp.com/3.0/campaigns`;
        authObj = { username: '', password: apiKey };
        if (['deleteCampaign', 'getCampaign'].includes(operation))
            url += `/${campaignId}`;
        if (operation === 'listCampaigns') {
            returnData = await makeApiCall('get', url, operation);
        }
        else if (operation === 'getCampaign') {
            returnData = await makeApiCall('get', url, operation);
        }
        else if (operation === 'deleteCampaign') {
            returnData = await makeApiCall('delete', url, operation);
        }
        else if (operation === 'getUser') {
            const audienceList = (_c = nodeData === null || nodeData === void 0 ? void 0 : nodeData.inputParameters) === null || _c === void 0 ? void 0 : _c.listId;
            const email = (_d = nodeData === null || nodeData === void 0 ? void 0 : nodeData.inputParameters) === null || _d === void 0 ? void 0 : _d.email;
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members/${email}`;
            returnData = await makeApiCall('get', url, operation);
        }
        else if (operation === 'listUsers') {
            const audienceList = (_e = nodeData === null || nodeData === void 0 ? void 0 : nodeData.inputParameters) === null || _e === void 0 ? void 0 : _e.listId;
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members`;
            returnData = await makeApiCall('get', url, operation);
        }
        else if (operation === 'addUser') {
            const audienceList = (_f = nodeData === null || nodeData === void 0 ? void 0 : nodeData.inputParameters) === null || _f === void 0 ? void 0 : _f.listId;
            const email = (_g = nodeData === null || nodeData === void 0 ? void 0 : nodeData.inputParameters) === null || _g === void 0 ? void 0 : _g.email;
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members`;
            const body = {
                email_address: email,
                status: 'subscribed'
            };
            await makeApiCall('post', url, operation, body);
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members/${email}`;
            returnData = await makeApiCall('get', url, operation);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: Mailchimp };
//# sourceMappingURL=Mailchimp.js.map