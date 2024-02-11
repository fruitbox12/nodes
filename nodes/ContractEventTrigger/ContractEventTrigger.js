"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
class ContractEventTrigger extends events_1.default {
    constructor() {
        super();
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
            async getEvents(nodeData) {
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
                        if (item.type === 'event') {
                            const eventName = item.name;
                            const eventInputs = item.inputs;
                            let inputTypes = '';
                            let value = '';
                            for (let i = 0; i < eventInputs.length; i++) {
                                const input = eventInputs[i];
                                value += input.type;
                                inputTypes += `${input.type} ${input.name}`;
                                if (i !== eventInputs.length - 1) {
                                    inputTypes += ', ';
                                    value += ',';
                                }
                            }
                            returnData.push({
                                label: eventName,
                                name: `${eventName}(${value})`,
                                description: inputTypes
                            });
                        }
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
        this.label = 'Contract Event Trigger';
        this.name = 'ContractEventTrigger';
        this.icon = 'contract-event-trigger.svg';
        this.type = 'trigger';
        this.category = 'Smart Contract';
        this.version = 1.0;
        this.description = 'Start workflow whenever the specified contract event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.providers = {};
        this.actions = [
            {
                label: 'Select Contract',
                name: 'contract',
                type: 'asyncOptions',
                loadFromDbCollections: ['Contract'],
                loadMethod: 'getContracts'
            },
            {
                label: 'Event',
                name: 'event',
                type: 'asyncOptions',
                loadMethod: 'getEvents'
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
    }
    async runTrigger(nodeData) {
        const networksData = nodeData.networks;
        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
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
            const address = contractDetails.address;
            let abi = contractDetails.abi;
            abi = JSON.parse(abi);
            const event = actionsData.event || '';
            const emitEventKey = nodeData.emitEventKey;
            const filter = {
                address,
                topics: [ethers_1.utils.id(event)]
            };
            provider.on(filter, async (log) => {
                const txHash = log.transactionHash;
                const iface = new ethers_1.ethers.utils.Interface(abi);
                const logs = await provider.getLogs(filter);
                const events = logs.map((log) => iface.parseLog(log));
                log['logs'] = events;
                log['explorerLink'] = `${ChainNetwork_1.networkExplorers[network]}/tx/${txHash}`;
                this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(log));
            });
            this.providers[emitEventKey] = { provider, filter };
        }
        catch (e) {
            throw (0, utils_1.handleErrorMessage)(e);
        }
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
module.exports = { nodeClass: ContractEventTrigger };
//# sourceMappingURL=ContractEventTrigger.js.map