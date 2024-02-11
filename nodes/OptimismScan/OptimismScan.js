"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
class OptimismScan {
    constructor() {
        // properties
        this.label = 'Optimism Scan';
        this.name = 'optimismscan';
        this.icon = 'optimismScan.svg';
        this.type = 'action';
        this.category = 'Block Explorer';
        this.version = 1.0;
        this.description = 'Optimism Public API';
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
                        label: 'Get ETH Balance',
                        name: constants_1.GET_ETH_BALANCE.name,
                        description: 'Get ETH Balance for a single Address'
                    },
                    {
                        label: 'Get ETH Balance Multi',
                        name: constants_1.GET_ETH_BALANCE_MULTI.name,
                        description: 'Get ETH Balance for multiple Addresses in a single call'
                    },
                    {
                        label: 'Get ERC20 Token Transfer Events',
                        name: constants_1.GET_ERC20_TOKEN_TRANSFER.name,
                        description: 'Get a list of "ERC-20 - Token Transfer Events" by Address'
                    },
                    {
                        label: 'Get Deposit History',
                        name: constants_1.GET_DEPOSIT.name,
                        description: 'Get list of L1 Deposits done by Address'
                    },
                    {
                        label: 'Get Withdrawal History',
                        name: constants_1.GET_WITHDRAWAL.name,
                        description: 'Get list of L2 Withdrawals done by Address'
                    },
                    {
                        label: 'Get Contract ABI',
                        name: constants_1.GET_CONTRACT_ABI.name,
                        description: 'Get Contract ABI for Verified Contract Source Codes'
                    },
                    {
                        label: 'Get Contract Source Code',
                        name: constants_1.GET_CONTRACT_SOURCE_CODE.name,
                        description: 'Get Contract Source Code for Verified Contract Source Codes. (Replace the address with the actual contract address)'
                    },
                    {
                        label: 'Get ERC-20 Token Total Supply',
                        name: constants_1.GET_ERC20_TOKEN_SUPPLY.name,
                        description: 'Get ERC-20 Token Total Supply by Contract Address'
                    },
                    {
                        label: 'Get ERC-20 Token Account Balance',
                        name: constants_1.GET_ERC20_TOKEN_ACCOUNT_BALANCE.name,
                        description: 'Get ERC-20 Token Account Balance by Contract Address and Address'
                    }
                ],
                default: constants_1.GET_ETH_BALANCE.name
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'OptimismScan API Key',
                        name: 'optimisticEtherscanApi'
                    }
                ],
                default: 'optimisticEtherscanApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                show: {
                    'actions.api': [
                        constants_1.GET_ETH_BALANCE.name,
                        constants_1.GET_NORMAL_TRANSACTIONS.name,
                        constants_1.GET_ERC20_TOKEN_TRANSFER.name,
                        constants_1.GET_DEPOSIT.name,
                        constants_1.GET_WITHDRAWAL.name,
                        constants_1.GET_CONTRACT_ABI.name,
                        constants_1.GET_CONTRACT_SOURCE_CODE.name,
                        constants_1.GET_ERC20_TOKEN_ACCOUNT_BALANCE.name
                    ]
                }
            },
            {
                label: 'Addresses',
                name: 'addresses',
                type: 'array',
                array: [
                    {
                        label: 'Address',
                        name: 'address',
                        type: 'string'
                    }
                ],
                show: {
                    'actions.api': [constants_1.GET_ETH_BALANCE_MULTI.name]
                }
            },
            {
                label: 'Tag',
                name: 'tag',
                type: 'options',
                options: [{ label: 'latest', name: 'latest' }],
                default: 'latest',
                show: {
                    'actions.api': [constants_1.GET_ETH_BALANCE.name, constants_1.GET_ETH_BALANCE_MULTI.name, constants_1.GET_ERC20_TOKEN_ACCOUNT_BALANCE.name]
                }
            },
            {
                label: 'Start Block',
                name: 'startBlock',
                type: 'number',
                optional: true,
                description: 'the block number to start searching for transactions',
                show: {
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_ERC20_TOKEN_TRANSFER.name]
                },
                default: 0
            },
            {
                label: 'End Block',
                name: 'endBlock',
                type: 'number',
                optional: true,
                description: 'the block number to stop searching for transactions',
                show: {
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_ERC20_TOKEN_TRANSFER.name]
                }
            },
            {
                label: 'Page',
                name: 'page',
                type: 'number',
                optional: true,
                description: 'the page number, if pagination is enabled',
                show: {
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_ERC20_TOKEN_TRANSFER.name]
                },
                default: 1
            },
            {
                label: 'Offset',
                name: 'offset',
                type: 'number',
                optional: true,
                description: 'the number of transactions displayed per page',
                show: {
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_ERC20_TOKEN_TRANSFER.name]
                },
                default: 10
            },
            {
                label: 'Sort By',
                name: 'sortBy',
                type: 'options',
                options: constants_1.SORT_BY,
                optional: true,
                show: {
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_ERC20_TOKEN_TRANSFER.name, constants_1.GET_DEPOSIT.name]
                },
                default: 'desc'
            },
            {
                label: 'Contract Address [Optional]',
                name: 'contractAddressOptional',
                type: 'string',
                description: 'the contract address of the ERC-20 token',
                optional: true,
                show: {
                    'actions.api': [constants_1.GET_ERC20_TOKEN_TRANSFER.name]
                }
            },
            {
                label: 'Contract Address',
                name: 'contractAddress',
                type: 'string',
                description: 'the contract address of the ERC-20 token',
                show: {
                    'actions.api': [constants_1.GET_ERC20_TOKEN_SUPPLY.name, constants_1.GET_ERC20_TOKEN_ACCOUNT_BALANCE.name]
                }
            },
            {
                label: 'Token Address',
                name: 'tokenAddress',
                type: 'string',
                description: 'the contract address of the ERC-20 token',
                optional: true,
                show: {
                    'actions.api': [constants_1.GET_DEPOSIT.name]
                }
            }
        ];
    }
    getBaseParams(api) {
        const operation = constants_1.OPERATIONS.filter(({ name }) => name === api)[0];
        return { module: operation.module, action: operation.action };
    }
    async run(nodeData) {
        const url = 'https://api-optimistic.etherscan.io/api';
        const { actions, inputParameters, credentials } = nodeData;
        if (actions === undefined || inputParameters === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const api = actions.api;
        const apiKey = credentials.apiKey;
        const singleAddress = inputParameters.address;
        const multiAddresses = inputParameters.addresses || [];
        const startblock = inputParameters.startBlock;
        const endblock = inputParameters.endBlock;
        const page = inputParameters.page;
        const offset = inputParameters.offset;
        const sort = inputParameters.sortBy;
        const tag = inputParameters.tag;
        const contractAddress = inputParameters.contractAddress;
        const tokenAddress = inputParameters.tokenAddress;
        const contractAddressOptional = inputParameters.contractAddressOptional || undefined;
        const { module, action } = this.getBaseParams(api);
        const address = singleAddress || multiAddresses.map(({ address }) => address).join(',');
        const contractaddress = contractAddress ? contractAddress : contractAddressOptional;
        const queryParameters = {
            module,
            action,
            address,
            tag,
            apiKey,
            startblock,
            endblock,
            page,
            offset,
            sort,
            tokenAddress,
            contractaddress
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
module.exports = { nodeClass: OptimismScan };
//# sourceMappingURL=OptimismScan.js.map