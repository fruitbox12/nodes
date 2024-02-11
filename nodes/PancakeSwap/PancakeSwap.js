"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
const axios_1 = __importDefault(require("axios"));
const simple_uniswap_sdk_1 = require("simple-uniswap-sdk");
const extendedTokens_1 = require("./extendedTokens");
const WBNB_json_1 = __importDefault(require("./abis/WBNB.json"));
class PancakeSwap {
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
                        url: `https://tokens.pancakeswap.finance/pancakeswap-extended.json`
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const responseData = response.data;
                    const tokens = responseData.tokens;
                    const nativeToken = extendedTokens_1.nativeTokens[network];
                    // Add native token
                    const data = {
                        label: `${nativeToken.name} (${nativeToken.symbol})`,
                        name: `${nativeToken.address};${nativeToken.symbol};${nativeToken.name};${nativeToken.decimals}`
                    };
                    returnData.push(data);
                    // Add other tokens
                    for (let i = 0; i < tokens.length; i += 1) {
                        const token = tokens[i];
                        const data = {
                            label: `${token.name} (${token.symbol})`,
                            name: `${token.address};${token.symbol};${token.name};${token.decimals}`
                        };
                        returnData.push(data);
                    }
                    return returnData;
                }
                catch (e) {
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
                }
                catch (e) {
                    return returnData;
                }
            }
        };
        this.label = 'PancakeSwap';
        this.name = 'pancakeSwap';
        this.icon = 'pancakeswap.png';
        this.type = 'action';
        this.category = 'Decentralized Finance';
        this.version = 1.0;
        this.description = 'Execute PancakeSwap operations';
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
                        name: 'swapTokens'
                    },
                    {
                        label: 'Custom Query',
                        name: 'customQuery',
                        description: 'Custom subgraph query to retrieve more information. https://github.com/pancakeswap/pancake-subgraph'
                    }
                ],
                default: 'swapTokens'
            },
            {
                label: 'Query Entity',
                name: 'queryEntity',
                type: 'options',
                options: [
                    {
                        label: 'Blocks',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks',
                        description: 'Tracks all blocks on Binance Smart Chain.'
                    },
                    {
                        label: 'Exchange',
                        name: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
                        description: 'Tracks all PancakeSwap Exchange data with price, volume, liquidity'
                    },
                    {
                        label: 'Lottery',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/lottery',
                        description: 'Tracks all PancakeSwap Lottery with rounds, draws and tickets.'
                    },
                    {
                        label: 'NFT Market (v1)',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market',
                        description: 'Tracks all PancakeSwap NFT Market for ERC-721.'
                    },
                    {
                        label: 'Pairs',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/pairs',
                        description: 'Tracks all PancakeSwap Pairs and Tokens.'
                    },
                    {
                        label: 'Pancake Squad',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/pancake-squad',
                        description: 'Tracks all Pancake Squad metrics with Owners, Tokens (including metadata), and Transactions.'
                    },
                    {
                        label: 'Prediction (v1)',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction',
                        description: 'Tracks all PancakeSwap Prediction (v1) with market, rounds, and bets.'
                    },
                    {
                        label: 'Prediction (v2)',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-v2',
                        description: 'Tracks all PancakeSwap Prediction (v2) with market, rounds, and bets.'
                    },
                    {
                        label: 'Profile',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/profile',
                        description: 'Tracks all PancakeSwap Profile with teams, users, points and campaigns.'
                    },
                    {
                        label: 'SmartChef',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/smartchef',
                        description: 'Tracks all PancakeSwap SmartChef (a.k.a. Syrup Pools) with tokens and rewards.'
                    },
                    {
                        label: 'Timelock',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/timelock',
                        description: 'Tracks all PancakeSwap Timelock queued, executed, and cancelled transactions.'
                    },
                    {
                        label: 'MasterChef (v2)',
                        name: 'https://api.thegraph.com/subgraphs/name/pancakeswap/masterchef-v2',
                        description: 'Tracks data for MasterChefV2.'
                    }
                ],
                default: 'https://api.thegraph.com/subgraphs/name/pancakeswap/pairs',
                show: {
                    'actions.operation': ['customQuery']
                }
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: 'Binance Smart Chain Mainnet',
                        name: 'bsc',
                        parentGroup: 'Binance Smart Chain'
                    }
                ],
                default: 'bsc',
                show: {
                    'actions.operation': ['customQuery', 'swapTokens']
                }
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'options',
                options: [...ChainNetwork_1.binanceNetworkProviders],
                default: 'binance',
                show: {
                    'actions.operation': ['swapTokens']
                }
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
                        label: 'QuickNode Endpoints',
                        name: 'quickNodeEndpoints',
                        show: {
                            'networks.networkProvider': [ChainNetwork_1.NETWORK_PROVIDER.QUICKNODE]
                        }
                    }
                ],
                show: {
                    'networks.networkProvider': [ChainNetwork_1.NETWORK_PROVIDER.QUICKNODE],
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
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || actionsData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        try {
            const network = networksData.network;
            const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, undefined, networksData.jsonRPC, networksData.websocketRPC);
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
                if (fromTokenContractAddress.includes(`_ETH`) && toTokenSymbol === 'WBNB') {
                    const wrapBNBContract = new ethers_1.ethers.Contract(toTokenContractAddress, WBNB_json_1.default, wallet);
                    const tx = await wrapBNBContract.deposit({ value: ethers_1.ethers.utils.parseUnits(amountToSwap, 18) });
                    const approveReceipt = await tx.wait();
                    if (approveReceipt.status === 0)
                        throw new Error(`Failed to swap BNB to WBNB`);
                    const returnItem = {
                        transactionHash: tx.hash,
                        transactionReceipt: approveReceipt,
                        link: `${ChainNetwork_1.networkExplorers[network]}/tx/${tx.hash}`
                    };
                    return (0, utils_1.returnNodeExecutionData)(returnItem);
                }
                else if (toTokenContractAddress.includes(`_ETH`) && fromTokenSymbol === 'WBNB') {
                    const wrapBNBContract = new ethers_1.ethers.Contract(fromTokenContractAddress, WBNB_json_1.default, wallet);
                    const tx = await wrapBNBContract.withdraw(ethers_1.ethers.utils.parseUnits(amountToSwap, 18));
                    const approveReceipt = await tx.wait();
                    if (approveReceipt.status === 0)
                        throw new Error(`Failed to swap WBNB to BNB`);
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
                    const targets = {
                        v2Override: {
                            routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
                            factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
                            pairAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
                        }
                    };
                    const customNetworkData = {
                        nameNetwork: 'Binance',
                        multicallContractAddress: '0x65e9a150e06c84003d15ae6a060fc2b1b393342c',
                        nativeCurrency: {
                            name: 'BNB Token',
                            symbol: 'BNB'
                        },
                        nativeWrappedTokenInfo: {
                            chainId: ChainNetwork_1.CHAIN_ID.BINANCE_MAINNET,
                            contractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
                            decimals: 18,
                            symbol: 'WBNB',
                            name: 'Wrapped BNB'
                        }
                    };
                    const uniswapPair = new simple_uniswap_sdk_1.UniswapPair({
                        fromTokenContractAddress,
                        toTokenContractAddress,
                        ethereumAddress: wallet.address,
                        ethereumProvider: provider,
                        settings: new simple_uniswap_sdk_1.UniswapPairSettings({
                            slippage: parseFloat(slippage) / 100.0 || 0.0005,
                            deadlineMinutes: deadlineMinutes || 20,
                            disableMultihops: disableMultihops || false,
                            uniswapVersions: [simple_uniswap_sdk_1.UniswapVersion.v2],
                            cloneUniswapContractDetails: targets,
                            customNetwork: customNetworkData
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
            }
            else if (operation === 'customQuery') {
                let query = inputParametersData.query;
                query = query.replace(/\s/g, ' ');
                const queryEntity = actionsData.queryEntity;
                const axiosConfig = {
                    method: 'POST',
                    url: queryEntity,
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
        }
        catch (e) {
            throw (0, utils_1.handleErrorMessage)(e);
        }
    }
}
module.exports = { nodeClass: PancakeSwap };
//# sourceMappingURL=PancakeSwap.js.map