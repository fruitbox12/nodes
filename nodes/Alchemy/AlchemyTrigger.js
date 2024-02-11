"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
const subscribeOperation_1 = require("./subscribeOperation");
const ws_1 = __importDefault(require("ws"));
class AlchemyTrigger extends events_1.default {
    constructor() {
        super();
        this.loadMethods = {
            async getSubscribeOperations(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined) {
                    return returnData;
                }
                const network = networksData.network;
                const totalOperations = subscribeOperation_1.subscribeOperations;
                const filteredOperations = totalOperations.filter((op) => Object.prototype.hasOwnProperty.call(op.providerNetworks, 'alchemy') && op.providerNetworks['alchemy'].includes(network));
                for (const op of filteredOperations) {
                    returnData.push({
                        label: op.name,
                        name: op.value,
                        parentGroup: op.parentGroup,
                        description: op.description,
                        inputParameters: op.inputParameters,
                        exampleParameters: op.exampleParameters,
                        exampleResponse: op.exampleResponse
                    });
                }
                return returnData;
            },
            async getUnsubscribeOperations(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined) {
                    return returnData;
                }
                const network = networksData.network;
                const totalOperations = subscribeOperation_1.unsubscribeOperations;
                const filteredOperations = totalOperations.filter((op) => Object.prototype.hasOwnProperty.call(op.providerNetworks, 'alchemy') && op.providerNetworks['alchemy'].includes(network));
                for (const op of filteredOperations) {
                    returnData.push({
                        label: op.name,
                        name: op.value,
                        parentGroup: op.parentGroup,
                        description: op.description,
                        inputParameters: op.inputParameters,
                        exampleParameters: op.exampleParameters,
                        exampleResponse: op.exampleResponse
                    });
                }
                return returnData;
            }
        };
        this.label = 'Alchemy Trigger';
        this.name = 'alchemyTrigger';
        this.icon = 'alchemy.svg';
        this.type = 'trigger';
        this.category = 'Network Provider';
        this.version = 1.0;
        this.description = 'Start workflow whenever subscribed event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.providers = {};
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ChainNetwork_1.ETHNetworks, ...ChainNetwork_1.PolygonNetworks, ...ChainNetwork_1.ArbitrumNetworks, ...ChainNetwork_1.OptimismNetworks, ...ChainNetwork_1.SolanaNetworks]
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Alchemy API Key',
                        name: 'alchemyApi'
                    }
                ],
                default: 'alchemyApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Subscribe Operation',
                name: 'subscribeOperation',
                type: 'asyncOptions',
                loadMethod: 'getSubscribeOperations'
            },
            {
                label: 'Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: `[
  "param1",
  "param2"
]`,
                optional: true,
                description: 'Operation parameters in array. Ex: ["param1", "param2"]'
            },
            {
                label: 'Unsubscribe Operation',
                name: 'unsubscribeOperation',
                type: 'asyncOptions',
                loadMethod: 'getUnsubscribeOperations'
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
        if (credentials === undefined) {
            throw new Error('Missing credentials');
        }
        // GET network
        const network = networksData.network;
        // GET credentials
        const apiKey = credentials.apiKey;
        const wssProvider = `${ChainNetwork_1.alchemyWSSAPIs[network]}${apiKey}`;
        // GET subscribeOperation
        const subscribeOperation = inputParametersData.subscribeOperation;
        // GET parameters
        let bodyParameters;
        const parameters = inputParametersData.parameters;
        if (parameters) {
            try {
                bodyParameters = JSON.parse(parameters.replace(/\s/g, ''));
            }
            catch (error) {
                throw (0, utils_1.handleErrorMessage)(error);
            }
        }
        const emitEventKey = nodeData.emitEventKey;
        const result = subscribeOperation_1.subscribeOperations.find((obj) => {
            return obj.value === subscribeOperation;
        });
        if (result === undefined)
            throw new Error('Invalid Operation');
        const requestBody = result.body;
        requestBody.params = bodyParameters;
        const ws = new ws_1.default(wssProvider);
        ws.on('open', function open() {
            ws.send(JSON.stringify(requestBody));
        });
        let subscriptionID = '';
        ws.on('message', (data) => {
            const messageData = JSON.parse(data);
            if (messageData.method) {
                this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(messageData));
            }
            else {
                subscriptionID = messageData.result;
                this.providers[emitEventKey] = { provider: ws, filter: subscriptionID };
            }
        });
    }
    async removeTrigger(nodeData) {
        const emitEventKey = nodeData.emitEventKey;
        const inputParametersData = nodeData.inputParameters;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            const provider = this.providers[emitEventKey].provider;
            const subscriptionID = this.providers[emitEventKey].filter;
            const result = subscribeOperation_1.unsubscribeOperations.find((obj) => {
                return obj.value === inputParametersData.unsubscribeOperation;
            });
            if (result === undefined)
                throw new Error('Invalid Operation');
            const requestBody = result.body;
            requestBody.params = [subscriptionID];
            provider.send(JSON.stringify(requestBody));
            provider.close(1000);
            this.removeAllListeners(emitEventKey);
        }
    }
}
module.exports = { nodeClass: AlchemyTrigger };
//# sourceMappingURL=AlchemyTrigger.js.map