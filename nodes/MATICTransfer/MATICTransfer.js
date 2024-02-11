"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const src_1 = require("../../src");
const ethers_1 = require("ethers");
class MATICTransfer {
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
            }
        };
        this.label = 'MATIC Transfer';
        this.name = 'MATICTransfer';
        this.icon = 'polygon.svg';
        this.type = 'action';
        this.category = 'Cryptocurrency';
        this.version = 1.0;
        this.description = 'Send/Transfer MATIC to an address';
        this.incoming = 1;
        this.outgoing = 1;
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...src_1.PolygonNetworks]
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
                label: 'Wallet To Transfer',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to send/transfer MATIC',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Address To Receive',
                name: 'address',
                type: 'string',
                default: '',
                description: 'Address to receive MATIC'
            },
            {
                label: 'Amount',
                name: 'amount',
                type: 'number',
                description: 'Amount of MATIC to transfer'
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
            const gasLimit = inputParametersData.gasLimit;
            const maxFeePerGas = inputParametersData.maxFeePerGas;
            const maxPriorityFeePerGas = inputParametersData.maxPriorityFeePerGas;
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
            const tx = await wallet.sendTransaction(Object.assign({ to: address, value: ethers_1.ethers.utils.parseEther(amount) }, txOption));
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
module.exports = { nodeClass: MATICTransfer };
//# sourceMappingURL=MATICTransfer.js.map