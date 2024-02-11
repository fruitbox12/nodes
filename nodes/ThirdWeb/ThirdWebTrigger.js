"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const sdk_1 = require("@thirdweb-dev/sdk");
const supportedNetwork_1 = require("./supportedNetwork");
class ThirdWebEventTrigger extends events_1.default {
    constructor() {
        super();
        this.loadMethods = {
            async getEvents(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                const actionsData = nodeData.actions;
                if (actionsData === undefined || networksData === undefined) {
                    return returnData;
                }
                const contractType = actionsData.contractType;
                switch (contractType) {
                    case 'edition':
                        return supportedNetwork_1.editionEvents;
                    case 'edition-drop':
                        return supportedNetwork_1.editionDropEvents;
                    case 'marketplace':
                        return supportedNetwork_1.marketplaceEvents;
                    case 'multiwrap':
                        return supportedNetwork_1.multiWrapEvents;
                    case 'nft-collection':
                        return supportedNetwork_1.nftCollectionEvents;
                    case 'nft-drop':
                        return supportedNetwork_1.nftDropEvents;
                    case 'pack':
                        return supportedNetwork_1.packEvents;
                    case 'signature-drop':
                        return supportedNetwork_1.signatureDropEvents;
                    case 'split':
                        return supportedNetwork_1.splitEvents;
                    case 'token':
                        return supportedNetwork_1.tokenEvents;
                    case 'token-drop':
                        return supportedNetwork_1.tokenDropEvents;
                    case 'vote':
                        return supportedNetwork_1.voteEvents;
                    default:
                        return [];
                }
            }
        };
        this.label = 'ThirdWeb Event Trigger';
        this.name = 'thirdWebEventTrigger';
        this.icon = 'thirdweb.svg';
        this.type = 'trigger';
        this.category = 'Development';
        this.version = 1.0;
        this.description = 'Start workflow whenever a ThirdWeb event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.providers = {};
        this.actions = [
            {
                label: 'Contract Address',
                name: 'contract',
                type: 'string',
                description: 'Navigate to ThirdWeb -> Code -> Getting started -> Javascript, copy the address used in the code section',
                placeholder: '0x6a8c7F715D5f044437dA5b0576eD1289eC9b7eB6'
            },
            {
                label: 'Prebuilt Contract Type',
                name: 'contractType',
                type: 'options',
                description: 'Navigate to ThirdWeb -> Code -> Getting started -> Javascript, select the prebuilt contract used in the code section. Ex: await sdk.getContract("0x...", "nft-drop")',
                options: [...supportedNetwork_1.ThirdWebSupportedPrebuiltContract]
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
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...supportedNetwork_1.ThirdWebSupportedNetworks],
                default: 'mainnet'
            }
        ];
    }
    async runTrigger(nodeData) {
        const networksData = nodeData.networks;
        const actionsData = nodeData.actions;
        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }
        const network = networksData.network;
        const emitEventKey = nodeData.emitEventKey;
        const contractAddress = actionsData.contract;
        const eventName = actionsData.event;
        const contract = await new sdk_1.ThirdwebSDK(network).getContract(contractAddress);
        let eventData = '';
        const provider = contract.events;
        const filter = {
            network,
            eventName,
            contractAddress
        };
        /********** WORKAROUND FOR THIRDWEB REMOVEEVENTLISTENER BUG *********
         ** If this emitEventKey hasn't been called before OR emitEventKey has been called but not this filter
         ** This prevents from adding multiple event listener
         **/
        if (!Object.prototype.hasOwnProperty.call(this.providers, emitEventKey) ||
            !Object.prototype.hasOwnProperty.call(this.providers[emitEventKey].filter, JSON.stringify(filter))) {
            provider.addEventListener(eventName, (event) => {
                if (eventData !== JSON.stringify(event)) {
                    eventData = JSON.stringify(event);
                    if (JSON.stringify(this.providers[emitEventKey].filter.currentFilter) === JSON.stringify(filter)) {
                        this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(event));
                    }
                }
            });
        }
        /** Example of providers
        this.providers = {
            'W03MAR23-LPQ88HJB_thirdWebEventTrigger_0': {
                provider: ContractEvents { contractWrapper: [ContractWrapper] },
                filter: {
                    '{"network":"mumbai","eventName":"TokensMinted","contractAddress":"0x..."}': {
                        network: 'mumbai',
                        eventName: 'TokensMinted',
                        contractAddress: '0x...'
                    },
                    '{"network":"mumbai","eventName":"PlatformFeeInfoUpdated","contractAddress":"0x.."}': {
                        network: 'mumbai',
                        eventName: 'PlatformFeeInfoUpdated',
                        contractAddress: '0x...'
                    },
                    currentFilter: {
                        network: 'mumbai',
                        eventName: 'PlatformFeeInfoUpdated',
                        contractAddress: '0x...'
                    },
                }
            }
        }
        */
        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            const newFilter = Object.assign(Object.assign({}, this.providers[emitEventKey].filter), { [JSON.stringify(filter)]: filter, currentFilter: filter });
            this.providers[emitEventKey] = { provider, filter: newFilter };
        }
        else {
            const newFilter = {
                [JSON.stringify(filter)]: filter,
                currentFilter: filter
            };
            this.providers[emitEventKey] = { provider, filter: newFilter };
        }
    }
    async removeTrigger(nodeData) {
        const emitEventKey = nodeData.emitEventKey;
        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            /** Disabling this because thirdweb removeEventListener bug, it doesnt remove listener
            const provider = this.providers[emitEventKey].provider
            provider.removeEventListener(eventName, (event: any) => {
                console.log(event)
            })
            **/
            this.removeAllListeners(emitEventKey);
        }
    }
}
module.exports = { nodeClass: ThirdWebEventTrigger };
//# sourceMappingURL=ThirdWebTrigger.js.map