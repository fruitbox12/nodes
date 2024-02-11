"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
const axios_1 = __importDefault(require("axios"));
const supportedNetwork_1 = require("./supportedNetwork");
class ChainLink {
    constructor() {
        this.loadMethods = {
            async getNetworkProviders(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return returnData;
                const network = networksData.network;
                return (0, ChainNetwork_1.getNetworkProvidersList)(network);
            },
            async getPairAddress(nodeData) {
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return [];
                const network = networksData.network;
                return await getInputParametersData(network, 'default');
            },
            async getNftCollection(nodeData) {
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return [];
                const network = networksData.network;
                return await getInputParametersData(network, 'nftFloor');
            },
            async getReserveAddress(nodeData) {
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return [];
                const network = networksData.network;
                return await getInputParametersData(network, 'por');
            }
        };
        this.label = 'ChainLink';
        this.name = 'chainLink';
        this.icon = 'chainlink.svg';
        this.type = 'action';
        this.category = 'Decentralized Oracle Network';
        this.version = 1.0;
        this.description = 'Execute ChainLink operations such as Data Feeds, Randomness, Oracles.';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get Price Feeds',
                        name: 'getPriceFeeds',
                        description: 'Get real-world market prices of assets using ChainLink Oracle'
                    },
                    {
                        label: 'Get Proof of Reserve',
                        name: 'getProofReserve',
                        description: 'Provide the status of the reserves for several assets'
                    },
                    {
                        label: 'Get NFT Floor Pricing',
                        name: 'getNFTFloorPricing',
                        description: 'Get the lowest price of an NFT in a collection using ChainLink Oracle, ONLY available on Goerli'
                    }
                ],
                default: 'getPriceFeeds'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...supportedNetwork_1.chainLinkNetworks]
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'asyncOptions',
                loadMethod: 'getNetworkProviders'
            },
            {
                label: 'RPC Endpoint',
                name: 'jsonRPC',
                type: 'string',
                default: '',
                show: {
                    'networks.networkProvider': ['customRPC']
                }
            },
            {
                label: 'Websocket Endpoint',
                name: 'websocketRPC',
                type: 'string',
                default: '',
                show: {
                    'networks.networkProvider': ['customWebsocket']
                }
            }
        ];
        this.credentials = [...ChainNetwork_1.networkProviderCredentials];
        this.inputParameters = [
            {
                label: 'Pair',
                name: 'pair',
                type: 'asyncOptions',
                loadMethod: 'getPairAddress',
                show: {
                    'actions.operation': ['getPriceFeeds']
                }
            },
            {
                label: 'Reserve',
                name: 'reserve',
                type: 'asyncOptions',
                loadMethod: 'getReserveAddress',
                show: {
                    'actions.operation': ['getProofReserve']
                }
            },
            {
                label: 'NFT Collection',
                name: 'nftCollection',
                type: 'asyncOptions',
                loadMethod: 'getNftCollection',
                show: {
                    'actions.operation': ['getNFTFloorPricing']
                }
            }
        ];
    }
    async run(nodeData) {
        const networksData = nodeData.networks;
        const actionsData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (networksData === undefined || actionsData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        try {
            const network = networksData.network;
            const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
            if (!provider) {
                throw new Error('Invalid Network Provider');
            }
            const operation = actionsData.operation;
            if (operation === 'getPriceFeeds' || operation === 'getProofReserve' || operation === 'getNFTFloorPricing') {
                const pair = inputParametersData.pair;
                const parsedPair = JSON.parse(pair.replace(/\s/g, ''));
                const address = parsedPair.proxy;
                const aggregatorV3InterfaceABI = [
                    {
                        inputs: [],
                        name: 'decimals',
                        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                        stateMutability: 'view',
                        type: 'function'
                    },
                    {
                        inputs: [],
                        name: 'description',
                        outputs: [{ internalType: 'string', name: '', type: 'string' }],
                        stateMutability: 'view',
                        type: 'function'
                    },
                    {
                        inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
                        name: 'getRoundData',
                        outputs: [
                            { internalType: 'uint80', name: 'roundId', type: 'uint80' },
                            { internalType: 'int256', name: 'answer', type: 'int256' },
                            { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
                            { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
                            { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
                        ],
                        stateMutability: 'view',
                        type: 'function'
                    },
                    {
                        inputs: [],
                        name: 'latestRoundData',
                        outputs: [
                            { internalType: 'uint80', name: 'roundId', type: 'uint80' },
                            { internalType: 'int256', name: 'answer', type: 'int256' },
                            { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
                            { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
                            { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
                        ],
                        stateMutability: 'view',
                        type: 'function'
                    },
                    {
                        inputs: [],
                        name: 'version',
                        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                        stateMutability: 'view',
                        type: 'function'
                    }
                ];
                const priceFeed = new ethers_1.ethers.Contract(address, aggregatorV3InterfaceABI, provider);
                const roundData = await priceFeed.latestRoundData();
                const returnItem = Object.assign(Object.assign({ roundData }, parsedPair), { network });
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
            return (0, utils_1.returnNodeExecutionData)([]);
        }
        catch (e) {
            throw (0, utils_1.handleErrorMessage)(e);
        }
    }
}
const getInputParametersData = async (network, dataType) => {
    const returnData = [];
    try {
        const axiosConfig = {
            method: 'GET',
            url: `https://cl-docs-addresses.web.app/addresses.json`
        };
        const response = await (0, axios_1.default)(axiosConfig);
        const responseData = response.data;
        for (const parentNetwork in responseData) {
            const availableNetworks = responseData[parentNetwork].networks;
            const selectedNetwork = availableNetworks.find((ntk) => ntk.name === supportedNetwork_1.chainLinkNetworkMapping[network] && ntk.dataType === dataType);
            let availableProxies = [];
            if (selectedNetwork) {
                availableProxies = selectedNetwork.proxies;
            }
            for (const proxy of availableProxies) {
                const data = {
                    label: proxy.pair,
                    name: JSON.stringify(proxy)
                };
                returnData.push(data);
            }
        }
        return returnData;
    }
    catch (e) {
        return returnData;
    }
};
module.exports = { nodeClass: ChainLink };
//# sourceMappingURL=ChainLink.js.map