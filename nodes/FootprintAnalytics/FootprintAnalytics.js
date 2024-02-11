"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
class FootprintAnalytics {
    constructor() {
        this.loadMethods = {
            async getOperations(nodeData) {
                const returnData = [];
                const actionsData = nodeData.actions;
                if (actionsData === undefined) {
                    return returnData;
                }
                const category = actionsData.category;
                let operations = [];
                switch (category) {
                    case 'nft':
                        operations = constants_1.NFT_OPERATIONS;
                        break;
                    case 'token':
                        operations = constants_1.TOKEN_OPERATIONS;
                        break;
                    case 'gamefi':
                        operations = constants_1.GAMEFI_OPERATIONS;
                        break;
                    case 'chain':
                        operations = constants_1.CHAIN_OPERATIONS;
                        break;
                }
                for (const op of operations) {
                    returnData.push({
                        label: op.label,
                        name: op.name,
                        description: op.description
                    });
                }
                return returnData;
            }
        };
        // properties
        this.label = 'Footprint Analytics';
        this.name = 'footprintAnalytics';
        this.icon = 'footprint-analytics.png';
        this.type = 'action';
        this.category = 'Block Explorer';
        this.version = 1.0;
        this.description = 'Execute Footprint Analytics APIs and SQL query';
        this.incoming = 1;
        this.outgoing = 1;
        // parameter
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Rest API (V2)',
                        name: 'restAPI'
                    },
                    {
                        label: 'SQL API (Synchronous)',
                        name: 'sqlAPISynchronous',
                        description: 'Suitable for simple table lookup query'
                    },
                    {
                        label: 'SQL API (Asynchronous)',
                        name: 'sqlAPIAsynchronous',
                        description: 'For complex analysis table lookup query'
                    }
                ]
            },
            {
                label: 'Category',
                name: 'category',
                type: 'options',
                options: [
                    {
                        label: 'NFT',
                        name: 'nft'
                    },
                    {
                        label: 'Token',
                        name: 'token'
                    },
                    {
                        label: 'GameFi',
                        name: 'gamefi'
                    },
                    {
                        label: 'Chain',
                        name: 'chain'
                    }
                ],
                show: {
                    'actions.api': ['restAPI']
                }
            },
            {
                label: 'Operation',
                name: 'operation',
                type: 'asyncOptions',
                loadMethod: 'getOperations',
                show: {
                    'actions.api': ['restAPI']
                }
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Footprint Analytics API Key',
                        name: 'footprintAnalyticsApi'
                    }
                ],
                default: 'footprintAnalyticsApi'
            }
        ];
        this.inputParameters = [
            ...constants_1.chainInputParameters,
            ...constants_1.nftParams,
            ...constants_1.nftWashTradeCheckerParams,
            ...constants_1.nftBalanceParams,
            ...constants_1.tokenParams,
            ...constants_1.tokenBalanceParams,
            ...constants_1.gamefiParams,
            ...constants_1.timeRangeParams,
            ...constants_1.limitOffetParams,
            {
                label: 'SQL query',
                name: 'sqlQuery',
                type: 'string',
                rows: 5,
                placeholder: `select * from ethereum_token_transfers where block_timestamp >= date_add('day',-1,current_date) limit 10`,
                description: 'SQL query to execute. Must be Scale or Enterprise plan',
                show: {
                    'actions.api': ['sqlAPISynchronous', 'sqlAPIAsynchronous']
                }
            }
        ];
    }
    getFormattedDate(date, operation) {
        const hours = date.toISOString().split('T')[1].split(':')[0];
        const minutes = date.toISOString().split('T')[1].split(':')[1];
        const seconds = date.toISOString().split('T')[1].split(':')[2];
        return operation === 'nftCollectionStatistics'
            ? date.getTime()
            : `${date.toISOString().split('T')[0]} ${hours}:${minutes}:${seconds}`;
    }
    async run(nodeData) {
        var _a;
        const { actions, inputParameters, credentials } = nodeData;
        if (actions === undefined || inputParameters === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const api = actions.api;
        const apiKey = credentials.apiKey;
        const operation = actions.operation;
        const chain = inputParameters.chain;
        const collection_contract_address = inputParameters.collection_contract_address;
        const type = inputParameters.type;
        const status = inputParameters.status;
        const statistics_metrics = inputParameters.statistics_metrics;
        const statistics_time_model = inputParameters.statistics_time_model;
        const wallet_address = inputParameters.wallet_address;
        const nft_type = inputParameters.nft_type;
        const nft_token_id = inputParameters.nft_token_id;
        const token_address = inputParameters.token_address;
        const from_address = inputParameters.from_address;
        const to_address = inputParameters.to_address;
        const protocol_slug = inputParameters.protocol_slug;
        const address_type = inputParameters.address_type;
        const statistics_frequency_model = inputParameters.statistics_frequency_model;
        const contract_address = inputParameters.contract_address;
        const startTime = inputParameters.start_time;
        const endTime = inputParameters.end_time;
        const offset = inputParameters.offset;
        const limit = inputParameters.limit;
        const start_time = startTime ? this.getFormattedDate(new Date(startTime), operation) : undefined;
        const end_time = endTime ? this.getFormattedDate(new Date(endTime), operation) : undefined;
        const sqlQuery = inputParameters.sqlQuery;
        const queryParameters = {
            chain,
            collection_contract_address,
            type,
            status,
            statistics_metrics,
            statistics_time_model,
            nft_type,
            protocol_slug,
            address_type
        };
        if (nft_token_id)
            queryParameters.nft_token_id = nft_token_id;
        if (start_time)
            queryParameters.start_time = start_time;
        if (end_time)
            queryParameters.end_time = end_time;
        if (wallet_address)
            queryParameters.wallet_address = wallet_address;
        if (token_address)
            queryParameters.token_address = token_address;
        if (from_address)
            queryParameters.from_address = from_address;
        if (to_address)
            queryParameters.to_address = to_address;
        if (statistics_frequency_model)
            queryParameters.statistics_frequency_model = statistics_frequency_model;
        if (contract_address)
            queryParameters.contract_address = contract_address;
        if (offset)
            queryParameters.offset = offset;
        if (limit)
            queryParameters.limit = limit;
        const returnData = [];
        let responseData;
        if (api === 'sqlAPISynchronous') {
            try {
                const axiosConfig = {
                    method: 'POST',
                    url: 'https://api.footprint.network/api/v1/native',
                    data: JSON.stringify({
                        query: sqlQuery
                    }),
                    headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
                console.error(error);
                throw (0, utils_1.handleErrorMessage)(error);
            }
        }
        else if (api === 'sqlAPIAsynchronous') {
            try {
                const axiosConfig = {
                    method: 'POST',
                    url: 'https://api.footprint.network/api/v1/native/async',
                    data: JSON.stringify({
                        query: sqlQuery
                    }),
                    headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
                const promise = (execution_id) => {
                    let data = {};
                    return new Promise((resolve, reject) => {
                        const timeout = setInterval(async () => {
                            const axiosConfig = {
                                method: 'GET',
                                url: `https://api.footprint.network/api/v1/native/${execution_id}/results`,
                                headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                            };
                            const response = await (0, axios_1.default)(axiosConfig);
                            data = response.data;
                            const state = response.data.data.state;
                            if (state === 'SUCCESS') {
                                clearInterval(timeout);
                                resolve(data);
                            }
                            else if (state === 'FAIL' || state === 'EXPIRED') {
                                clearInterval(timeout);
                                reject(new Error(`Error querying async SQL request: ${state}`));
                            }
                        }, 1500);
                    });
                };
                responseData = await promise(responseData.data.execution_id || '');
            }
            catch (error) {
                console.error(error);
                throw (0, utils_1.handleErrorMessage)(error);
            }
        }
        else if (api === 'restAPI') {
            try {
                const axiosConfig = {
                    method: 'GET',
                    url: (_a = constants_1.ALL_OPERATIONS.find((op) => op.name === operation)) === null || _a === void 0 ? void 0 : _a.endpoint,
                    params: queryParameters,
                    paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                    headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
                console.error(error);
                throw (0, utils_1.handleErrorMessage)(error);
            }
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
module.exports = { nodeClass: FootprintAnalytics };
//# sourceMappingURL=FootprintAnalytics.js.map