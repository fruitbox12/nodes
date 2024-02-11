"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const ethers_1 = require("ethers");
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const axios_1 = __importDefault(require("axios"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
const utils_2 = require("ethers/lib/utils");
class FlowBalanceTrigger extends events_1.default {
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
        this.label = 'Flow Balance Trigger';
        this.name = 'FlowBalanceTrigger';
        this.icon = 'flow.png';
        this.type = 'trigger';
        this.category = 'Cryptocurrency';
        this.version = 1.0;
        this.description = 'Start workflow whenever FLOW balance in wallet changes';
        this.incoming = 0;
        this.outgoing = 1;
        this.cronJobs = {};
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ChainNetwork_1.FLOWNetworks],
                default: 'homestead'
            }
        ];
        this.inputParameters = [
            {
                label: 'Wallet Address',
                name: 'address',
                type: 'string',
                default: ''
            },
            {
                label: 'Trigger Condition',
                name: 'triggerCondition',
                type: 'options',
                options: [
                    {
                        label: 'When balance increased',
                        name: 'increase'
                    },
                    {
                        label: 'When balance decreased',
                        name: 'decrease'
                    }
                ],
                default: 'increase'
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
    }
    async runTrigger(nodeData) {
        const networksData = nodeData.networks;
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const network = networksData.network;
        const baseUrl = network === ChainNetwork_1.NETWORK.FLOW_TESTNET
            ? `https://rest-testnet.onflow.org/v1/accounts/`
            : `https://rest-mainnet.onflow.org/v1/accounts/`;
        const emitEventKey = nodeData.emitEventKey;
        const address = inputParametersData.address || '';
        const pollTime = inputParametersData.pollTime || '30s';
        const triggerCondition = inputParametersData.triggerCondition || 'increase';
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
        const responseFlow = await axios_1.default.get(`${baseUrl}${address}`);
        let lastBalance = ethers_1.BigNumber.from(responseFlow.data.balance);
        const executeTrigger = async () => {
            const responseFlow = await axios_1.default.get(`${baseUrl}${address}`);
            const newBalance = ethers_1.BigNumber.from(responseFlow.data.balance);
            if (!newBalance.eq(lastBalance)) {
                if (triggerCondition === 'increase' && newBalance.gt(lastBalance)) {
                    const balanceInFlow = this.formatFlow(ethers_1.BigNumber.from(newBalance.toString()));
                    const diffInFlow = newBalance.sub(lastBalance);
                    const returnItem = {
                        newBalance: `${balanceInFlow} FLOW`,
                        lastBalance: `${this.formatFlow(ethers_1.BigNumber.from(lastBalance.toString()))} FLOW`,
                        difference: `${this.formatFlow(ethers_1.BigNumber.from(diffInFlow.toString()))} FLOW`,
                        explorerLink: `${ChainNetwork_1.networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'FLOW balance increase'
                    };
                    lastBalance = newBalance;
                    this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnItem));
                }
                else if (triggerCondition === 'decrease' && newBalance.lt(lastBalance)) {
                    const balanceInFlow = this.formatFlow(ethers_1.BigNumber.from(newBalance.toString()));
                    const diffInFlow = lastBalance.sub(newBalance);
                    const returnItem = {
                        newBalance: `${balanceInFlow} FLOW`,
                        lastBalance: `${this.formatFlow(ethers_1.BigNumber.from(lastBalance.toString()))} FLOW`,
                        difference: `${this.formatFlow(ethers_1.BigNumber.from(diffInFlow.toString()))} FLOW`,
                        explorerLink: `${ChainNetwork_1.networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'FLOW balance decrease'
                    };
                    lastBalance = newBalance;
                    this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnItem));
                }
                else {
                    lastBalance = newBalance;
                }
            }
        };
        // Start the cron-jobs
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
    formatFlow(balance) {
        return (0, utils_2.formatUnits)(balance, 8);
    }
    parseFlow(flow) {
        return (0, utils_2.parseUnits)(flow, 8);
    }
}
module.exports = { nodeClass: FlowBalanceTrigger };
//# sourceMappingURL=FlowBalanceTrigger.js.map