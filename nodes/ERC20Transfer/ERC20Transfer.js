"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const src_1 = require("../../src");
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const WETH_json_1 = __importDefault(require("../../src/abis/WETH.json"));
class ERC20Transfer {
    constructor() {
        this.loadMethods = {
            async getWallets(nodeData, dbCollection) {
                const returnData = [];
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
            },
            async getNetworkProviders(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return returnData;
                const network = networksData.network;
                return (0, src_1.getNetworkProvidersList)(network);
            },
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
                    // Add custom token
                    const data = {
                        label: `- Custom ERC20 Address -`,
                        name: `customERC20Address`
                    };
                    returnData.push(data);
                    // Add other tokens
                    tokens = tokens.filter((tkn) => tkn.chainId === src_1.chainIdLookup[network]);
                    for (let i = 0; i < tokens.length; i += 1) {
                        const token = tokens[i];
                        const data = {
                            label: `${token.name} (${token.symbol})`,
                            name: `${token.address};${token.decimals}`
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
        this.label = 'ERC20 Transfer';
        this.name = 'ERC20Transfer';
        this.icon = 'erc20.svg';
        this.type = 'action';
        this.category = 'Cryptocurrency';
        this.version = 1.0;
        this.description = 'Send/Transfer ERC20 to an address';
        this.incoming = 1;
        this.outgoing = 1;
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...src_1.ETHNetworks, ...src_1.PolygonNetworks, ...src_1.OptimismNetworks, ...src_1.ArbitrumNetworks]
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
        this.credentials = [...src_1.networkProviderCredentials];
        this.inputParameters = [
            {
                label: 'ERC20 Token',
                name: 'erc20Token',
                type: 'asyncOptions',
                description: 'ERC20 Token to send/transfer',
                loadMethod: 'getTokens'
            },
            {
                label: 'Custom ERC20 Address',
                name: 'customERC20TokenAddress',
                type: 'string',
                description: 'ERC20 Token Address',
                show: {
                    'inputParameters.erc20Token': ['customERC20Address']
                }
            },
            {
                label: 'Wallet To Transfer',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to send/transfer ERC20',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Address To Receive',
                name: 'address',
                type: 'string',
                default: '',
                description: 'Address to receive ERC20'
            },
            {
                label: 'Amount',
                name: 'amount',
                type: 'number',
                description: 'Amount of ERC20 to transfer'
            },
            {
                label: 'Gas Limit',
                name: 'gasLimit',
                type: 'number',
                optional: true,
                placeholder: '100000',
                description: 'Maximum price you are willing to pay when sending a transaction'
            },
            {
                label: 'Max Fee per Gas',
                name: 'maxFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '200',
                description: 'The maximum price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>'
            },
            {
                label: 'Max Priority Fee per Gas',
                name: 'maxPriorityFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '5',
                description: 'The priority fee price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>'
            }
        ];
    }
    async run(nodeData) {
        const networksData = nodeData.networks;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        try {
            const walletString = inputParametersData.wallet;
            const walletDetails = JSON.parse(walletString);
            const network = networksData.network;
            const provider = await (0, src_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
            if (!provider)
                throw new Error('Invalid Network Provider');
            // Get wallet instance
            const walletCredential = JSON.parse(walletDetails.walletCredential);
            const wallet = new ethers_1.ethers.Wallet(walletCredential.privateKey, provider);
            const address = inputParametersData.address;
            const amount = inputParametersData.amount;
            const erc20Token = inputParametersData.erc20Token;
            const customERC20TokenAddress = inputParametersData.customERC20TokenAddress;
            const gasLimit = inputParametersData.gasLimit;
            const maxFeePerGas = inputParametersData.maxFeePerGas;
            const maxPriorityFeePerGas = inputParametersData.maxPriorityFeePerGas;
            const contractAddress = erc20Token === 'customERC20Address' ? customERC20TokenAddress : erc20Token.split(';')[0];
            const contractInstance = new ethers_1.ethers.Contract(contractAddress, WETH_json_1.default, wallet);
            const decimals = erc20Token === 'customERC20Address'
                ? parseInt(await contractInstance.decimals(), 10)
                : parseInt(erc20Token.split(';').pop() || '0', 10);
            const numberOfTokens = ethers_1.ethers.utils.parseUnits(amount, decimals);
            // Send token
            const nonce = await provider.getTransactionCount(walletDetails.address);
            const txOption = {
                nonce
            };
            if (gasLimit)
                txOption.gasLimit = gasLimit;
            if (maxFeePerGas)
                txOption.maxFeePerGas = maxFeePerGas;
            if (maxPriorityFeePerGas)
                txOption.maxPriorityFeePerGas = maxPriorityFeePerGas;
            const contractInstanceForTransfer = new ethers_1.ethers.Contract(contractAddress, src_1.functionTransferAbi, wallet);
            const tx = await contractInstanceForTransfer.transfer(address, numberOfTokens, txOption);
            const txReceipt = await tx.wait();
            const returnItem = {
                transferFrom: wallet.address,
                transferTo: address,
                amount,
                transactionHash: tx.hash,
                transactionReceipt: txReceipt,
                link: `${src_1.networkExplorers[network]}/tx/${tx.hash}`
            };
            return (0, utils_1.returnNodeExecutionData)(returnItem);
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
    }
}
module.exports = { nodeClass: ERC20Transfer };
//# sourceMappingURL=ERC20Transfer.js.map