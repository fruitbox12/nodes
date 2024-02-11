"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("./constants");
class RequestFinance {
    constructor() {
        this.loadMethods = {
            async getInvoiceCurrency() {
                const returnData = [];
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://api.request.finance/currency/list/invoicing`
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const tokens = response.data;
                    const tokenSet = new Set();
                    for (let i = 0; i < tokens.length; i += 1) {
                        const token = tokens[i];
                        if (!token.symbol.includes('-'))
                            tokenSet.add(`${token.symbol} | ${token.decimals}`);
                    }
                    tokenSet.forEach((tkn) => {
                        const data = {
                            label: tkn.split('|')[0].trim(),
                            name: tkn
                        };
                        returnData.push(data);
                    });
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
            async getPaymentCurrency() {
                const returnData = [];
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://api.request.finance/currency/list/invoicing`
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const tokens = response.data;
                    const tokenSet = new Set();
                    for (let i = 0; i < tokens.length; i += 1) {
                        const token = tokens[i];
                        if (token.id.includes('-'))
                            tokenSet.add(`${token.id} | ${token.decimals}`);
                    }
                    tokenSet.forEach((tkn) => {
                        const data = {
                            label: tkn.split('|')[0].trim(),
                            name: tkn
                        };
                        returnData.push(data);
                    });
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
            async getCountry() {
                const returnData = [];
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://restcountries.com/v2/all`
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const countries = response.data;
                    for (let i = 0; i < countries.length; i += 1) {
                        const country = countries[i];
                        const data = {
                            label: country.name,
                            name: country.alpha2Code
                        };
                        returnData.push(data);
                    }
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
            async getClients(nodeData) {
                const returnData = [];
                const credentials = nodeData.credentials;
                if (credentials === undefined) {
                    return returnData;
                }
                const apiKey = credentials.apiKey;
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://api.request.finance/clients?type=customer`,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: apiKey
                        }
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const clients = response.data;
                    for (let i = 0; i < clients.length; i += 1) {
                        const client = clients[i];
                        const data = {
                            label: client.email,
                            name: JSON.stringify(client)
                        };
                        returnData.push(data);
                    }
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
            async getEmployees(nodeData) {
                const returnData = [];
                const credentials = nodeData.credentials;
                if (credentials === undefined) {
                    return returnData;
                }
                const apiKey = credentials.apiKey;
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://api.request.finance/clients?type=employee`,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: apiKey
                        }
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const employees = response.data;
                    for (let i = 0; i < employees.length; i += 1) {
                        const employee = employees[i];
                        const data = {
                            label: employee.email,
                            name: JSON.stringify(employee)
                        };
                        returnData.push(data);
                    }
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
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
                        url: `https://api.request.finance/invoices?filterBy=sent&variant=rnf_invoice`,
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
                            label: `${invoice.invoiceNumber} (${(0, moment_1.default)(invoice.creationDate).format('MMMM D, YYYY')})`,
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
        this.label = 'Request Finance';
        this.name = 'requestFinance';
        this.icon = 'requestFinance.svg';
        this.type = 'action';
        this.category = 'Accounting';
        this.version = 1.0;
        this.description = 'Issue invoices and accept payments in cryptocurrency using RequestFinance API';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get Invoice',
                        name: 'getSingleInvoice',
                        description: 'Returns single invoice from RequestFinance account.'
                    },
                    {
                        label: 'Create Invoice',
                        name: 'createInvoice',
                        description: 'Creates a new payable invoice.'
                    },
                    {
                        label: 'Create Salary Payment',
                        name: 'createSalaryPayment',
                        description: 'Creates a new payable salary payment.'
                    }
                ]
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
                label: 'Invoice',
                name: 'invoiceId',
                type: 'asyncOptions',
                loadMethod: 'getInvoices',
                show: {
                    'actions.operation': ['getSingleInvoice']
                }
            },
            ...constants_1.salaryParameters,
            ...constants_1.invoiceParameters
        ];
    }
    async run(nodeData) {
        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (actionsData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing!');
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials!');
        }
        // Get Operation
        const operation = actionsData.operation;
        // Get API key
        const apiKey = credentials.apiKey;
        // Get Input Params
        const invoiceItems = inputParametersData.invoiceItems;
        const invoiceCurrencyValue = inputParametersData.invoiceCurrency;
        const invoiceCurrency = invoiceCurrencyValue ? invoiceCurrencyValue.split('|')[0].trim() : '';
        const invoiceCurrencyDecimals = invoiceCurrencyValue ? invoiceCurrencyValue.split('|')[1].trim() : '';
        const paymentAddress = inputParametersData.paymentAddress;
        const paymentCurrencyValue = inputParametersData.paymentCurrency;
        const paymentCurrency = paymentCurrencyValue ? paymentCurrencyValue.split('|')[0].trim() : '';
        const paymentDueDate = inputParametersData.paymentDueDate;
        const clientType = inputParametersData.clientType;
        const existingClient = inputParametersData.existingClient;
        const buyerInfoEmail = inputParametersData.buyerInfoEmail;
        const buyerInfoBusinessName = inputParametersData.buyerInfoBusinessName;
        const buyerInfoFirstName = inputParametersData.buyerInfoFirstName;
        const buyerInfoLastName = inputParametersData.buyerInfoLastName;
        const buyerInfoStreetAddress = inputParametersData.buyerInfoStreetAddress;
        const buyerInfoExtendedAddress = inputParametersData.buyerInfoExtendedAddress;
        const buyerInfoPostalCode = inputParametersData.buyerInfoPostalCode;
        const buyerInfoRegion = inputParametersData.buyerInfoRegion;
        const buyerInfoCountry = inputParametersData.buyerInfoCountry;
        const buyerInfoTaxRegistration = inputParametersData.buyerInfoTaxRegistration;
        const invoiceId = inputParametersData.invoiceId;
        const salaryCurrencyValue = inputParametersData.salaryCurrency;
        const salaryCurrency = salaryCurrencyValue ? salaryCurrencyValue.split('|')[0].trim() : '';
        const salaryCurrencyDecimals = salaryCurrencyValue ? salaryCurrencyValue.split('|')[1].trim() : '';
        const salaryAmount = inputParametersData.salaryAmount;
        const salaryPaymentCurrencyValue = inputParametersData.salaryPaymentCurrency;
        const salaryPaymentCurrency = salaryPaymentCurrencyValue ? salaryPaymentCurrencyValue.split('|')[0].trim() : '';
        const employeeType = inputParametersData.employeeType;
        const existingEmployee = inputParametersData.existingEmployee;
        const employeeEmail = inputParametersData.employeeEmail;
        const employeePaymentAddress = inputParametersData.employeePaymentAddress;
        const employeeFirstName = inputParametersData.employeeFirstName;
        const employeeLastName = inputParametersData.employeeLastName;
        const companyEmail = inputParametersData.companyEmail;
        const companyBusinessName = inputParametersData.companyBusinessName;
        const companyFirstName = inputParametersData.companyFirstName;
        const companyLastName = inputParametersData.companyLastName;
        const companyStreetAddress = inputParametersData.companyStreetAddress;
        const companyExtendedAddress = inputParametersData.companyExtendedAddress;
        const companyPostalCode = inputParametersData.companyPostalCode;
        const companyRegion = inputParametersData.companyRegion;
        const companyCountry = inputParametersData.companyCountry;
        const returnData = [];
        let responseData;
        let url = '';
        let method = 'GET';
        let body = {};
        if (operation === 'createInvoice') {
            url = 'https://api.request.finance/invoices';
            method = 'POST';
            const invoicesSent = await getNumberOfInvoiceSent(apiKey);
            body.invoiceNumber = (invoicesSent + 1).toString();
            //invoiceItems
            const invoiceItemsArray = [];
            for (let j = 0; j < invoiceItems.length; j += 1) {
                const invoiceItem = {
                    currency: invoiceCurrency,
                    name: invoiceItems[j].name,
                    quantity: Number(invoiceItems[j].quantity),
                    unitPrice: formatUnitPrice(invoiceItems[j].unitPrice, Number(invoiceCurrencyDecimals))
                };
                if (invoiceItems[j].taxType && invoiceItems[j].taxAmount) {
                    invoiceItem.tax = {
                        type: invoiceItems[j].taxType,
                        amount: invoiceItems[j].taxAmount
                    };
                }
                invoiceItemsArray.push(invoiceItem);
            }
            body.invoiceItems = invoiceItemsArray;
            //payment
            if (paymentDueDate) {
                const dueDate = { dueDate: paymentDueDate };
                body.paymentTerms = dueDate;
            }
            body.paymentAddress = paymentAddress;
            body.paymentCurrency = paymentCurrency;
            //buyer
            const buyerInfo = {};
            if (clientType === 'existing') {
                const client = JSON.parse(existingClient);
                buyerInfo.email = client.email;
                if (client.firstName)
                    buyerInfo.firstName = client.firstName;
                if (client.lastName)
                    buyerInfo.lastName = client.lastName;
                if (client.businessName)
                    buyerInfo.businessName = client.businessName;
                if (client.taxRegistration)
                    buyerInfo.taxRegistration = client.taxRegistration;
                const buyerAddress = {
                    streetAddress: client.address.streetAddress,
                    extendedAddress: client.address.extendedAddress,
                    postalCode: client.address.postalCode,
                    region: client.address.region,
                    city: client.address.city,
                    country: client.address.country
                };
                buyerInfo.address = buyerAddress;
            }
            else {
                buyerInfo.email = buyerInfoEmail;
                if (buyerInfoFirstName)
                    buyerInfo.firstName = buyerInfoFirstName;
                if (buyerInfoLastName)
                    buyerInfo.lastName = buyerInfoLastName;
                if (buyerInfoBusinessName)
                    buyerInfo.businessName = buyerInfoBusinessName;
                if (buyerInfoTaxRegistration)
                    buyerInfo.taxRegistration = buyerInfoTaxRegistration;
                const buyerAddress = {
                    streetAddress: buyerInfoStreetAddress || '',
                    extendedAddress: buyerInfoExtendedAddress || '',
                    postalCode: buyerInfoPostalCode || '',
                    region: buyerInfoRegion || '',
                    city: buyerInfoRegion || '',
                    country: buyerInfoCountry || ''
                };
                buyerInfo.address = buyerAddress;
            }
            body.buyerInfo = buyerInfo;
        }
        if (operation === 'getSingleInvoice') {
            url = `https://api.request.finance/invoices/${invoiceId}`;
            method = 'GET';
        }
        if (operation === 'createSalaryPayment') {
            url = 'https://api.request.finance/invoices';
            method = 'POST';
            body.meta = {
                format: 'rnf_salary',
                version: '0.0.3'
            };
            const salarySent = await getNumberOfSalarySent(apiKey);
            body.invoiceNumber = (salarySent + 1).toString();
            //invoiceItems
            const invoiceItem = {
                currency: salaryCurrency,
                name: 'Salary',
                quantity: 1,
                unitPrice: formatUnitPrice(salaryAmount, Number(salaryCurrencyDecimals))
            };
            body.invoiceItems = [invoiceItem];
            //payment
            const dueDate = { dueDate: (0, moment_1.default)().endOf('day').toString() };
            body.paymentTerms = dueDate;
            body.paymentCurrency = salaryPaymentCurrency;
            //seller
            const sellerInfo = {};
            if (employeeType === 'existing') {
                const employee = JSON.parse(existingEmployee);
                sellerInfo.email = employee.email;
                body.paymentAddress = employee.salaryPaymentAddress;
                if (employee.firstName)
                    sellerInfo.firstName = employee.firstName;
                if (employee.lastName)
                    sellerInfo.lastName = employee.lastName;
            }
            else {
                sellerInfo.email = employeeEmail;
                body.paymentAddress = employeePaymentAddress;
                if (employeeFirstName)
                    sellerInfo.firstName = employeeFirstName;
                if (employeeLastName)
                    sellerInfo.lastName = employeeLastName;
            }
            body.sellerInfo = sellerInfo;
            //buyer
            const buyerInfo = {};
            buyerInfo.email = companyEmail;
            if (companyFirstName)
                buyerInfo.firstName = companyFirstName;
            if (companyLastName)
                buyerInfo.lastName = companyLastName;
            if (companyBusinessName)
                buyerInfo.businessName = companyBusinessName;
            const buyerAddress = {
                streetAddress: companyStreetAddress || '',
                extendedAddress: companyExtendedAddress || '',
                postalCode: companyPostalCode || '',
                region: companyRegion || '',
                city: companyRegion || '',
                country: companyCountry || ''
            };
            buyerInfo.address = buyerAddress;
            body.buyerInfo = buyerInfo;
        }
        try {
            const axiosConfig = {
                method,
                url,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: apiKey
                }
            };
            if (Object.keys(body).length)
                axiosConfig.data = body;
            const response = await (0, axios_1.default)(axiosConfig);
            responseData = response.data;
            // Convert to on-chain request
            if (operation === 'createInvoice' || operation === 'createSalaryPayment') {
                const invoiceId = responseData.id;
                const axiosConfig2 = {
                    method,
                    url: `https://api.request.finance/invoices/${invoiceId}`,
                    data: body,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: apiKey
                    }
                };
                await (0, axios_1.default)(axiosConfig2);
            }
        }
        catch (error) {
            console.error(error.response.data.errors);
            throw (0, utils_1.handleErrorMessage)(error);
        }
        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        }
        else {
            returnData.push(responseData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
const getNumberOfInvoiceSent = async (apiKey) => {
    const axiosConfig = {
        method: 'GET',
        url: 'https://api.request.finance/invoices?filterBy=sent&variant=rnf_invoice',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: apiKey
        }
    };
    const response = await (0, axios_1.default)(axiosConfig);
    return response.data.length || 0;
};
const getNumberOfSalarySent = async (apiKey) => {
    const axiosConfig = {
        method: 'GET',
        url: 'https://api.request.finance/invoices?variant=rnf_salary',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: apiKey
        }
    };
    const response = await (0, axios_1.default)(axiosConfig);
    return response.data.length || 0;
};
const addTrailingZeros = (num, totalLength) => {
    return Number(String(num).padEnd(totalLength + 1, '0'));
};
const formatUnitPrice = (x, decimals) => {
    return (Number(x) * addTrailingZeros(1, decimals)).toFixed(0);
};
module.exports = { nodeClass: RequestFinance };
//# sourceMappingURL=RequestFinance.js.map