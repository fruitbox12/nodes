"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
const axios_1 = __importDefault(require("axios"));
const WBNB_json_1 = __importDefault(require("../../src/abis/WBNB.json"));
class BEP20TransferTrigger extends events_1.default {
    constructor() {
        super();
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
                    let tokens = responseData.tokens;
                    // Add any token
                    const anyData = {
                        label: `- Any BEP20 Token -`,
                        name: `anyBEP20Address`
                    };
                    returnData.push(anyData);
                    // Add custom token
                    const data = {
                        label: `- Custom BEP20 Address -`,
                        name: `customBEP20Address`
                    };
                    returnData.push(data);
                    // Add other tokens
                    tokens = tokens.filter((tkn) => tkn.chainId === ChainNetwork_1.chainIdLookup[network]);
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
        this.label = 'BEP20 Transfer Trigger';
        this.name = 'BEP20TransferTrigger';
        this.icon = 'bep20.png';
        this.type = 'trigger';
        this.category = 'Cryptocurrency';
        this.version = 1.1;
        this.description = 'Triggers whenever a BEP20 transfer event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.providers = {};
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ChainNetwork_1.BSCNetworks],
                default: 'bsc'
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'options',
                options: [...ChainNetwork_1.binanceNetworkProviders],
                default: 'binance'
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
                label: 'BEP20 Token',
                name: 'bep20Token',
                type: 'asyncOptions',
                description: 'BEP20 Token to send/transfer',
                loadMethod: 'getTokens',
                default: 'anyBEP20Address'
            },
            {
                label: 'Custom BEP20 Address',
                name: 'customBEP20TokenAddress',
                type: 'string',
                description: 'BEP20 Token Address',
                show: {
                    'inputParameters.bep20Token': ['customBEP20Address']
                }
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
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const network = networksData.network;
        const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
        if (!provider)
            throw new Error('Invalid Network Provider');
        const emitEventKey = nodeData.emitEventKey;
        const fromAddress = inputParametersData.fromAddress || null;
        const toAddress = inputParametersData.toAddress || null;
        const bep20Token = inputParametersData.bep20Token;
        const customBEP20TokenAddress = inputParametersData.customBEP20TokenAddress;
        const filter = {
            topics: [
                ethers_1.utils.id('Transfer(address,address,uint256)'),
                fromAddress ? ethers_1.utils.hexZeroPad(fromAddress, 32) : null,
                toAddress ? ethers_1.utils.hexZeroPad(toAddress, 32) : null
            ]
        };
        if (bep20Token !== 'anyBEP20Address') {
            filter['address'] = bep20Token === 'customBEP20Address' ? customBEP20TokenAddress : bep20Token.split(';')[0];
        }
        provider.on(filter, async (log) => {
            const txHash = log.transactionHash;
            const contractInstance = new ethers_1.ethers.Contract(log.address, WBNB_json_1.default, provider);
            /* events are empty at the moment
            const iface = new ethers.utils.Interface(eventTransferAbi);
            const logs = await provider.getLogs(filter);
            const events = logs.map((log) => iface.parseLog(log));
            const fromWallet = events.length ? events[0].args[0] : '';
            const toWallet = events.length ? events[0].args[1] : '';
            const value: BigNumber = events.length ? events[0].args[2] : '';
            */
            //BEP20 has 3 topics length
            if (log.topics.length === 3) {
                const returnItem = {};
                const name = await contractInstance.name();
                const symbol = await contractInstance.symbol();
                //const decimals = await contractInstance.decimals();
                //const amount = utils.formatUnits(value.toString(), decimals);
                returnItem['Token Name'] = name;
                returnItem['Token Symbol'] = symbol;
                returnItem['Token Address'] = log.address;
                if (fromAddress)
                    returnItem['From Wallet'] = fromAddress;
                if (toAddress)
                    returnItem['To Wallet'] = toAddress;
                //returnItem['Amount Transfered'] = parseFloat(amount);
                returnItem['txHash'] = txHash;
                returnItem['explorerLink'] = `${ChainNetwork_1.networkExplorers[network]}/tx/${txHash}`;
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
module.exports = { nodeClass: BEP20TransferTrigger };
//# sourceMappingURL=BEP20TransferTrigger.js.map