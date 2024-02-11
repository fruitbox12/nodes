"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
class BlockchainEvent extends events_1.default {
    constructor() {
        super();
        this.loadMethods = {
            async getNetworkProviders(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                const actionsData = nodeData.actions;
                if (networksData === undefined || actionsData === undefined)
                    return returnData;
                const network = networksData.network;
                if (actionsData.event === 'pending') {
                    return [
                        {
                            label: 'Custom Websocket Endpoint',
                            name: ChainNetwork_1.NETWORK_PROVIDER.CUSTOMWSS,
                            description: 'WSS Endpoint',
                            parentGroup: 'Custom Nodes'
                        }
                    ];
                }
                return (0, ChainNetwork_1.getNetworkProvidersList)(network);
            }
        };
        this.label = 'Blockchain Event Trigger';
        this.name = 'blockchainEventTrigger';
        this.icon = 'blockchainevent.svg';
        this.type = 'trigger';
        this.category = 'Blockchain Events';
        this.version = 1.0;
        this.description = 'Start workflow whenever a specified event happened on chain';
        this.incoming = 0;
        this.outgoing = 1;
        this.providers = {};
        this.actions = [
            {
                label: 'Event Name',
                name: 'event',
                type: 'options',
                options: [
                    {
                        label: 'New Block',
                        name: 'block',
                        description: 'Emitted when a new block is mined'
                    },
                    {
                        label: 'Error',
                        name: 'error',
                        description: 'emitted on any error'
                    },
                    {
                        label: 'New Transaction',
                        name: 'pending',
                        description: 'Emitted when a new transaction enters the memory pool. Only certain providers offer this event and may require running your own node for reliable results'
                    },
                    {
                        label: 'Transaction Hash',
                        name: 'txHash',
                        description: 'Emitted when the transaction has been mined'
                    }
                ],
                default: 'block'
            },
            {
                label: 'Transaction Hash',
                name: 'txHash',
                type: 'string',
                default: '',
                show: {
                    'actions.event': ['txHash']
                }
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    ...ChainNetwork_1.ETHNetworks,
                    ...ChainNetwork_1.PolygonNetworks,
                    ...ChainNetwork_1.ArbitrumNetworks,
                    ...ChainNetwork_1.OptimismNetworks,
                    ...ChainNetwork_1.BSCNetworks,
                    ...ChainNetwork_1.AvalancheNetworks,
                    ...ChainNetwork_1.SolanaNetworks,
                    ...ChainNetwork_1.FantomNetworks,
                    ...ChainNetwork_1.GnosisNetworks,
                    ...ChainNetwork_1.HecoNetworks,
                    ...ChainNetwork_1.HarmonyNetworks,
                    ...ChainNetwork_1.MoonRiverNetworks,
                    ...ChainNetwork_1.MoonBeamNetworks,
                    ...ChainNetwork_1.MetisNetworks,
                    ...ChainNetwork_1.KlatynNetworks
                ],
                default: 'homestead'
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'asyncOptions',
                loadMethod: 'getNetworkProviders'
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
    }
    async runTrigger(nodeData) {
        const networksData = nodeData.networks;
        const credentials = nodeData.credentials;
        const actionsData = nodeData.actions;
        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }
        const network = networksData.network;
        const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC, true);
        if (!provider)
            throw new Error('Invalid Network Provider');
        const emitEventKey = nodeData.emitEventKey;
        let event = actionsData.event;
        if (event === 'txHash')
            event = actionsData.txHash;
        try {
            provider.on(event, async (result) => {
                const returnData = await getOutputResponse(event, result, provider);
                this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnData));
            });
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
        this.providers[emitEventKey] = { provider, filter: event };
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
const getOutputResponse = async (event, result, provider) => {
    let returnItem = {};
    switch (event) {
        case 'block':
            returnItem = { blockNumber: result };
            break;
        case 'error':
            returnItem = { error: result };
            break;
        case 'pending':
            returnItem = {
                pendingTransactionHash: result,
                pendingTransaction: (await provider.getTransaction(result)) || {}
            };
            break;
        case 'txHash':
            returnItem = { transaction: result };
            break;
    }
    return returnItem;
};
module.exports = { nodeClass: BlockchainEvent };
//# sourceMappingURL=BlockchainEvent.js.map