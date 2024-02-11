"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
class RequestFinanceTrigger extends events_1.default {
    constructor() {
        super();
        this.loadMethods = {
            async getInvoices(nodeData) {
                const returnData = [];
                const credentials = nodeData.credentials;
                if (credentials === undefined) {
                    return returnData;
                }
                const apiKey = credentials.apiKey;
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://api.request.finance/invoices?variant=rnf_invoice`,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: apiKey
                        }
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const invoices = response.data;
                    for (let i = 0; i < invoices.length; i += 1) {
                        const invoice = invoices[i];
                        const data = {
                            label: `#${invoice.invoiceNumber} (${(0, moment_1.default)(invoice.creationDate).format('MMMM D, YYYY')})`,
                            name: invoice.id
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
        this.label = 'Request Finance Trigger';
        this.name = 'requestFinanceTrigger';
        this.icon = 'requestFinance.svg';
        this.type = 'trigger';
        this.category = 'Accounting';
        this.version = 1.0;
        this.description = 'Start workflow whenever receive new invoice or invoice status has changed';
        this.incoming = 0;
        this.outgoing = 1;
        this.cronJobs = {};
        this.actions = [
            {
                label: 'Invoice Status',
                name: 'invoiceStatus',
                type: 'options',
                options: [
                    {
                        label: 'New',
                        name: 'new',
                        description: 'Trigger workflow when new invoice received'
                    },
                    {
                        label: 'Accepted',
                        name: 'accepted',
                        description: 'The invoice has been approved by the buyer.'
                    },
                    {
                        label: 'Declared Paid',
                        name: 'declaredPaid',
                        description: 'The buyer declared the invoice as paid. The seller has to confirm before the invoice can move into the paid status. This is necessary for currencies, where the Request Network does not yet support payment detection.'
                    },
                    {
                        label: 'Paid',
                        name: 'paid',
                        description: 'Seller has confirmed and marked the invoice as paid, i.e: the buyer paid the invoice.'
                    },
                    {
                        label: 'Canceled',
                        name: 'canceled',
                        description: 'The seller canceled the invoice.'
                    },
                    {
                        label: 'Rejected',
                        name: 'rejected',
                        description: 'The buyer rejected the invoice.'
                    }
                ],
                default: '',
                description: 'Status of an invoice'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'RequestFinance API Key',
                        name: 'requestFinanceApi'
                    }
                ],
                default: 'requestFinanceApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Select Invoice',
                name: 'invoiceType',
                type: 'options',
                options: [
                    {
                        label: 'Retrieve from existing invoices',
                        name: 'existingInvoice'
                    },
                    {
                        label: 'Custom invoice ID',
                        name: 'customInvoice'
                    }
                ],
                hide: {
                    'actions.invoiceStatus': ['new']
                }
            },
            {
                label: 'Invoice ID',
                name: 'invoiceId',
                type: 'string',
                placeholder: '63e2c662d24445b79ada9c3d',
                hide: {
                    'actions.invoiceStatus': ['new']
                },
                show: {
                    'inputParameters.invoiceType': ['customInvoice']
                }
            },
            {
                label: 'Invoice',
                name: 'invoiceId',
                type: 'asyncOptions',
                loadMethod: 'getInvoices',
                hide: {
                    'actions.invoiceStatus': ['new']
                },
                show: {
                    'inputParameters.invoiceType': ['existingInvoice']
                }
            },
            {
                label: 'Polling Time',
                name: 'pollTime',
                type: 'options',
                description: 'How often should we keep checking the invoice status',
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
        const inputParametersData = nodeData.inputParameters;
        const actionData = nodeData.actions;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials!');
        }
        // Get API key
        const apiKey = credentials.apiKey;
        // Get Invoice
        const invoiceId = inputParametersData.invoiceId;
        const invoiceStatus = actionData.invoiceStatus;
        let url = '';
        const method = 'GET';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: apiKey
        };
        const emitEventKey = nodeData.emitEventKey;
        const pollTime = (inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.pollTime) || '30s';
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
        async function getInvoiceStatusAPI() {
            url = `https://api.request.finance/invoices/${invoiceId}`;
            const axiosConfig = {
                method,
                url,
                headers
            };
            return await (0, axios_1.default)(axiosConfig);
        }
        async function getReceivedInvoices() {
            url = `https://api.request.finance/invoices?filterBy=received&variant=rnf_invoice&status=open`;
            const axiosConfig = {
                method,
                url,
                headers
            };
            return await (0, axios_1.default)(axiosConfig);
        }
        let lastInvoicesAmount = 0;
        try {
            // Get initial data
            if (invoiceStatus === 'new') {
                const response = await getReceivedInvoices();
                const invoices = response.data || [];
                lastInvoicesAmount = invoices.length;
            }
            // Trigger when cron job hits
            const executeTrigger = async () => {
                if (invoiceStatus === 'new') {
                    const newResponse = await getReceivedInvoices();
                    const newResponseData = newResponse.data || [];
                    const newInvoicesAmount = newResponseData.length;
                    if (newInvoicesAmount > lastInvoicesAmount) {
                        const differenceAmount = newInvoicesAmount - lastInvoicesAmount;
                        const returnData = [];
                        for (let i = 0; i < differenceAmount; i += 1) {
                            returnData.push(newResponseData[i]);
                        }
                        lastInvoicesAmount = newInvoicesAmount;
                        this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnData));
                    }
                }
                else {
                    const newResponse = await getInvoiceStatusAPI();
                    const newResponseData = newResponse.data;
                    if (newResponseData.status === invoiceStatus) {
                        this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(newResponseData));
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
module.exports = { nodeClass: RequestFinanceTrigger };
//# sourceMappingURL=RequestFinanceTrigger.js.map