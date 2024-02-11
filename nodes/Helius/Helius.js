"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class Helius {
    constructor() {
        // properties
        this.label = 'Helius';
        this.name = 'helius';
        this.icon = 'helius.png';
        this.type = 'action';
        this.category = 'Network Provider';
        this.version = 1.0;
        this.description = 'Perform Helius on-chain operations on Solana';
        this.incoming = 1;
        this.outgoing = 1;
        // parameter
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get NFT events',
                        name: 'nft-events',
                        description: 'Returns all NFT events given an address.'
                    },
                    {
                        label: 'Get NFT Portfolio',
                        name: 'nfts',
                        description: 'Returns all the NFTs that the given address currently holds.'
                    },
                    {
                        label: 'Name Lookup',
                        name: 'names',
                        description: 'Does a reverse lookup with the given address for Solana Naming Service domains.'
                    },
                    {
                        label: 'Get Token Balances',
                        name: 'balances',
                        description: 'Returns the native Solana balance (in lamports) and all token balances for a given address.'
                    }
                ],
                default: 'balances'
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
                        label: 'Helius API Key',
                        name: 'heliusApi'
                    }
                ],
                default: 'heliusApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                optional: false
            }
        ];
    }
    async run(nodeData) {
        const { actions, inputParameters, credentials } = nodeData;
        if (actions === undefined || inputParameters === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const api = actions.api;
        const apiKey = credentials.apiKey;
        const address = inputParameters.address;
        const apiURL = 'https://api.helius.xyz/v0/addresses';
        const resource = `${api}`;
        const options = `api-key=${apiKey}`;
        const url = `${apiURL}/${address}/${resource}?${options}`;
        const returnData = [];
        let responseData;
        try {
            const axiosConfig = {
                method: 'GET',
                url,
                headers: { 'Content-Type': 'application/json' }
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
module.exports = { nodeClass: Helius };
//# sourceMappingURL=Helius.js.map