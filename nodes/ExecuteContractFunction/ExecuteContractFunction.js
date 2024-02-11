"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
class ExecuteContractFunction {
    constructor() {
        this.loadMethods = {
            async getContracts(nodeData, dbCollection) {
                const returnData = [];
                if (dbCollection === undefined || !dbCollection || !dbCollection.Contract) {
                    return returnData;
                }
                const contracts = dbCollection.Contract;
                for (let i = 0; i < contracts.length; i += 1) {
                    const contract = contracts[i];
                    const data = {
                        label: `${contract.name} (${contract.network})`,
                        name: JSON.stringify(contract),
                        description: contract.address
                    };
                    returnData.push(data);
                }
                return returnData;
            },
            async getFunctions(nodeData) {
                const returnData = [];
                const actionsData = nodeData.actions;
                if (actionsData === undefined) {
                    return returnData;
                }
                const contractString = actionsData.contract || '';
                if (!contractString)
                    return returnData;
                try {
                    const contractDetails = JSON.parse(contractString);
                    if (!contractDetails.abi || !contractDetails.address)
                        return returnData;
                    const abiString = contractDetails.abi;
                    const abi = JSON.parse(abiString);
                    for (const item of abi) {
                        if (!item.name)
                            continue;
                        if (item.type === 'function') {
                            const funcName = `${item.name} (${item.stateMutability})`;
                            const funcInputs = item.inputs;
                            let inputParameters = '';
                            let inputTypes = '';
                            for (let i = 0; i < funcInputs.length; i++) {
                                const input = funcInputs[i];
                                inputTypes += `${input.type} ${input.name}`;
                                if (i !== funcInputs.length - 1)
                                    inputTypes += ', ';
                                inputParameters += `<li><code class="inline">${input.type}</code> ${input.name}</li>`;
                            }
                            if (inputParameters) {
                                inputParameters = '<ul>' + inputParameters + '</ul>';
                            }
                            else {
                                inputParameters = '<ul>' + 'none' + '</ul>';
                            }
                            returnData.push({
                                label: funcName,
                                name: funcName,
                                description: inputTypes,
                                inputParameters
                            });
                        }
                    }
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
            async getWallets(nodeData, dbCollection) {
                const returnData = [];
                const actionsData = nodeData.actions;
                if (actionsData === undefined) {
                    return returnData;
                }
                const contractString = actionsData.contract || '';
                if (!contractString)
                    return returnData;
                try {
                    const contractDetails = JSON.parse(contractString);
                    if (!contractDetails.network)
                        return returnData;
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
                const actionData = nodeData.actions;
                if (actionData === undefined) {
                    return returnData;
                }
                const contractString = actionData.contract || '';
                if (!contractString)
                    return returnData;
                try {
                    const contractDetails = JSON.parse(contractString);
                    if (!contractDetails.network)
                        return returnData;
                    const network = contractDetails.network;
                    return (0, ChainNetwork_1.getNetworkProvidersList)(network);
                }
                catch (e) {
                    return returnData;
                }
            }
        };
        this.label = 'Execute Contract Function';
        this.name = 'executeContractFunction';
        this.icon = 'execute-contract-function.svg';
        this.type = 'action';
        this.category = 'Smart Contract';
        this.version = 1.1;
        this.description = 'Execute smart contract function.';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Select Contract',
                name: 'contract',
                type: 'asyncOptions',
                loadFromDbCollections: ['Contract'],
                loadMethod: 'getContracts'
            },
            {
                label: 'Function',
                name: 'function',
                type: 'asyncOptions',
                loadMethod: 'getFunctions'
            },
            {
                label: 'Function Parameters',
                name: 'funcParameters',
                type: 'json',
                placeholder: '["param1", "param2"]',
                description: 'Function parameters in array. Ex: ["param1", "param2"]',
                optional: true
            },
            {
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Connect wallet to sign transactions for functions that require changing states on blockchain, i.e: nonpayable or payable.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets',
                show: {
                    'actions.function': '(\\(payable\\)|\\(nonpayable\\))'
                }
            }
        ];
        this.networks = [
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
        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }
        try {
            const contractString = actionsData.contract || '';
            const contractDetails = JSON.parse(contractString);
            const network = contractDetails.network;
            const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
            if (!provider)
                throw new Error('Invalid Network Provider');
            // Get contract details
            const abiString = contractDetails.abi;
            const address = contractDetails.address;
            const abi = JSON.parse(abiString);
            let functionName = actionsData.function || '';
            let contractParameters = [];
            const funcParameters = actionsData.funcParameters;
            if (funcParameters) {
                try {
                    contractParameters = JSON.parse(funcParameters.replace(/\s/g, ''));
                }
                catch (error) {
                    throw (0, utils_1.handleErrorMessage)(error);
                }
            }
            let contractInstance;
            if (new RegExp('(\\(payable\\)|\\(nonpayable\\))').test(functionName)) {
                // Get wallet instance
                const walletString = actionsData.wallet;
                const walletDetails = JSON.parse(walletString);
                const walletCredential = JSON.parse(walletDetails.walletCredential);
                const wallet = new ethers_1.ethers.Wallet(walletCredential.privateKey, provider);
                contractInstance = new ethers_1.ethers.Contract(address, abi, wallet);
                const gasLimit = (inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.gasLimit) || 3000000;
                const maxFeePerGas = (inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.maxFeePerGas) || undefined;
                const maxPriorityFeePerGas = (inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.maxPriorityFeePerGas) || undefined;
                const gasPrice = await provider.getGasPrice();
                const nonce = await provider.getTransactionCount(walletDetails.address);
                const txOption = {
                    gasPrice,
                    gasLimit,
                    nonce
                };
                if (maxFeePerGas)
                    txOption.maxFeePerGas = maxFeePerGas;
                if (maxPriorityFeePerGas)
                    txOption.maxPriorityFeePerGas = maxPriorityFeePerGas;
                functionName = functionName.split(' ')[0];
                const tx = await contractInstance[functionName].apply(null, contractParameters.length ? contractParameters : null, txOption);
                const approveReceipt = await tx.wait();
                if (approveReceipt.status === 0)
                    throw new Error(`Function ${functionName} failed to send transaction`);
                const returnItem = {
                    function: functionName,
                    transactionHash: tx.hash,
                    transactionReceipt: approveReceipt,
                    link: `${ChainNetwork_1.networkExplorers[network]}/tx/${tx.hash}`
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
            else {
                contractInstance = new ethers_1.ethers.Contract(address, abi, provider);
                functionName = functionName.split(' ')[0];
                const result = await contractInstance[functionName].apply(null, contractParameters.length ? contractParameters : null);
                const returnItem = {
                    function: functionName,
                    result: result
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
        }
        catch (e) {
            throw (0, utils_1.handleErrorMessage)(e);
        }
    }
}
module.exports = { nodeClass: ExecuteContractFunction };
//# sourceMappingURL=ExecuteContractFunction.js.map