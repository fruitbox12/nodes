"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const src_1 = require("../../src");
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const helperFunctions_1 = require("./helperFunctions");
const WETH_json_1 = __importDefault(require("../../src/abis/WETH.json"));
const IWETH_json_1 = __importDefault(require("@uniswap/v2-periphery/build/IWETH.json"));
class ERC20Function {
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
        this.label = 'ERC20 Function';
        this.name = 'ERC20Function';
        this.icon = 'erc20.svg';
        this.type = 'action';
        this.category = 'Cryptocurrency';
        this.version = 1.0;
        this.description = 'Execute ERC20 function such as deposit, withdraw, get balance, etc';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Function',
                name: 'function',
                type: 'options',
                options: [...helperFunctions_1.ERC20Functions]
            }
        ];
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
            ...helperFunctions_1.approveParameters,
            ...helperFunctions_1.allowanceParameters,
            ...helperFunctions_1.balanceOfParameters,
            ...helperFunctions_1.transferFromParameters,
            ...helperFunctions_1.depositParameters,
            ...helperFunctions_1.withdrawParameters,
            {
                label: 'Gas Limit',
                name: 'gasLimit',
                type: 'number',
                optional: true,
                placeholder: '100000',
                description: 'Maximum price you are willing to pay when sending a transaction',
                show: {
                    'actions.function': ['approve', 'transferFrom', 'deposit']
                }
            },
            {
                label: 'Max Fee per Gas',
                name: 'maxFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '200',
                description: 'The maximum price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>',
                show: {
                    'actions.function': ['approve', 'transferFrom', 'deposit']
                }
            },
            {
                label: 'Max Priority Fee per Gas',
                name: 'maxPriorityFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '5',
                description: 'The priority fee price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>',
                show: {
                    'actions.function': ['approve', 'transferFrom', 'deposit']
                }
            }
        ];
    }
    async run(nodeData) {
        const networksData = nodeData.networks;
        const credentials = nodeData.credentials;
        const actionsData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || inputParametersData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }
        try {
            const erc20Function = actionsData.function;
            const network = networksData.network;
            const provider = await (0, src_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
            if (!provider)
                throw new Error('Invalid Network Provider');
            const owner = inputParametersData.owner;
            const spender = inputParametersData.spender;
            const amount = inputParametersData.amount;
            const account = inputParametersData.account;
            const from = inputParametersData.from;
            const to = inputParametersData.to;
            const erc20Token = inputParametersData.erc20Token;
            const customERC20TokenAddress = inputParametersData.customERC20TokenAddress;
            const contractAddress = erc20Token === 'customERC20Address' ? customERC20TokenAddress : erc20Token.split(';')[0];
            const contractInstance = new ethers_1.ethers.Contract(contractAddress, WETH_json_1.default, provider);
            const decimals = erc20Token === 'customERC20Address'
                ? parseInt(await contractInstance.decimals(), 10)
                : parseInt(erc20Token.split(';').pop() || '0', 10);
            let returnItem = { function: erc20Function, link: `${src_1.networkExplorers[network]}/address/${contractAddress}` };
            if (erc20Function === 'allowance') {
                // allowance(address owner, address spender) → uint256
                returnItem.result = await contractInstance.allowance(owner, spender);
            }
            else if (erc20Function === 'approve') {
                // approve(address spender, uint256 amount) → bool
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider);
                const functionApproveAbi = ['function approve(address spender, uint256 amount) external returns (boolean)'];
                const contractInstance = new ethers_1.ethers.Contract(contractAddress, functionApproveAbi, wallet);
                const numberOfTokens = ethers_1.ethers.utils.parseUnits(amount, decimals);
                const tx = await contractInstance.approve(spender, numberOfTokens, txOption);
                const txReceipt = await tx.wait();
                returnItem = {
                    function: erc20Function,
                    spender,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt,
                    link: `${src_1.networkExplorers[network]}/tx/${tx.hash}`
                };
            }
            else if (erc20Function === 'balanceOf') {
                // balanceOf(address account) → uint256
                returnItem.result = ethers_1.ethers.utils.formatEther(await contractInstance.balanceOf(account));
            }
            else if (erc20Function === 'decimals') {
                // decimals() → uint8
                returnItem.result = await contractInstance.decimals();
            }
            else if (erc20Function === 'name') {
                // name() → string
                returnItem.result = await contractInstance.name();
            }
            else if (erc20Function === 'symbol') {
                // symbol() → string
                returnItem.result = await contractInstance.symbol();
            }
            else if (erc20Function === 'totalSupply') {
                // totalSupply() → uint256
                returnItem.result = ethers_1.ethers.utils.formatEther(await contractInstance.totalSupply());
            }
            else if (erc20Function === 'transferFrom') {
                // transferFrom(address sender, address recipient, uint256 amount) → bool
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider);
                const functionTransferFromAbi = [
                    'function transferFrom(address sender, address recipient, uint256 amount) external returns (boolean)'
                ];
                const contractInstance = new ethers_1.ethers.Contract(contractAddress, functionTransferFromAbi, wallet);
                const numberOfTokens = ethers_1.ethers.utils.parseUnits(amount, decimals);
                const tx = await contractInstance.transferFrom(from, to, numberOfTokens, txOption);
                const txReceipt = await tx.wait();
                returnItem = {
                    function: erc20Function,
                    transferFrom: from,
                    transferTo: to,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt,
                    link: `${src_1.networkExplorers[network]}/tx/${tx.hash}`
                };
            }
            else if (erc20Function === 'deposit') {
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider);
                const wrapEthContract = new ethers_1.ethers.Contract(contractAddress, IWETH_json_1.default['abi'], wallet);
                const numberOfTokens = ethers_1.ethers.utils.parseUnits(amount, decimals);
                const tx = await wrapEthContract.deposit(Object.assign(Object.assign({}, txOption), { value: numberOfTokens }));
                const txReceipt = await tx.wait();
                if (txReceipt.status === 0)
                    throw new Error(`Failed to deposit ETH to ${contractAddress}`);
                returnItem = {
                    function: erc20Function,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt,
                    link: `${src_1.networkExplorers[network]}/tx/${tx.hash}`
                };
            }
            else if (erc20Function === 'withdraw') {
                const { wallet } = await getWalletSigner(inputParametersData, provider);
                const wrapEthContract = new ethers_1.ethers.Contract(contractAddress, IWETH_json_1.default['abi'], wallet);
                const numberOfTokens = ethers_1.ethers.utils.parseUnits(amount, decimals);
                const tx = await wrapEthContract.withdraw(numberOfTokens);
                const txReceipt = await tx.wait();
                if (txReceipt.status === 0)
                    throw new Error(`Failed to withdraw ETH from ${contractAddress}`);
                returnItem = {
                    function: erc20Function,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt,
                    link: `${src_1.networkExplorers[network]}/tx/${tx.hash}`
                };
            }
            return (0, utils_1.returnNodeExecutionData)(returnItem);
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
    }
}
const getWalletSigner = async (inputParametersData, provider) => {
    const walletString = inputParametersData.wallet;
    const walletDetails = JSON.parse(walletString);
    const walletCredential = JSON.parse(walletDetails.walletCredential);
    const gasLimit = inputParametersData.gasLimit;
    const maxFeePerGas = inputParametersData.maxFeePerGas;
    const maxPriorityFeePerGas = inputParametersData.maxPriorityFeePerGas;
    const wallet = new ethers_1.ethers.Wallet(walletCredential.privateKey, provider);
    const txOption = {};
    txOption.nonce = await provider.getTransactionCount(walletDetails.address);
    if (gasLimit)
        txOption.gasLimit = gasLimit;
    if (maxFeePerGas)
        txOption.maxFeePerGas = maxFeePerGas;
    if (maxPriorityFeePerGas)
        txOption.maxPriorityFeePerGas = maxPriorityFeePerGas;
    return { txOption, wallet };
};
module.exports = { nodeClass: ERC20Function };
//# sourceMappingURL=ERC20Function.js.map