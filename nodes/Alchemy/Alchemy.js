"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
const ETHOperations_1 = require("../../src/ETHOperations");
const extendedOperation_1 = require("./extendedOperation");
const axios_1 = __importDefault(require("axios"));
const solanaOperation_1 = require("./solanaOperation");
const supportedNetwork_1 = require("./supportedNetwork");
class Alchemy {
    constructor() {
        this.loadMethods = {
            async getOperations(nodeData) {
                const returnData = [];
                const inputParametersData = nodeData.inputParameters;
                const networksData = nodeData.networks;
                if (inputParametersData === undefined || networksData === undefined) {
                    return returnData;
                }
                const api = inputParametersData.api;
                const chainCategory = inputParametersData.chainCategory;
                const network = networksData.network;
                if (api === 'chainAPI' || api === 'txReceiptsAPI' || api === 'tokenAPI' || api === 'solanaAPI') {
                    const operations = getSelectedOperations(api, network).filter((op) => Object.prototype.hasOwnProperty.call(op.providerNetworks, 'alchemy') &&
                        op.providerNetworks['alchemy'].includes(network));
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
                else if (api === 'nftAPI') {
                    return extendedOperation_1.NFTOperationsOptions;
                }
                else {
                    return returnData;
                }
            }
        };
        this.label = 'Alchemy';
        this.name = 'alchemy';
        this.icon = 'alchemy.svg';
        this.type = 'action';
        this.category = 'Network Provider';
        this.version = 1.1;
        this.description = 'Perform Alchemy on-chain operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...supportedNetwork_1.AlchemySupportedNetworks]
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Alchemy API Key',
                        name: 'alchemyApi'
                    }
                ],
                default: 'alchemyApi'
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
                        description: 'API for fetching standard EVM onchain data using Alchemy supported calls',
                        show: {
                            'networks.network': ETHOperations_1.alchemySupportedNetworks
                        }
                    },
                    {
                        label: 'NFT API',
                        name: 'nftAPI',
                        description: 'API for fetching NFT data, including ownership, metadata attributes, and more.',
                        show: {
                            'networks.network': [ChainNetwork_1.NETWORK.MAINNET, ChainNetwork_1.NETWORK.GÖRLI, ChainNetwork_1.NETWORK.MATIC, ChainNetwork_1.NETWORK.MATIC_MUMBAI]
                        }
                    },
                    {
                        label: 'Transaction Receipts API',
                        name: 'txReceiptsAPI',
                        description: 'API that gets all transaction receipts for a given block by number or block hash.',
                        show: {
                            'networks.network': [
                                ChainNetwork_1.NETWORK.MAINNET,
                                ChainNetwork_1.NETWORK.GÖRLI,
                                ChainNetwork_1.NETWORK.MATIC,
                                ChainNetwork_1.NETWORK.MATIC_MUMBAI,
                                ChainNetwork_1.NETWORK.ARBITRUM,
                                ChainNetwork_1.NETWORK.ARBITRUM_GOERLI
                            ]
                        }
                    },
                    {
                        label: 'Token API',
                        name: 'tokenAPI',
                        description: 'The Token API allows you to easily get token information, minimizing the number of necessary requests.',
                        show: {
                            'networks.network': ETHOperations_1.alchemySupportedNetworks
                        }
                    },
                    {
                        label: 'Solana API',
                        name: 'solanaAPI',
                        description: 'API for fetching Solana on-chain data using Alchemy supported calls',
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
            ...extendedOperation_1.getNFTsProperties,
            ...extendedOperation_1.getNFTMetadataProperties,
            ...extendedOperation_1.getNFTsForCollectionProperties,
            ...extendedOperation_1.getOwnersForCollectionProperties,
            ...extendedOperation_1.getOwnersForTokenProperties,
            ...extendedOperation_1.searchContractMetadataProperties,
            ...extendedOperation_1.isHolderOfCollectionProperties,
            ...extendedOperation_1.getContractsForOwnerProperties,
            {
                label: 'Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: '["param1", "param2"]',
                optional: true,
                description: 'Operation parameters in array. Ex: ["param1", "param2"]',
                show: {
                    'inputParameters.api': ['chainAPI', 'txReceiptsAPI', 'tokenAPI', 'solanaAPI']
                }
            }
        ];
    }
    async run(nodeData) {
        const networksData = nodeData.networks;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (inputParametersData === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials');
        }
        // GET api
        const api = inputParametersData.api;
        // GET network
        const network = networksData.network;
        // GET credentials
        const apiKey = credentials.apiKey;
        // GET operation
        const operation = inputParametersData.operation;
        if (api === 'chainAPI' || api === 'txReceiptsAPI' || api === 'tokenAPI' || api === 'solanaAPI') {
            const uri = `${ChainNetwork_1.alchemyHTTPAPIs[network]}${apiKey}`;
            let responseData; // tslint:disable-line: no-any
            let bodyParameters = []; // tslint:disable-line: no-any
            const returnData = [];
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
                totalOperations = getSelectedOperations(api, network);
                const result = totalOperations.find((obj) => {
                    return obj.value === operation;
                });
                if (result === undefined)
                    throw new Error('Invalid Operation');
                const requestBody = JSON.parse(JSON.stringify(result.body));
                const bodyParams = requestBody.params;
                requestBody.params = Array.isArray(bodyParameters) ? bodyParameters.concat(bodyParams) : bodyParameters;
                const axiosConfig = {
                    method: result.method,
                    url: uri,
                    data: requestBody,
                    headers: {
                        'Content-Type': 'application/json'
                    }
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
        //NFT API
        else if (api === 'nftAPI') {
            const uri = `${ChainNetwork_1.alchemyHTTPAPIs[network]}${apiKey}/${operation}/`;
            let responseData; // tslint:disable-line: no-any
            const queryParameters = {};
            const returnData = [];
            if (operation === 'getNFTs') {
                const owner = inputParametersData.owner;
                const pageKey = inputParametersData.pageKey;
                const withMetadata = inputParametersData.withMetadata;
                queryParameters['owner'] = owner;
                queryParameters['withMetadata'] = withMetadata;
                if (pageKey)
                    queryParameters['pageKey'] = pageKey;
            }
            else if (operation === 'getNFTMetadata') {
                const contractAddress = inputParametersData.contractAddress;
                const tokenId = inputParametersData.tokenId;
                const tokenType = inputParametersData.tokenType;
                queryParameters['contractAddress'] = contractAddress;
                queryParameters['tokenId'] = tokenId;
                if (tokenType)
                    queryParameters['tokenType'] = tokenType;
            }
            else if (operation === 'getNFTsForCollection') {
                const contractAddress = inputParametersData.contractAddress;
                const startToken = inputParametersData.startToken;
                const withMetadata = inputParametersData.withMetadata;
                const limit = inputParametersData.limit;
                const tokenUriTimeoutInMs = inputParametersData.tokenUriTimeoutInMs;
                queryParameters['contractAddress'] = contractAddress;
                if (startToken)
                    queryParameters['startToken'] = startToken;
                if (withMetadata)
                    queryParameters['withMetadata'] = withMetadata;
                if (limit)
                    queryParameters['limit'] = limit;
                if (tokenUriTimeoutInMs)
                    queryParameters['tokenUriTimeoutInMs'] = tokenUriTimeoutInMs;
            }
            else if (operation === 'getOwnersForCollection') {
                const contractAddress = inputParametersData.contractAddress;
                const withTokenBalances = inputParametersData.withTokenBalances;
                const block = inputParametersData.block;
                const pageKey = inputParametersData.pageKey;
                queryParameters['contractAddress'] = contractAddress;
                if (withTokenBalances)
                    queryParameters['withTokenBalances'] = withTokenBalances;
                if (block)
                    queryParameters['block'] = block;
                if (pageKey)
                    queryParameters['pageKey'] = pageKey;
            }
            else if (operation === 'getOwnersForToken' || operation === 'computeRarity') {
                const contractAddress = inputParametersData.contractAddress;
                const tokenId = inputParametersData.tokenId;
                queryParameters['contractAddress'] = contractAddress;
                queryParameters['tokenId'] = tokenId;
            }
            else if (operation === 'isSpamContract' ||
                operation === 'reingestContract' ||
                operation === 'getFloorPrice' ||
                operation === 'summarizeNFTAttributes' ||
                operation === 'reportSpamContract') {
                const contractAddress = inputParametersData.contractAddress;
                queryParameters['contractAddress'] = contractAddress;
            }
            else if (operation === 'searchContractMetadata') {
                const query = inputParametersData.query;
                queryParameters['query'] = query;
            }
            else if (operation === 'isHolderOfCollection') {
                const contractAddress = inputParametersData.contractAddress;
                const wallet = inputParametersData.wallet;
                queryParameters['contractAddress'] = contractAddress;
                queryParameters['wallet'] = wallet;
            }
            else if (operation === 'getNFTSales') {
                const contractAddress = inputParametersData.contractAddress;
                const tokenId = inputParametersData.tokenId;
                const startBlock = inputParametersData.startBlock;
                const startLogIndex = inputParametersData.startLogIndex;
                const startBundleIndex = inputParametersData.startBundleIndex;
                const ascendingOrder = inputParametersData.ascendingOrder;
                const marketplace = inputParametersData.marketplace;
                const buyerAddress = inputParametersData.buyerAddress;
                const sellerAddress = inputParametersData.sellerAddress;
                const buyerIsMaker = inputParametersData.buyerIsMaker;
                const limit = inputParametersData.limit;
                queryParameters['contractAddress'] = contractAddress;
                queryParameters['tokenId'] = tokenId;
                if (startBlock)
                    queryParameters['startBlock'] = startBlock;
                if (startLogIndex)
                    queryParameters['startLogIndex'] = startLogIndex;
                if (startBundleIndex)
                    queryParameters['startBundleIndex'] = startBundleIndex;
                if (ascendingOrder)
                    queryParameters['ascendingOrder'] = ascendingOrder;
                if (marketplace)
                    queryParameters['marketplace'] = marketplace;
                if (buyerAddress)
                    queryParameters['buyerAddress'] = buyerAddress;
                if (sellerAddress)
                    queryParameters['sellerAddress'] = sellerAddress;
                if (buyerIsMaker)
                    queryParameters['buyerIsMaker'] = buyerIsMaker;
                if (limit)
                    queryParameters['limit'] = limit;
            }
            else if (operation === 'getContractsForOwner') {
                const owner = inputParametersData.owner;
                const pageKey = inputParametersData.pageKey;
                queryParameters['owner'] = owner;
                if (pageKey)
                    queryParameters['pageKey'] = pageKey;
            }
            try {
                const axiosConfig = {
                    method: 'GET',
                    url: uri,
                    params: queryParameters,
                    paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                    headers: {
                        'Content-Type': 'application/json'
                    }
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
        return (0, utils_1.returnNodeExecutionData)([]);
    }
}
const getSelectedOperations = (api, network) => {
    switch (api) {
        case 'chainAPI':
            if (network === ChainNetwork_1.NETWORK.MATIC || network === ChainNetwork_1.NETWORK.MATIC_MUMBAI)
                return [...ETHOperations_1.polygonOperations, ...ETHOperations_1.ethOperations];
            else
                return ETHOperations_1.ethOperations;
        case 'txReceiptsAPI':
            return extendedOperation_1.transactionReceiptsOperations;
        case 'tokenAPI':
            return extendedOperation_1.tokenAPIOperations;
        case 'solanaAPI':
            return solanaOperation_1.solanaAPIOperations;
        default:
            return ETHOperations_1.ethOperations;
    }
};
module.exports = { nodeClass: Alchemy };
//# sourceMappingURL=Alchemy.js.map