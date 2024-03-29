"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
class ContractFunctionTrigger extends events_1.default {
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
            async getViewFunctions(nodeData) {
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
                        if (item.type === 'function' && item.stateMutability === 'view') {
                            const funcName = item.name;
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
        this.label = 'Contract Function Trigger';
        this.name = 'ContractFunctionTrigger';
        this.icon = 'contract-function-trigger.svg';
        this.type = 'trigger';
        this.category = 'Smart Contract';
        this.version = 1.0;
        this.description = 'Triggers whenever the specified view function return value changes';
        this.incoming = 0;
        this.outgoing = 1;
        this.cronJobs = {};
        this.actions = [
            {
                label: 'Select Contract',
                name: 'contract',
                type: 'asyncOptions',
                loadFromDbCollections: ['Contract'],
                loadMethod: 'getContracts'
            },
            {
                label: 'View Function',
                name: 'function',
                type: 'asyncOptions',
                loadMethod: 'getViewFunctions'
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
                label: 'Polling Time',
                name: 'pollTime',
                type: 'options',
                options: [
                    {
                        label: 'Every 15 secs',
                        name: '15s'
                    },
                    {
                        label: 'Every 30 secs',
                        name: '30s'
                    },
                    {
                        label: 'Every 1 min',
                        name: '1min'
                    },
                    {
                        label: 'Every 5 min',
                        name: '5min'
                    },
                    {
                        label: 'Every 10 min',
                        name: '10min'
                    }
                ],
                default: '30s'
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
            const abiString = contractDetails.abi;
            const address = contractDetails.address;
            const abi = JSON.parse(abiString);
            const emitEventKey = nodeData.emitEventKey;
            const functionName = actionsData.function || '';
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
            const contract = new ethers_1.ethers.Contract(address, abi, provider);
            const pollTime = actionsData.pollTime || '30s';
            const cronTimes = [];
            if (pollTime === '15s') {
                cronTimes.push(`*/15 * * * * *`);
            }
            else if (pollTime === '30s') {
                cronTimes.push(`*/30 * * * * *`);
            }
            else if (pollTime === '1min') {
                cronTimes.push(`*/1 * * * *`);
            }
            else if (pollTime === '5min') {
                cronTimes.push(`*/5 * * * *`);
            }
            else if (pollTime === '10min') {
                cronTimes.push(`*/10 * * * *`);
            }
            const lastResult = await contract[functionName].apply(null, contractParameters.length > 1 ? contractParameters : null);
            const executeTrigger = async () => {
                const newResult = await contract[functionName].apply(null, contractParameters.length > 1 ? contractParameters : null);
                if (JSON.stringify(newResult) !== JSON.stringify(lastResult)) {
                    const returnItem = {
                        function: functionName,
                        oldValue: lastResult,
                        newValue: newResult
                    };
                    this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnItem));
                }
            };
            /// Start the cron-jobs
            if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
                for (const cronTime of cronTimes) {
                    // Automatically start the cron job
                    this.cronJobs[emitEventKey].push(new cron_1.CronJob(cronTime, executeTrigger, undefined, true));
                }
            }
            else {
                for (const cronTime of cronTimes) {
                    // Automatically start the cron job
                    this.cronJobs[emitEventKey] = [new cron_1.CronJob(cronTime, executeTrigger, undefined, true)];
                }
            }
        }
        catch (e) {
            throw (0, utils_1.handleErrorMessage)(e);
        }
    }
    async removeTrigger(nodeData) {
        const emitEventKey = nodeData.emitEventKey;
        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            const cronJobs = this.cronJobs[emitEventKey];
            for (const cronJob of cronJobs) {
                cronJob.stop();
            }
            this.removeAllListeners(emitEventKey);
        }
    }
}
module.exports = { nodeClass: ContractFunctionTrigger };
//# sourceMappingURL=ContractFunctionTrigger.js.map