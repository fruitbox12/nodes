"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const ETHOperations_1 = require("../../src/ETHOperations");
const axios_1 = __importDefault(require("axios"));
const extendedOperation_1 = require("./extendedOperation");
const supportedNetwork_1 = require("./supportedNetwork");
const solanaOperation_1 = require("./solanaOperation");
class QuickNode {
    constructor() {
        this.loadMethods = {
            async getOperations(nodeData) {
                const returnData = [];
                const inputParametersData = nodeData.inputParameters;
                const networksData = nodeData.networks;
                if (networksData === undefined || inputParametersData === undefined) {
                    return returnData;
                }
                const api = inputParametersData.api;
                const chainCategory = inputParametersData.chainCategory;
                const network = networksData.network;
                const operations = getSelectedOperations(api).filter((op) => Object.prototype.hasOwnProperty.call(op.providerNetworks, 'quicknode') &&
                    op.providerNetworks['quicknode'].includes(network));
                if (api === 'chainAPI' && !chainCategory)
                    return returnData;
                if (api === 'solanaAPI' && !chainCategory)
                    return returnData;
                let filteredOperations = operations;
                if (api === 'chainAPI' || api === 'solanaAPI')
                    filteredOperations = operations.filter((op) => op.parentGroup === ETHOperations_1.operationCategoryMapping[chainCategory]);
                for (const op of filteredOperations) {
                    returnData.push({
                        label: op.name,
                        name: op.value,
                        parentGroup: op.parentGroup,
                        description: op.description,
                        inputParameters: op.inputParameters,
                        exampleParameters: op.exampleParameters,
                        exampleResponse: op.exampleResponse
                    });
                }
                return returnData;
            }
        };
        this.label = 'QuickNode';
        this.name = 'quickNode';
        this.icon = 'quicknode.svg';
        this.type = 'action';
        this.category = 'Network Provider';
        this.version = 1.0;
        this.description = 'Perform QuickNode onchain operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...supportedNetwork_1.QuickNodeSupportedNetworks]
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'QuickNode Endpoints',
                        name: 'quickNodeEndpoints'
                    }
                ],
                default: 'quickNodeEndpoints'
            }
        ];
        this.inputParameters = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'EVM Chain API',
                        name: 'chainAPI',
                        description: 'API for fetching standard onchain data using QuickNode supported calls',
                        show: {
                            'networks.network': ETHOperations_1.qnSupportedNetworks
                        }
                    },
                    {
                        label: 'NFT API',
                        name: 'nftAPI',
                        description: 'API for fetching cross-chain NFT data using QuickNode supported calls',
                        show: {
                            'networks.network': [...extendedOperation_1.nftOperationsNetworks, ...solanaOperation_1.solanaOperationsNetworks]
                        }
                    },
                    {
                        label: 'Token API',
                        name: 'tokenAPI',
                        description: 'API to look up ERC-20 tokens by wallet, token transfers, and token details instantly',
                        show: {
                            'networks.network': extendedOperation_1.tokenOperationsNetworks
                        }
                    },
                    {
                        label: 'Debug API',
                        name: 'debugAPI',
                        description: 'API for fetching debug traces using QuickNode supported calls (Trace Mode required)',
                        show: {
                            'networks.network': extendedOperation_1.debugOperationsNetworks
                        }
                    },
                    {
                        label: 'Trace API',
                        name: 'traceAPI',
                        description: 'API for fetching traces using QuickNode supported calls (Trace Mode required and supported only on OpenEthereum & Erigon)',
                        show: {
                            'networks.network': [...extendedOperation_1.traceOperationsNetworks, ...extendedOperation_1.arbTraceOperationsNetworks]
                        }
                    },
                    {
                        label: 'Avalanche API',
                        name: 'avaxAPI',
                        description: 'API for fetching Avalanche on-chain data using QuickNode supported calls',
                        show: {
                            'networks.network': extendedOperation_1.avaxOperationsNetworks
                        }
                    },
                    {
                        label: 'Platform API',
                        name: 'platformAPI',
                        description: 'API for fetching Avalanche Platform data using QuickNode supported calls',
                        show: {
                            'networks.network': extendedOperation_1.avaxOperationsNetworks
                        }
                    },
                    {
                        label: 'Fantom API',
                        name: 'fantomAPI',
                        description: 'API for fetching Fantom on-chain data using QuickNode supported calls',
                        show: {
                            'networks.network': extendedOperation_1.fantomOperationsNetworks
                        }
                    },
                    {
                        label: 'Solana API',
                        name: 'solanaAPI',
                        description: 'API for fetching Solana on-chain data using QuickNode supported calls',
                        show: {
                            'networks.network': solanaOperation_1.solanaOperationsNetworks
                        }
                    }
                ],
                default: 'chainAPI'
            },
            {
                label: 'Chain Category',
                name: 'chainCategory',
                type: 'options',
                options: [
                    {
                        label: 'Retrieving Blocks',
                        name: 'retrievingBlocks',
                        description: 'Retrieve onchain blocks data'
                    },
                    {
                        label: 'EVM/Smart Contract Execution',
                        name: 'evmExecution',
                        description: 'Execute or submit transaction onto blockchain'
                    },
                    {
                        label: 'Reading Transactions',
                        name: 'readingTransactions',
                        description: 'Read onchain transactions data'
                    },
                    {
                        label: 'Account Information',
                        name: 'accountInformation',
                        description: 'Retrieve onchain account information'
                    },
                    {
                        label: 'Event Logs',
                        name: 'eventLogs',
                        description: 'Fetch onchain logs'
                    },
                    {
                        label: 'Chain Information',
                        name: 'chainInformation',
                        description: 'Get general selected blockchain information'
                    },
                    {
                        label: 'Retrieving Uncles',
                        name: 'retrievingUncles',
                        description: 'Retrieve onchain uncles blocks data'
                    },
                    {
                        label: 'Filters',
                        name: 'filters',
                        description: 'Get block filters and logs, or create new filter'
                    }
                ],
                show: {
                    'inputParameters.api': ['chainAPI']
                }
            },
            {
                label: 'Chain Category',
                name: 'chainCategory',
                type: 'options',
                options: [
                    {
                        label: 'Reading & Writing Transactions',
                        name: 'readWriteTransactions',
                        description: 'Read and Write transactins onto Solana chain'
                    },
                    {
                        label: 'Getting Blocks',
                        name: 'gettingBlocks',
                        description: 'Get Solana blocks data'
                    },
                    {
                        label: 'Account Information',
                        name: 'accountInformation',
                        description: 'Retrieve Solana onchain account information'
                    },
                    {
                        label: 'Network Information',
                        name: 'networkInformation',
                        description: 'Get Solana network onchain information'
                    },
                    {
                        label: 'Slot Information',
                        name: 'slotInformation',
                        description: 'Fetch Solana slot information'
                    },
                    {
                        label: 'Node Information',
                        name: 'nodeInformation',
                        description: 'Retrieve Solana node onchain information'
                    },
                    {
                        label: 'Token Information',
                        name: 'tokenInformation',
                        description: 'Fetch Solana onchain token information'
                    },
                    {
                        label: 'Network Inflation',
                        name: 'networkInflation',
                        description: 'Retrieve Solana network inflation onchain data'
                    }
                ],
                show: {
                    'inputParameters.api': ['solanaAPI']
                }
            },
            {
                label: 'Operation',
                name: 'operation',
                type: 'asyncOptions',
                loadMethod: 'getOperations'
            },
            {
                label: 'Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: `[
  "param1",
  "param2"
]`,
                optional: true,
                description: 'Operation parameters in array. Ex: ["param1", "param2"]',
                show: {
                    'inputParameters.api': ['chainAPI', 'tokenAPI', 'traceAPI', 'debugAPI', 'fantomAPI']
                }
            },
            {
                label: 'Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: `{
  "param1": "value1"
}`,
                optional: true,
                description: 'Operation parameters in JSON. Ex: {"param1": "value1"}',
                show: {
                    'inputParameters.api': ['nftAPI', 'avaxAPI', 'platformAPI']
                },
                hide: {
                    'inputParameters.operation': ['qn_verifyNFTsOwner', 'qn_fetchNFTsByCreator', 'requestAirdrop']
                }
            },
            {
                label: 'Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: `[
  "param1",
  "param2"
]`,
                optional: true,
                description: 'Operation parameters in array. Ex: ["param1", "param2"]',
                show: {
                    'inputParameters.operation': ['qn_verifyNFTsOwner', 'qn_fetchNFTsByCreator', 'requestAirdrop']
                }
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials');
        }
        // GET api
        const api = inputParametersData.api;
        // GET credentials
        const httpProvider = credentials.httpProvider;
        // GET operation
        const operation = inputParametersData.operation;
        let uri = httpProvider;
        let responseData; // tslint:disable-line: no-any
        let bodyParameters = []; // tslint:disable-line: no-any
        const returnData = [];
        const headers = {
            'Content-Type': 'application/json'
        };
        const parameters = inputParametersData.parameters;
        if (parameters) {
            try {
                bodyParameters = JSON.parse(parameters.replace(/\s/g, ''));
            }
            catch (error) {
                throw (0, utils_1.handleErrorMessage)(error);
            }
        }
        try {
            let totalOperations = [];
            totalOperations = getSelectedOperations(api);
            const result = totalOperations.find((obj) => {
                return obj.value === operation;
            });
            if (result === undefined)
                throw new Error('Invalid Operation');
            const requestBody = JSON.parse(JSON.stringify(result.body));
            const bodyParams = requestBody.params;
            requestBody.params = Array.isArray(bodyParameters) ? bodyParameters.concat(bodyParams) : bodyParameters;
            if (result.overrideUrl) {
                uri = result.overrideUrl.replace('http://sample-endpoint-name.network.quiknode.pro/token-goes-here/', httpProvider);
            }
            if (api === 'nftAPI') {
                headers['x-qn-api-version'] = 1;
            }
            const axiosConfig = {
                method: result.method,
                url: uri,
                data: requestBody,
                headers
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
}
const getSelectedOperations = (api) => {
    switch (api) {
        case 'chainAPI':
            return ETHOperations_1.ethOperations;
        case 'nftAPI':
            return extendedOperation_1.nftOperations;
        case 'debugAPI':
            return extendedOperation_1.debugOperations;
        case 'traceAPI':
            return extendedOperation_1.traceOperations;
        case 'tokenAPI':
            return extendedOperation_1.tokenOperations;
        case 'avaxAPI':
            return extendedOperation_1.avaxOperations;
        case 'fantomAPI':
            return extendedOperation_1.fantomOperations;
        case 'platformAPI':
            return extendedOperation_1.platformOperations;
        case 'solanaAPI':
            return solanaOperation_1.solanaOperations;
        default:
            return ETHOperations_1.ethOperations;
    }
};
module.exports = { nodeClass: QuickNode };
//# sourceMappingURL=QuickNode.js.map