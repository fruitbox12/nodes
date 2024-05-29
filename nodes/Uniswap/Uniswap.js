"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
const IWETH_json_1 = __importDefault(require("@uniswap/v2-periphery/build/IWETH.json"));
const axios_1 = __importDefault(require("axios"));
const simple_uniswap_sdk_1 = require("simple-uniswap-sdk");
const nativeTokens_1 = require("./nativeTokens");

class Uniswap {
    constructor() {
        this.loadMethods = {
            async getTokens(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return returnData;
                const network = networksData.network;
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://tokens.uniswap.org`
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const responseData = response.data;
                    let tokens = responseData.tokens;
                    const nativeToken = nativeTokens_1.nativeTokens[network];
                    // Add native token
                    const data = {
                        label: `${nativeToken.name} (${nativeToken.symbol})`,
                        name: `${nativeToken.address};${nativeToken.symbol};${nativeToken.name}`
                    };
                    returnData.push(data);
                    // Add other tokens
                    tokens = tokens.filter((tkn) => tkn.chainId === ChainNetwork_1.chainIdLookup[network]);
                    for (let i = 0; i < tokens.length; i += 1) {
                        const token = tokens[i];
                        const data = {
                            label: `${token.name} (${token.symbol})`,
                            name: `${token.address};${token.symbol};${token.name}`
                        };
                        returnData.push(data);
                    }
                    return returnData;
                } catch (e) {
                    return returnData;
                }
            },
            async getWallets(nodeData, dbCollection) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined) {
                    return returnData;
                }
                try {
                    if (dbCollection === undefined || !dbCollection || !dbCollection.Wallet) {
                        return returnData;
                    }
                    const wallets = dbCollection.Wallet;
                    for (let i = 0; i < wallets.length; i += 1) {
                        const wallet = wallets[i];
                        const data = {
                            label: `${wallet.name} (${wallet.network})`,
                            name: JSON.stringify(wallet),
                            description: wallet.address
                        };
                        returnData.push(data);
                    }
                    return returnData;
                } catch (e) {
                    return returnData;
                }
            },
            async getNetworkProviders(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return returnData;
                const network = networksData.network;
                return (0, ChainNetwork_1.getNetworkProvidersList)(network);
            }
        };
        this.label = 'Uniswap';
        this.name = 'uniswap';
        this.icon = 'uniswap.png';
        this.type = 'action';
        this.category = 'Decentralized Finance';
        this.version = 1.0;
        this.description = 'Execute Uniswap operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Swap Tokens',
                        name: 'swapTokens',
                        description: 'Supports uniswap v2 and v3 prices together and returns the best price for swapping.'
                    },
                    {
                        label: 'Get Pairs',
                        name: 'getPairs',
                        description: 'Get most liquid pairs'
                    },
                    {
                        label: 'Custom Query',
                        name: 'customQuery',
                        description: 'Custom subgraph query to retrieve more information. https://docs.uniswap.org/protocol/V2/reference/API/queries'
                    }
                ],
                default: 'swapTokens'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.MAINNET,
                        name: ChainNetwork_1.NETWORK.MAINNET,
                        parentGroup: 'Ethereum'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.POLYGON,
                        name: ChainNetwork_1.NETWORK.POLYGON,
                        parentGroup: 'Polygon'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.OPTIMISM,
                        name: ChainNetwork_1.NETWORK.OPTIMISM,
                        parentGroup: 'Optimism'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.ARBITRUM,
                        name: ChainNetwork_1.NETWORK.ARBITRUM,
                        parentGroup: 'Arbitrum'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.BASE,
                        name: ChainNetwork_1.NETWORK.BASE,
                        parentGroup: 'Base'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.BNB,
                        name: ChainNetwork_1.NETWORK.BNB,
                        parentGroup: 'BNB'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.CELO,
                        name: ChainNetwork_1.NETWORK.CELO,
                        parentGroup: 'Celo'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.AVALANCHE,
                        name: ChainNetwork_1.NETWORK.AVALANCHE,
                        parentGroup: 'Avalanche'
                    },
                    {
                        label: ChainNetwork_1.NETWORK_LABEL.BLAST,
                        name: ChainNetwork_1.NETWORK.BLAST,
                        parentGroup: 'Blast'
                    }
                ],
                default: 'homestead',
                show: {
                    'actions.operation': ['getPairs', 'customQuery']
                }
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
                    'networks.networkProvider': ['customRPC'],
                    'actions.operation': ['swapTokens']
                }
            },
            {
                label: 'Websocket Endpoint',
                name: 'websocketRPC',
                type: 'string',
                default: '',
                show: {
                    'networks.networkProvider': ['customWebsocket'],
                    'actions.operation': ['swapTokens']
                }
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
                        name: 'alchemyApi',
                        show: {
                            'networks.networkProvider': [ChainNetwork_1.NETWORK_PROVIDER.ALCHEMY]
                        }
                    },
                    {
                        label: 'Infura API Key',
                        name: 'infuraApi',
                        show: {
                            'networks.networkProvider': [ChainNetwork_1.NETWORK_PROVIDER.INFURA]
                        }
                    },
                    {
                        label: 'QuickNode Endpoints',
                        name: 'quickNodeEndpoints',
                        show: {
                            'networks.networkProvider': [ChainNetwork_1.NETWORK_PROVIDER.QUICKNODE]
                        }
                    }
                ],
                default: '',
                show: {
                    'networks.networkProvider': [ChainNetwork_1.NETWORK_PROVIDER.ALCHEMY, ChainNetwork_1.NETWORK_PROVIDER.INFURA, ChainNetwork_1.NETWORK_PROVIDER.QUICKNODE],
                    'actions.operation': ['swapTokens']
                }
            }
        ];
        this.inputParameters = [
            {
                label: 'From Token',
                name: 'fromToken',
                type: 'asyncOptions',
                description: 'Contract address of the token you want to convert FROM.',
                loadMethod: 'getTokens',
                show: {
                    'actions.operation': ['swapTokens']
                }
            },
            {
                label: 'To Token',
                name: 'toToken',
                type: 'asyncOptions',
                description: 'Contract address of the token you want to convert TO.',
                loadMethod: 'getTokens',
                show: {
                    'actions.operation': ['swapTokens']
                }
            },
            {
                label: 'Amount To Swap',
                name: 'amountToSwap',
                type: 'number',
                show: {
                    'actions.operation': ['swapTokens']
                }
            },
            {
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to swap tokens.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets',
                show: {
                    'actions.operation': ['swapTokens']
                }
            },
            {
                label: 'Query',
                name: 'query',
                type: 'string',
                rows: 10,
                show: {
                    'actions.operation': ['customQuery']
                }
            },
            {
                label: 'Slippage Tolerance (%)',
                name: 'slippage',
                type: 'number',
                default: 0.5,
                optional: true,
                description: 'How large of a price movement to tolerate before trade will fail to execute. Default to 0.5%.',
                show: {
                    'actions.operation': ['swapTokens']
                }
            },
            {
                label: 'Tx Deadline (mins)',
                name: 'deadlineMinutes',
                type: 'number',
                default: 20,
                optional: true,
                description: 'Minutes after which the transaction will fail. Default to 20 mins.',
                show: {
                    'actions.operation': ['swapTokens']
                }
            },
            {
                label: 'Disable Multihops',
                name: 'disableMultihops',
                type: 'boolean',
                default: false,
                optional: true,
                description: 'Restricts swaps to direct pairs only. Default to false.',
                show: {
                    'actions.operation': ['swapTokens']
                }
            }
        ];
    }

    async run(nodeData) {
        const networksData = nodeData.networks;
        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || actionsData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        try {
            const network = networksData.network;
            const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
            if (!provider)
                throw new Error('Invalid Network Provider');
            // Get operation
            const operation = actionsData.operation;
            if (operation === 'swapTokens') {
                // Get fromTokenAddress
                const fromToken = inputParametersData.fromToken;
                const [fromTokenContractAddress, fromTokenSymbol] = fromToken.split(';');
                // Get toTokenAddress
                const toToken = inputParametersData.toToken;
                const [toTokenContractAddress, toTokenSymbol] = toToken.split(';');
                // Get wallet instance
                const walletString = inputParametersData.wallet;
                const walletDetails = JSON.parse(walletString);
                const walletCredential = JSON.parse(walletDetails.walletCredential);
                const wallet = new ethers_1.ethers.Wallet(walletCredential.privateKey, provider);
                // Get amount
                const amountToSwap = inputParametersData.amountToSwap;
                if (fromTokenContractAddress.includes(`_${ChainNetwork_1.nativeCurrency[network]}`) && toTokenSymbol === 'WETH') {
                    const wrapEthContract = new ethers_1.ethers.Contract(toTokenContractAddress, IWETH_json_1.default['abi'], wallet);
                    const tx = await wrapEthContract.deposit({ value: ethers_1.ethers.utils.parseUnits(amountToSwap, 18) });
                    const approveReceipt = await tx.wait();
                    if (approveReceipt.status === 0)
                        throw new Error(`Failed to swap ETH to WETH`);
                    const returnItem = {
                        transactionHash: tx.hash,
                        transactionReceipt: approveReceipt,
                        link: `${ChainNetwork_1.networkExplorers[network]}/tx/${tx.hash}`
                    };
                    return (0, utils_1.returnNodeExecutionData)(returnItem);
                }
                else if (toTokenContractAddress.includes(`_${ChainNetwork_1.nativeCurrency[network]}`) && fromTokenSymbol === 'WETH') {
                    const wrapEthContract = new ethers_1.ethers.Contract(fromTokenContractAddress, IWETH_json_1.default['abi'], wallet);
                    const tx = await wrapEthContract.withdraw(ethers_1.ethers.utils.parseUnits(amountToSwap, 18));
                    const approveReceipt = await tx.wait();
                    if (approveReceipt.status === 0)
                        throw new Error(`Failed to swap WETH to ETH`);
                    const returnItem = {
                        transactionHash: tx.hash,
                        transactionReceipt: approveReceipt,
                        link: `${ChainNetwork_1.networkExplorers[network]}/tx/${tx.hash}`
                    };
                    return (0, utils_1.returnNodeExecutionData)(returnItem);
                }
                else {
                    const slippage = inputParametersData.slippage;
                    const deadlineMinutes = inputParametersData.deadlineMinutes;
                    const disableMultihops = inputParametersData.disableMultihops;
                    const uniswapPair = new simple_uniswap_sdk_1.UniswapPair({
                        fromTokenContractAddress,
                        toTokenContractAddress,
                        ethereumAddress: wallet.address,
                        ethereumProvider: provider,
                        chainId: ChainNetwork_1.chainIdLookup[network],
                        settings: new simple_uniswap_sdk_1.UniswapPairSettings({
                            slippage: parseFloat(slippage) / 100.0 || 0.0005,
                            deadlineMinutes: deadlineMinutes || 20,
                            disableMultihops: disableMultihops || false
                        })
                    });
                    const uniswapPairFactory = await uniswapPair.createFactory();
                    const trade = await uniswapPairFactory.trade(amountToSwap);
                    if (!trade.fromBalance.hasEnough) {
                        throw new Error('You do not have enough from balance to execute this swap');
                    }
                    // Why we need two transactions: https://github.com/joshstevens19/simple-uniswap-sdk#ethers-example
                    if (trade.approvalTransaction) {
                        const approved = await wallet.sendTransaction(trade.approvalTransaction);
                        await approved.wait();
                    }
                    const tradeTransaction = await wallet.sendTransaction(trade.transaction);
                    const tradeReceipt = await tradeTransaction.wait();
                    trade.destroy();
                    const returnItem = {
                        operation,
                        transactionHash: tradeTransaction.hash,
                        transactionReceipt: tradeReceipt,
                        link: `${ChainNetwork_1.networkExplorers[network]}/tx/${tradeTransaction.hash}`
                    };
                    return (0, utils_1.returnNodeExecutionData)(returnItem);
                }
            } else if (operation === 'getPairs' || operation === 'customQuery') {
                let query = '';
                if (operation === 'customQuery')
                    query = inputParametersData.query;
                else {
                    query = `{
                        pairs(
                            first: 100 
                            orderBy: reserveUSD
                            orderDirection: desc
                        ) { 
                            id 
                            token0 { 
                                id 
                                symbol 
                                name 
                            } 
                            token1 { 
                                id 
                                symbol 
                                name 
                            }
                            reserveUSD
                            volumeUSD
                        }
                    }`;
                }
                query = query.replace(/\s/g, ' ');
                const axiosConfig = {
                    method: 'POST',
                    url: `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
                    data: { query }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                const responseData = response.data;
                const returnData = [];
                if (Array.isArray(responseData))
                    returnData.push(...responseData);
                else
                    returnData.push(responseData);
                return (0, utils_1.returnNodeExecutionData)(returnData);
            }
            return (0, utils_1.returnNodeExecutionData)([]);
        } catch (e) {
            throw (0, utils_1.handleErrorMessage)(e);
        }
    }
}
module.exports = { nodeClass: Uniswap };
//# sourceMappingURL=Uniswap.js.map
