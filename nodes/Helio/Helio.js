"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Helio {
    constructor() {
        // properties
        this.label = 'Helio';
        this.name = 'helio';
        this.icon = 'helio.png';
        this.type = 'action';
        this.category = 'Payment';
        this.version = 1.0;
        this.description = 'Execute Helio API integration';
        this.incoming = 1;
        this.outgoing = 1;
        // parameter
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get All Transactions',
                        name: 'listTransactions'
                    }
                ],
                default: 'listTransactions'
            }
        ];
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
    }
    async run(nodeData) {
        const { actions, networks, credentials } = nodeData;
        if (actions === undefined || networks === undefined) {
            throw new Error('Required data missing');
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials');
        }
        const network = networks.network;
        const operation = actions.operation;
        const apiKey = credentials.apiKey;
        const secretKey = credentials.secretKey;
        const baseUrl = network === 'test' ? 'https://dev.api.hel.io/v1' : 'https://api.hel.io/v1';
        const returnData = [];
        let responseData;
        let method = 'GET';
        let url = '';
        if (operation === 'listTransactions') {
            url = `${baseUrl}/export/payments?apiKey=${apiKey}`;
        }
        try {
            const axiosConfig = {
                method,
                url,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
            };
            const response = await (0, axios_1.default)(axiosConfig);
            responseData = response.data;
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        }
        else {
            returnData.push(responseData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: Helio };
//# sourceMappingURL=Helio.js.map