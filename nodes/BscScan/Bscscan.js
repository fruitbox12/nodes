"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
class Bscscan {
    constructor() {
        this.label = 'BscScan';
        this.name = 'BscScan';
        this.icon = 'bscscan.svg';
        this.type = 'action';
        this.category = 'Block Explorer';
        this.version = 1.0;
        this.description = 'Perform Bscscan operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get Bnb Balance for a Single Address',
                        name: constants_1.GET_BNB_BALANCE.name,
                        description: 'Returns the Bnb balance of a given address.'
                    },
                    {
                        label: 'Get Bnb Balance for Multiple Addresses(separated by a comma)',
                        name: constants_1.GET_MULTI_BNB_BALANCE.name,
                        description: 'Returns the Bnb balance of the addresses(each address separated by a comma) entered.'
                    },
                    {
                        label: 'Get transactions',
                        name: constants_1.GET_NORMAL_TRANSACTIONS.name,
                        description: 'Returns the list of transactions performed by an address, with optional pagination.'
                    },
                    {
                        label: 'Get internal transactions',
                        name: constants_1.GET_INTERNAL_TRANSACTIONS.name,
                        description: 'Returns the list of internal transactions performed by an address, with optional pagination.'
                    },
                    {
                        label: 'Get internal transactions by hash',
                        name: constants_1.GET_INTERNAL_TRANSACTIONS_BY_HASH.name,
                        description: 'Returns the list of internal transactions performed within a transaction.'
                    },
                    {
                        label: 'Get internal transactions by block',
                        name: constants_1.GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name,
                        description: 'Returns the list of internal transactions performed within a block range, with optional pagination.'
                    },
                    {
                        label: 'Get list of Blocks Validated by Address',
                        name: constants_1.GET_BLOCKS_VALIDATED.name,
                        description: 'Returns the list of blocks validated by an address.'
                    },
                    {
                        label: 'Get Contract ABI',
                        name: constants_1.GET_ABI.name,
                        description: 'Returns the contract Application Binary Interface ( ABI ) of a verified smart contract.'
                    },
                    {
                        label: 'Get Contract Source Code',
                        name: constants_1.GET_CONTRACT_SOURCE_CODE.name,
                        description: 'Returns the Solidity source code of a verified smart contract.'
                    },
                    {
                        label: 'Check Transaction Receipt Status',
                        name: constants_1.CHECK_TRANSACTION_RECEIPT_STATUS.name,
                        description: 'Returns the status code of a transaction execution.'
                    },
                    {
                        label: 'Get BEP-20 Token Circulating Supply by ContractAddress',
                        name: constants_1.GET_BEP20_CIRCULATION_TOKEN_SUPPLY.name,
                        description: `Returns the current circulating supply of a BEP-20 token. 
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get BEP20 Token Supply',
                        name: constants_1.GET_BEP20_TOKEN_SUPPLY.name,
                        description: `Returns the total supply of a BEP-20 token. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get BEP20 Token Balance',
                        name: constants_1.GET_BEP20_TOKEN_BALANCE.name,
                        description: `Returns the current balance of a BEP-20 token of an address. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Historical BEP-20 Token TotalSupply by ContractAddress & BlockNo [PRO]',
                        name: constants_1.GET_HISTORICAL_BEP20_TOKEN_SUPPLY.name,
                        description: `Returns the historical amount of a BEP-20 token in circulation at a certain block height. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Historical BEP-20 Token Account Balance by ContractAddress & BlockNo [PRO]',
                        name: constants_1.GET_HISTORICAL_BEP20_TOKEN_BALANCE.name,
                        description: `Returns the balance of a BEP-20 token of an address at a certain block height. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Token Info [PRO]',
                        name: constants_1.GET_TOKEN_INFO.name,
                        description: 'Returns project information and social media links of an BEP-20/ERC-721 token.'
                    },
                    {
                        label: 'Get BNB Price',
                        name: constants_1.GET_BNB_PRICE.name,
                        description: 'Returns the latest price of 1 BNB.'
                    },
                    {
                        label: 'Get Historical BNB Price [PRO]',
                        name: constants_1.GET_HISTORICAL_BNB_PRICE.name,
                        description: 'Returns the historical price of BNB.'
                    }
                ],
                default: 'getBnbBalance'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.BSC,
                        name: ChainNetwork_1.NETWORK.BSC
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.BSC_TESTNET,
                        name: ChainNetwork_1.NETWORK.BSC_TESTNET
                    }
                ],
                default: 'homestead'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'BscScan API Key',
                        name: 'bscscanApi'
                    }
                ],
                default: 'bscscanApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                description: 'The address parameter(s) required',
                show: {
                    'actions.api': [
                        constants_1.GET_BNB_BALANCE.name,
                        constants_1.GET_HISTORICAL_BNB_BALANCE.name,
                        constants_1.GET_NORMAL_TRANSACTIONS.name,
                        constants_1.GET_INTERNAL_TRANSACTIONS.name,
                        constants_1.GET_BLOCKS_VALIDATED.name,
                        constants_1.GET_ABI.name,
                        constants_1.GET_CONTRACT_SOURCE_CODE.name,
                        constants_1.GET_BEP20_TOKEN_BALANCE.name,
                        constants_1.GET_HISTORICAL_BEP20_TOKEN_BALANCE.name
                    ]
                }
            },
            {
                label: 'Block Number',
                name: 'blockno',
                type: 'number',
                description: 'the block number to check balance for eg. 2000000',
                show: {
                    'actions.api': [
                        constants_1.GET_HISTORICAL_BNB_BALANCE.name,
                        constants_1.GET_HISTORICAL_BEP20_TOKEN_SUPPLY.name,
                        constants_1.GET_HISTORICAL_BEP20_TOKEN_BALANCE.name
                    ]
                }
            },
            {
                label: 'Start Block',
                name: 'startBlock',
                type: 'number',
                optional: true,
                description: 'the block number to start searching for transactions',
                show: {
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_INTERNAL_TRANSACTIONS.name, constants_1.GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name]
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
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_INTERNAL_TRANSACTIONS.name, constants_1.GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name]
                }
            },
            {
                label: 'Page',
                name: 'page',
                type: 'number',
                optional: true,
                description: 'the page number, if pagination is enabled',
                show: {
                    'actions.api': [
                        constants_1.GET_NORMAL_TRANSACTIONS.name,
                        constants_1.GET_INTERNAL_TRANSACTIONS.name,
                        constants_1.GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name,
                        constants_1.GET_BLOCKS_VALIDATED.name
                    ]
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
                    'actions.api': [
                        constants_1.GET_NORMAL_TRANSACTIONS.name,
                        constants_1.GET_INTERNAL_TRANSACTIONS.name,
                        constants_1.GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name,
                        constants_1.GET_BLOCKS_VALIDATED.name
                    ]
                },
                default: 10
            },
            {
                label: 'Sort By',
                name: 'sortBy',
                type: 'options',
                optional: true,
                options: constants_1.SORT_BY,
                show: {
                    'actions.api': [constants_1.GET_NORMAL_TRANSACTIONS.name, constants_1.GET_INTERNAL_TRANSACTIONS.name, constants_1.GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name]
                },
                default: 'desc'
            },
            {
                label: 'Transaction Hash',
                name: 'txhash',
                type: 'string',
                description: 'the string representing the transaction hash to check for internal transactions',
                show: {
                    'actions.api': [constants_1.GET_INTERNAL_TRANSACTIONS_BY_HASH.name, constants_1.CHECK_TRANSACTION_RECEIPT_STATUS.name]
                }
            },
            {
                label: 'Block Type',
                name: 'blockType',
                type: 'options',
                options: [
                    {
                        label: 'blocks',
                        name: 'blocks'
                    }
                ],
                default: 'blocks',
                show: {
                    'actions.api': [constants_1.GET_BLOCKS_VALIDATED.name]
                }
            },
            {
                label: 'Contract Address',
                name: 'contractAddress',
                type: 'string',
                description: 'the contract address of the BEP-20 token',
                show: {
                    'actions.api': [
                        constants_1.GET_BEP20_TOKEN_SUPPLY.name,
                        constants_1.GET_BEP20_TOKEN_BALANCE.name,
                        constants_1.GET_HISTORICAL_BEP20_TOKEN_SUPPLY.name,
                        constants_1.GET_HISTORICAL_BEP20_TOKEN_BALANCE.name,
                        constants_1.GET_TOKEN_INFO.name,
                        constants_1.GET_BEP20_CIRCULATION_TOKEN_SUPPLY.name
                    ]
                }
            },
            {
                label: 'Tag',
                name: 'tag',
                type: 'options',
                options: [{ label: 'latest', name: 'latest' }],
                default: 'latest',
                show: {
                    'actions.api': [constants_1.GET_BEP20_TOKEN_BALANCE.name]
                }
            },
            {
                label: 'Start Time',
                name: 'startTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.api': [constants_1.GET_HISTORICAL_BNB_PRICE.name]
                }
            },
            {
                label: 'End Time',
                name: 'endTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.api': [constants_1.GET_HISTORICAL_BNB_PRICE.name]
                }
            }
        ];
    }
    getNetwork(network) {
        return `${ChainNetwork_1.etherscanAPIs[network]}`;
    }
    getBaseParams(api) {
        const operation = constants_1.OPERATIONS.filter(({ name }) => name === api)[0];
        return { module: operation.module, action: operation.action };
    }
    getISODate(date) {
        return date.toISOString().split('T')[0];
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const networksData = nodeData.networks;
        const inputParameters = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParameters === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }
        // GET api
        const api = actionData.api;
        // GET network
        const network = networksData.network;
        // GET credentials
        const apiKey = credentials.apiKey;
        // GET address
        const address = inputParameters.address;
        const startblock = inputParameters.startBlock;
        const endblock = inputParameters.endBlock;
        const page = inputParameters.page;
        const offset = inputParameters.offset;
        const sort = inputParameters.sortBy;
        const txhash = inputParameters.txhash;
        const blocktype = inputParameters.blockType;
        const contractaddress = inputParameters.contractAddress;
        const tag = inputParameters.tag;
        const startTime = inputParameters.startTime;
        const endTime = inputParameters.endTime;
        const startdate = startTime ? this.getISODate(new Date(startTime)) : undefined;
        const enddate = endTime ? this.getISODate(new Date(endTime)) : undefined;
        const url = this.getNetwork(network);
        const { module, action } = this.getBaseParams(api);
        const queryParameters = {
            module,
            action,
            address,
            apiKey,
            startblock,
            endblock,
            page,
            offset,
            sort,
            txhash,
            blocktype,
            contractaddress,
            tag,
            startdate,
            enddate
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
module.exports = { nodeClass: Bscscan };
//# sourceMappingURL=Bscscan.js.map