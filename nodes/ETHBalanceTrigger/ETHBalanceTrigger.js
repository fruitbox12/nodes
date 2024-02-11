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
class ETHBalanceTrigger extends events_1.default {
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
        this.label = 'ETH Balance Trigger';
        this.name = 'ETHBalanceTrigger';
        this.icon = 'ethereum.svg';
        this.type = 'trigger';
        this.category = 'Cryptocurrency';
        this.version = 1.0;
        this.description = 'Start workflow whenever ETH balance in wallet changes';
        this.incoming = 0;
        this.outgoing = 1;
        this.cronJobs = {};
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ChainNetwork_1.ETHNetworks, ...ChainNetwork_1.ArbitrumNetworks, ...ChainNetwork_1.OptimismNetworks],
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
        let lastBalance = await provider.getBalance(address);
        const executeTrigger = async () => {
            const newBalance = await provider.getBalance(address);
            if (!newBalance.eq(lastBalance)) {
                if (triggerCondition === 'increase' && newBalance.gt(lastBalance)) {
                    const balanceInEth = ethers_1.utils.formatEther(ethers_1.BigNumber.from(newBalance.toString()));
                    const diffInEth = newBalance.sub(lastBalance);
                    const returnItem = {
                        newBalance: `${balanceInEth} ETH`,
                        lastBalance: `${ethers_1.utils.formatEther(ethers_1.BigNumber.from(lastBalance.toString()))} ETH`,
                        difference: `${ethers_1.utils.formatEther(ethers_1.BigNumber.from(diffInEth.toString()))} ETH`,
                        explorerLink: `${ChainNetwork_1.networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'ETH balance increase'
                    };
                    lastBalance = newBalance;
                    this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnItem));
                }
                else if (triggerCondition === 'decrease' && newBalance.lt(lastBalance)) {
                    const balanceInEth = ethers_1.utils.formatEther(ethers_1.BigNumber.from(newBalance.toString()));
                    const diffInEth = lastBalance.sub(newBalance);
                    const returnItem = {
                        newBalance: `${balanceInEth} ETH`,
                        lastBalance: `${ethers_1.utils.formatEther(ethers_1.BigNumber.from(lastBalance.toString()))} ETH`,
                        difference: `${ethers_1.utils.formatEther(ethers_1.BigNumber.from(diffInEth.toString()))} ETH`,
                        explorerLink: `${ChainNetwork_1.networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'ETH balance decrease'
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
}
module.exports = { nodeClass: ETHBalanceTrigger };
//# sourceMappingURL=ETHBalanceTrigger.js.map