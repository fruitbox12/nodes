"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const src_1 = require("../../src");
const utils_1 = require("../../src/utils");
class SnowTrace {
    constructor() {
        this.label = 'SnowTrace';
        this.name = 'snowtrace';
        this.icon = 'snowtrace.svg';
        this.type = 'action';
        this.category = 'Block Explorer';
        this.version = 1.0;
        this.description = 'Perform SnowTrace operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get AVAX Balance for a Single Address',
                        name: 'getAvaxBalance',
                        description: 'Returns the AVAX balance of a given address.'
                    },
                    {
                        label: 'Get AVAX Balance for Multiple Addresses',
                        name: 'getAvaxMultipleBalance',
                        description: 'Returns the AVAX balance of given addresses.'
                    },
                    {
                        label: 'Get a list of "Normal" Transactions By Address',
                        name: 'getNormalTransactions',
                        description: 'Returns a list of "Normal" transaction by address.'
                    },
                    {
                        label: 'Get a list of "Internal" Transactions by Address',
                        name: 'getInternalTransactions',
                        description: 'Returns a list of "Internal" transaction by address.'
                    },
                    {
                        label: 'Get "Internal Transactions" by Transaction Hash',
                        name: 'getInternalTransactionsByHash',
                        description: 'Returns "Internal Transactions" by hash.'
                    },
                    {
                        label: 'Get "Internal Transactions" by Block Range',
                        name: 'getInternalTransactionsByBlockRange',
                        description: 'Returns "Internal Transactions" transaction by block range.'
                    },
                    {
                        label: 'Get a list of "ERC20 - Token Transfer Events" by Address',
                        name: 'getErc20TokenTransferEvents',
                        description: 'Returns a list of "ERC20 - Token Transfer Events" by address.'
                    },
                    {
                        label: 'Get a list of "ERC721 - Token Transfer Events" by Address',
                        name: 'getErc721TokenTransferEvents',
                        description: 'Returns a list of "ERC721 - Token Transfer Events" by address.'
                    },
                    {
                        label: 'Get list of Blocks Validated by Address',
                        name: 'getBlocksValidated',
                        description: 'Returns a list of blocks validated by address.'
                    },
                    {
                        label: 'Get Contract ABI for Verified Contract Source Codes',
                        name: 'getContractABI',
                        description: 'Returns the contract ABI for verified contract source codes.'
                    }
                ],
                default: 'getAvaxBalance'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: 'Avalanche Mainnet',
                        name: src_1.NETWORK.AVALANCHE
                    },
                    {
                        label: 'Avalanche Testnet',
                        name: src_1.NETWORK.AVALANCHE_TESTNET
                    }
                ],
                default: src_1.NETWORK.AVALANCHE
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'SnowTrace API Key',
                        name: 'snowtraceApi'
                    }
                ],
                default: 'snowtraceApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                description: 'The address to check for balance',
                show: {
                    'actions.api': [
                        'getAvaxBalance',
                        'getNormalTransactions',
                        'getInternalTransactions',
                        'getErc20TokenTransferEvents',
                        'getErc721TokenTransferEvents',
                        'getBlocksValidated',
                        'getContractABI'
                    ]
                }
            },
            {
                label: 'Addresses',
                name: 'addresses',
                type: 'json',
                placeholder: `[
  '0x0000000000000000000000000000000000001004',
  '0x0000000000000000000000000000000000001000'
]`,
                description: 'The addresses to check for balance',
                show: {
                    'actions.api': ['getAvaxMultipleBalance']
                }
            },
            {
                label: 'Transaction Hash',
                name: 'hash',
                type: 'string',
                placeholder: '0x4d74a6fc84d57f18b8e1dfa07ee517c4feb296d16a8353ee41adc03669982028',
                description: 'The hash of the transaction',
                show: {
                    'actions.api': ['getInternalTransactionsByHash']
                }
            },
            {
                label: 'Start Block',
                name: 'startBlock',
                type: 'number',
                placeholder: '0',
                description: 'The starting block to check for internal transactions',
                show: {
                    'actions.api': ['getInternalTransactionsByBlockRange']
                }
            },
            {
                label: 'End Block',
                name: 'endBlock',
                type: 'number',
                placeholder: '2702578',
                description: 'The ending block to check for internal transactions',
                show: {
                    'actions.api': ['getInternalTransactionsByBlockRange']
                }
            }
        ];
    }
    async fetch(url, queryParameters) {
        try {
            const axiosConfig = {
                method: 'GET',
                url,
                params: queryParameters,
                paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await (0, axios_1.default)(axiosConfig);
            return response.data;
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
    }
    getQueryParameters(api, value) {
        switch (api) {
            case 'getAvaxBalance':
                return {
                    module: 'account',
                    action: 'balance',
                    tag: 'latest',
                    address: value
                };
            case 'getAvaxMultipleBalance':
                return {
                    module: 'account',
                    action: 'balancemulti',
                    tag: 'latest',
                    address: value
                };
            case 'getNormalTransactions':
                return {
                    module: 'account',
                    action: 'txlist',
                    address: value
                };
            case 'getInternalTransactions':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    address: value
                };
            case 'getInternalTransactionsByHash':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    txhash: value
                };
            case 'getInternalTransactionsByBlockRange':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    startblock: value[0],
                    endblock: value[1]
                };
            case 'getErc20TokenTransferEvents':
                return {
                    module: 'account',
                    action: 'tokentx',
                    address: value
                };
            case 'getErc721TokenTransferEvents':
                return {
                    module: 'account',
                    action: 'tokennfttx',
                    address: value
                };
            case 'getBlocksValidated':
                return {
                    module: 'account',
                    action: 'getminedblocks',
                    address: value
                };
            case 'getContractABI':
                return {
                    module: 'contract',
                    action: 'getabi',
                    address: value
                };
            default:
                return {};
        }
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const networksData = nodeData.networks;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }
        const api = actionData.api;
        const network = networksData.network;
        const apiKey = credentials.apiKey;
        const address = inputParametersData.address;
        const addresses = inputParametersData.addresses || '[]';
        let addressesArray = [];
        if (addresses)
            addressesArray = JSON.parse(addresses.replace(/\s/g, ''));
        const hash = inputParametersData.hash;
        const startBlock = inputParametersData.startBlock;
        const endBlock = inputParametersData.endBlock;
        const url = src_1.etherscanAPIs[network];
        let responseData;
        const returnData = [];
        let queryParameters = {};
        switch (api) {
            case 'getContractABI':
            case 'getBlocksValidated':
            case 'getErc721TokenTransferEvents':
            case 'getErc20TokenTransferEvents':
            case 'getInternalTransactions':
            case 'getNormalTransactions':
            case 'getAvaxBalance':
                queryParameters = Object.assign(Object.assign({}, this.getQueryParameters(api, address)), { apiKey });
                break;
            case 'getAvaxMultipleBalance':
                queryParameters = Object.assign(Object.assign({}, this.getQueryParameters(api, addressesArray.join(','))), { apiKey });
                break;
            case 'getInternalTransactionsByHash':
                queryParameters = Object.assign(Object.assign({}, this.getQueryParameters(api, hash)), { apiKey });
                break;
            case 'getInternalTransactionsByBlockRange':
                queryParameters = Object.assign(Object.assign({}, this.getQueryParameters(api, [startBlock, endBlock])), { apiKey });
                break;
            default:
                break;
        }
        responseData = await this.fetch(url, queryParameters);
        if (Array.isArray(responseData))
            returnData.push(...responseData);
        else
            returnData.push(responseData);
        return responseData;
    }
}
module.exports = { nodeClass: SnowTrace };
//# sourceMappingURL=SnowTrace.js.map