"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
class NFTTransferTrigger extends events_1.default {
    constructor() {
        super();
        this.loadMethods = {
            async getNetworkProviders(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return returnData;
                const network = networksData.network;
                return (0, ChainNetwork_1.getNetworkProvidersList)(network);
            }
        };
        this.label = 'NFT Transfer Trigger';
        this.name = 'NFTTransferTrigger';
        this.icon = 'nfttransfer.png';
        this.type = 'trigger';
        this.category = 'NFT';
        this.version = 1.0;
        this.description = 'Start workflow whenever a NFT transfer event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.providers = {};
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ChainNetwork_1.ETHNetworks, ...ChainNetwork_1.PolygonNetworks, ...ChainNetwork_1.ArbitrumNetworks, ...ChainNetwork_1.OptimismNetworks],
                default: 'homestead'
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
                label: 'Token Standard',
                name: 'tokenStandard',
                type: 'options',
                options: [
                    {
                        label: 'ERC-721',
                        name: 'ERC721'
                    },
                    {
                        label: 'ERC-1155',
                        name: 'ERC1155'
                    }
                ],
                default: 'ERC721'
            },
            {
                label: 'Transfer Method',
                name: 'tokenMethod',
                type: 'options',
                options: [
                    {
                        label: 'Single',
                        name: 'single'
                    },
                    {
                        label: 'Batch',
                        name: 'batch'
                    }
                ],
                default: 'single',
                show: {
                    'inputParameters.tokenStandard': ['ERC1155']
                }
            },
            {
                label: 'NFT Address',
                name: 'nftAddress',
                type: 'string',
                default: '',
                optional: true
            },
            {
                label: 'Direction',
                name: 'direction',
                type: 'options',
                options: [
                    {
                        label: 'From',
                        name: 'from',
                        description: 'Transfer from wallet address'
                    },
                    {
                        label: 'To',
                        name: 'to',
                        description: 'Transfer to wallet address'
                    },
                    {
                        label: 'Both From and To',
                        name: 'fromTo',
                        description: 'Transfer from a wallet address to another wallet address'
                    }
                ],
                default: ''
            },
            {
                label: 'From Wallet Address',
                name: 'fromAddress',
                type: 'string',
                default: '',
                show: {
                    'inputParameters.direction': ['from', 'fromTo']
                }
            },
            {
                label: 'To Wallet Address',
                name: 'toAddress',
                type: 'string',
                default: '',
                show: {
                    'inputParameters.direction': ['to', 'fromTo']
                }
            }
        ];
    }
    async runTrigger(nodeData) {
        const networksData = nodeData.networks;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const network = networksData.network;
        const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
        if (!provider)
            throw new Error('Invalid Network Provider');
        const emitEventKey = nodeData.emitEventKey;
        const nftAddress = inputParametersData.nftAddress;
        const fromAddress = inputParametersData.fromAddress;
        const toAddress = inputParametersData.toAddress;
        const tokenStandard = inputParametersData.tokenStandard;
        const tokenMethod = inputParametersData.tokenMethod;
        let ifaceABI = ChainNetwork_1.eventTransferAbi;
        let topicId = ethers_1.utils.id('Transfer(address,address,uint256)');
        if (tokenStandard === 'ERC1155' && tokenMethod === 'single') {
            topicId = ethers_1.utils.id('TransferSingle(address,address,address,uint256,uint256)');
            ifaceABI = ChainNetwork_1.erc1155SingleTransferAbi;
        }
        if (tokenStandard === 'ERC1155' && tokenMethod === 'batch') {
            topicId = ethers_1.utils.id('TransferBatch(address,address,address,uint256[],uint256[])');
            ifaceABI = ChainNetwork_1.erc1155BatchTransferAbi;
        }
        const filter = {
            topics: [topicId, fromAddress ? ethers_1.utils.hexZeroPad(fromAddress, 32) : null, toAddress ? ethers_1.utils.hexZeroPad(toAddress, 32) : null]
        };
        if (nftAddress)
            filter['address'] = nftAddress;
        provider.on(filter, async (log) => {
            const txHash = log.transactionHash;
            const iface = new ethers_1.ethers.utils.Interface(ifaceABI);
            const logs = await provider.getLogs(filter);
            const events = logs.map((log) => iface.parseLog(log));
            const fromWallet = events.length ? events[0].args[tokenStandard === 'ERC1155' ? 1 : 0] : '';
            const toWallet = events.length ? events[0].args[tokenStandard === 'ERC1155' ? 2 : 1] : '';
            //ERC721 or ERC1155 has 4 topics length
            if (log.topics.length === 4) {
                const returnItem = {};
                returnItem['From Wallet'] = fromWallet;
                returnItem['To Wallet'] = toWallet;
                returnItem['NFT Token Address'] = log.address;
                if (ChainNetwork_1.openseaExplorers[network]) {
                    let tokenString = '';
                    const counter = log.topics[log.topics.length - 1];
                    const strippedZeroCounter = ethers_1.utils.hexStripZeros(counter);
                    if (strippedZeroCounter !== '0x') {
                        const counterBigNubmer = ethers_1.ethers.BigNumber.from(strippedZeroCounter);
                        tokenString = counterBigNubmer.toString();
                    }
                    else {
                        tokenString = '0';
                    }
                    returnItem['NFT Token Id'] = tokenString;
                    returnItem['txHash'] = txHash;
                    returnItem['explorerLink'] = `${ChainNetwork_1.networkExplorers[network]}/tx/${txHash}`;
                    returnItem['openseaLink'] = `${ChainNetwork_1.openseaExplorers[network]}/assets/${log.address}/${tokenString}`;
                }
                this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnItem));
            }
        });
        this.providers[emitEventKey] = { provider, filter };
    }
    async removeTrigger(nodeData) {
        const emitEventKey = nodeData.emitEventKey;
        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            const provider = this.providers[emitEventKey].provider;
            const filter = this.providers[emitEventKey].filter;
            provider.off(filter);
            this.removeAllListeners(emitEventKey);
        }
    }
}
module.exports = { nodeClass: NFTTransferTrigger };
//# sourceMappingURL=NFTTransferTrigger.js.map