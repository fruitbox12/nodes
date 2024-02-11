"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
class Solscan {
    constructor() {
        // properties
        this.label = 'Solscan';
        this.name = 'solscan';
        this.icon = 'solscan.png';
        this.type = 'action';
        this.category = 'Block Explorer';
        this.version = 1.0;
        this.description = 'Solscan Public API';
        this.incoming = 1;
        this.outgoing = 1;
        // parameter
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                description: 'Choose the API to execute',
                options: [
                    // Account
                    {
                        label: 'Get token balances',
                        name: constants_1.OPERATION.GET_TOKEN_BALANCES,
                        description: 'Get tokens balances of the given address'
                    },
                    {
                        label: 'Get transactions',
                        name: constants_1.OPERATION.GET_TRANSACTIONS,
                        description: 'Get list of transactions of the given account. MaxLimit 50 records per request'
                    },
                    {
                        label: 'Get staking accounts',
                        name: constants_1.OPERATION.GET_STAKING_ACCOUNTS,
                        description: 'Get staking accounts of the given account'
                    },
                    {
                        label: 'Get token transfers',
                        name: constants_1.OPERATION.GET_TOKEN_TRANSFERS,
                        description: 'Get list of transactions make tokenBalance changes. MaxLimit 50 records per request'
                    },
                    {
                        label: 'Get Solana transfers',
                        name: constants_1.OPERATION.GET_SOL_TRANSFERS,
                        description: 'Get list of SOL transfers. MaxLimit 50 records per request'
                    },
                    {
                        label: 'Get account info',
                        name: constants_1.OPERATION.GET_ACCOUNT_INFO,
                        description: 'Get overall account information, including program account, NFT metadata information'
                    },
                    // Transaction
                    {
                        label: 'Get last transactions',
                        name: constants_1.OPERATION.GET_LAST_TRANSACTIONS,
                        description: 'Get last [limit] transactions'
                    },
                    {
                        label: 'Get transaction info',
                        name: constants_1.OPERATION.GET_TRANSACTION_INFO,
                        description: 'Detail information of given transaction signature'
                    },
                    // Token
                    {
                        label: 'Get token holder',
                        name: constants_1.OPERATION.GET_TOKEN_HOLDER,
                        description: 'Get token holders list'
                    },
                    {
                        label: 'Get token info',
                        name: constants_1.OPERATION.GET_TOKEN_INFO,
                        description: 'Get metadata of given token'
                    },
                    {
                        label: 'Get token list',
                        name: constants_1.OPERATION.GET_TOKENS,
                        description: 'Get list of tokens. MaxLimit 50 records per request'
                    },
                    // Market
                    {
                        label: 'Get token market info',
                        name: constants_1.OPERATION.GET_TOKEN_MARKET_INFO,
                        description: 'Get market information of the given token'
                    },
                    // Chain info
                    {
                        label: 'Get chain info',
                        name: constants_1.OPERATION.GET_CHAIN_INFO,
                        description: 'Blockchain overall information'
                    }
                ],
                default: constants_1.OPERATION.GET_TOKEN_BALANCES
            }
        ];
        this.inputParameters = [
            {
                label: 'Solana Address',
                name: 'address',
                type: 'string',
                description: 'The Solana address',
                show: {
                    'actions.api': [
                        constants_1.OPERATION.GET_TOKEN_BALANCES,
                        constants_1.OPERATION.GET_TRANSACTIONS,
                        constants_1.OPERATION.GET_STAKING_ACCOUNTS,
                        constants_1.OPERATION.GET_TOKEN_TRANSFERS,
                        constants_1.OPERATION.GET_SOL_TRANSFERS,
                        constants_1.OPERATION.GET_ACCOUNT_INFO
                    ]
                }
            },
            {
                label: 'Limit',
                name: 'limit',
                type: 'number',
                default: 10,
                optional: true,
                show: {
                    'actions.api': [constants_1.OPERATION.GET_TOKEN_HOLDER, constants_1.OPERATION.GET_LAST_TRANSACTIONS]
                }
            },
            {
                label: 'Offset',
                name: 'offset',
                type: 'number',
                default: 0,
                optional: true,
                show: {
                    'actions.api': [constants_1.OPERATION.GET_TOKEN_HOLDER, constants_1.OPERATION.GET_TOKENS]
                }
            },
            {
                label: 'Transaction Signature',
                name: 'signature',
                type: 'string',
                show: {
                    'actions.api': [constants_1.OPERATION.GET_TRANSACTION_INFO]
                }
            },
            {
                label: 'Token Address',
                name: 'tokenAddress',
                type: 'string',
                show: {
                    'actions.api': [constants_1.OPERATION.GET_TOKEN_HOLDER, constants_1.OPERATION.GET_TOKEN_INFO, constants_1.OPERATION.GET_TOKEN_MARKET_INFO]
                }
            },
            {
                label: 'Sort By',
                name: 'sortBy',
                type: 'options',
                optional: true,
                options: constants_1.SORT_BY,
                show: {
                    'actions.api': [constants_1.OPERATION.GET_TOKENS]
                }
            },
            {
                label: 'Sort Direction',
                name: 'direction',
                optional: true,
                type: 'options',
                options: constants_1.SORT_DIRECTION,
                show: {
                    'actions.api': [constants_1.OPERATION.GET_TOKENS]
                }
            }
        ];
    }
    getEndpoint(operation, options) {
        const baseUrl = 'https://public-api.solscan.io';
        switch (operation) {
            case constants_1.OPERATION.GET_TOKEN_BALANCES:
                return `${baseUrl}/account/tokens`;
            case constants_1.OPERATION.GET_TRANSACTIONS:
                return `${baseUrl}/account/transactions`;
            case constants_1.OPERATION.GET_STAKING_ACCOUNTS:
                return `${baseUrl}/account/stakeAccounts`;
            case constants_1.OPERATION.GET_TOKEN_TRANSFERS:
                return `${baseUrl}/account/splTransfers`;
            case constants_1.OPERATION.GET_SOL_TRANSFERS:
                return `${baseUrl}/account/solTransfers`;
            case constants_1.OPERATION.GET_ACCOUNT_INFO:
                return `${baseUrl}/account/${options === null || options === void 0 ? void 0 : options.address}`;
            case constants_1.OPERATION.GET_LAST_TRANSACTIONS:
                return `${baseUrl}/transaction/last`;
            case constants_1.OPERATION.GET_TRANSACTION_INFO:
                return `${baseUrl}/transaction/${options === null || options === void 0 ? void 0 : options.signature}`;
            case constants_1.OPERATION.GET_TOKEN_HOLDER:
                return `${baseUrl}/token/holders`;
            case constants_1.OPERATION.GET_TOKEN_INFO:
                return `${baseUrl}/token/meta`;
            case constants_1.OPERATION.GET_TOKENS:
                return `${baseUrl}/token/list`;
            case constants_1.OPERATION.GET_TOKEN_MARKET_INFO:
                return `${baseUrl}/market/token/${options === null || options === void 0 ? void 0 : options.tokenAddress}`;
            case constants_1.OPERATION.GET_CHAIN_INFO:
                return `${baseUrl}/chaininfo`;
            default:
                return baseUrl;
        }
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        if (actionData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const api = actionData.api;
        const address = inputParametersData.address;
        const limit = inputParametersData.limit;
        const offset = inputParametersData.offset;
        const signature = inputParametersData.signature;
        const tokenAddress = inputParametersData.tokenAddress;
        const sortBy = inputParametersData.sortBy;
        const direction = inputParametersData.direction;
        const url = this.getEndpoint(api, { address, signature, tokenAddress });
        const queryParameters = {
            account: address,
            tokenAddress,
            limit,
            offset,
            sortBy,
            direction
        };
        const returnData = [];
        let responseData;
        try {
            const axiosConfig = {
                method: 'GET',
                url,
                params: queryParameters,
                paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
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
module.exports = { nodeClass: Solscan };
//# sourceMappingURL=Solscan.js.map