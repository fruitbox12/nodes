"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
class BinancePublic {
    constructor() {
        this.loadMethods = {
            async getSupportedSymbols(nodeData) {
                const returnData = [];
                const actionData = nodeData.actions;
                let apiUrl = '';
                if (actionData !== undefined && actionData.network === 'test') {
                    apiUrl = 'https://testnet.binance.vision/api';
                }
                else {
                    apiUrl = 'https://api.binance.com/api';
                }
                const axiosConfig = {
                    method: 'GET',
                    url: `${apiUrl}/v3/exchangeInfo`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                const responseData = response.data;
                for (const s of responseData['symbols']) {
                    returnData.push({
                        label: s.symbol,
                        name: s.symbol
                    });
                }
                return returnData;
            }
        };
        this.label = 'Binance Public';
        this.name = 'binancePublic';
        this.type = 'action';
        this.icon = 'binance-logo.svg';
        this.category = 'Centralized Exchange';
        this.description = 'Binance Public API';
        this.version = 1.0;
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                description: 'Network to execute API: Test or Real',
                options: [
                    {
                        label: 'TEST',
                        name: 'test',
                        description: 'Test network: https://testnet.binance.vision/'
                    },
                    {
                        label: 'LIVE',
                        name: 'live',
                        description: 'Live network: https://api.binance.com/'
                    }
                ],
                default: 'test'
            },
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get Order Book',
                        name: 'getOrderBook',
                        description: 'Get order book.'
                    },
                    {
                        label: 'Get Exchange Information',
                        name: 'getExchangeInfo',
                        description: 'Get current exchange trading rules and symbol information.'
                    },
                    {
                        label: 'Get Recent Trades List',
                        name: 'getRecentTradesList',
                        description: 'Get recent trades.'
                    },
                    {
                        label: 'Get Compressed, Aggregate Trades',
                        name: 'getAggTrades',
                        description: 'Get compressed, aggregate trades. Trades that fill at the time, from the same taker order, with the same price will have the quantity aggregated.'
                    },
                    {
                        label: 'Get Kline/Candlestick data',
                        name: 'getKlines',
                        description: 'Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.'
                    },
                    {
                        label: 'Get Current Average Price',
                        name: 'getAvgPrice',
                        description: 'Current average price for a symbol.'
                    },
                    {
                        label: 'Get 24hr Ticker Price Change Statistics',
                        name: 'get24hrTickerPrice',
                        description: '24 hour rolling window price change statistics.'
                    },
                    {
                        label: 'Get Symbol Price Ticker',
                        name: 'getTickerPrice',
                        description: 'Latest price for a symbol or symbols.'
                    },
                    {
                        label: 'Get Symbol Order Book Ticker',
                        name: 'getBookTicker',
                        description: 'Best price/qty on the order book for a symbol or symbols.'
                    }
                ],
                default: 'getOrderBook'
            }
        ];
        this.inputParameters = [
            {
                label: 'Symbol',
                name: 'symbol',
                type: 'asyncOptions',
                optional: {
                    'actions.operation': ['getExchangeInfo']
                },
                loadMethod: 'getSupportedSymbols',
                show: {
                    'actions.operation': [
                        'getOrderBook',
                        'getRecentTradesList',
                        'getAggTrades',
                        'getKlines',
                        'getAvgPrice',
                        'get24hrTickerPrice',
                        'getTickerPrice',
                        'getBookTicker',
                        'getExchangeInfo'
                    ]
                }
            },
            {
                label: 'Limit',
                name: 'limit',
                type: 'number',
                default: 100,
                optional: true,
                show: {
                    'actions.operation': ['getOrderBook', 'getRecentTradesList', 'getAggTrades', 'getKlines']
                }
            },
            {
                label: 'From Id',
                name: 'fromId',
                type: 'number',
                optional: true,
                description: 'ID to get aggregate trades from INCLUSIVE.',
                show: {
                    'actions.operation': ['getAggTrades']
                }
            },
            {
                label: 'Start Time',
                name: 'startTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.operation': ['getAggTrades', 'getKlines']
                }
            },
            {
                label: 'End Time',
                name: 'endTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.operation': ['getAggTrades', 'getKlines']
                }
            },
            {
                label: 'Interval',
                name: 'interval',
                type: 'options',
                options: [
                    {
                        label: '1 minute',
                        name: '1m'
                    },
                    {
                        label: '3 minutes',
                        name: '3m'
                    },
                    {
                        label: '5 minutes',
                        name: '5m'
                    },
                    {
                        label: '15 minutes',
                        name: '15m'
                    },
                    {
                        label: '30 minutes',
                        name: '30m'
                    },
                    {
                        label: '1 hour',
                        name: '1h'
                    },
                    {
                        label: '2 hours',
                        name: '2h'
                    },
                    {
                        label: '4 hours',
                        name: '4h'
                    },
                    {
                        label: '6 hours',
                        name: '6h'
                    },
                    {
                        label: '8 hours',
                        name: '8h'
                    },
                    {
                        label: '12 hours',
                        name: '12h'
                    },
                    {
                        label: '1 day',
                        name: '1d'
                    },
                    {
                        label: '3 day',
                        name: '3d'
                    },
                    {
                        label: '1 week',
                        name: '1w'
                    },
                    {
                        label: '1 month',
                        name: '1M'
                    }
                ],
                default: '5m',
                show: {
                    'actions.operation': ['getKlines']
                }
            }
        ];
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        if (actionData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const network = actionData.network;
        const operation = actionData.operation;
        const returnData = [];
        let responseData; // tslint:disable-line: no-any
        let apiUrl = '';
        if (network === 'test') {
            apiUrl = 'https://testnet.binance.vision/api';
        }
        else if (network === 'live') {
            apiUrl = 'https://api.binance.com/api';
        }
        let url = '';
        const queryParameters = {};
        const queryBody = {};
        let method = 'GET';
        try {
            if (operation === 'getOrderBook') {
                const symbol = inputParametersData.symbol;
                const limit = inputParametersData.limit;
                url = `${apiUrl}/v3/depth`;
                queryParameters['symbol'] = symbol;
                queryParameters['limit'] = limit;
                method = 'GET';
            }
            else if (operation === 'getExchangeInfo') {
                const symbol = inputParametersData.symbol;
                if (symbol)
                    queryParameters['symbol'] = symbol;
                url = `${apiUrl}/v3/exchangeInfo`;
                method = 'GET';
            }
            else if (operation === 'getRecentTradesList') {
                const symbol = inputParametersData.symbol;
                const limit = inputParametersData.limit;
                url = `${apiUrl}/v3/trades`;
                queryParameters['symbol'] = symbol;
                queryParameters['limit'] = limit;
                method = 'GET';
            }
            else if (operation === 'getAggTrades') {
                const symbol = inputParametersData.symbol;
                const limit = inputParametersData.limit;
                const fromId = inputParametersData.fromId;
                const startTime = Date.parse(inputParametersData.startTime);
                const endTime = Date.parse(inputParametersData.endTime);
                url = `${apiUrl}/v3/aggTrades`;
                queryParameters['symbol'] = symbol;
                queryParameters['limit'] = limit;
                if (fromId)
                    queryParameters['fromId'] = fromId;
                if (startTime)
                    queryParameters['startTime'] = startTime;
                if (endTime)
                    queryParameters['endTime'] = endTime;
                method = 'GET';
            }
            else if (operation === 'getKlines') {
                const symbol = inputParametersData.symbol;
                const limit = inputParametersData.limit;
                const interval = inputParametersData.interval;
                const startTime = Date.parse(inputParametersData.startTime);
                const endTime = Date.parse(inputParametersData.endTime);
                url = `${apiUrl}/v3/klines`;
                queryParameters['symbol'] = symbol;
                queryParameters['limit'] = limit;
                queryParameters['interval'] = interval;
                if (startTime)
                    queryParameters['startTime'] = startTime;
                if (endTime)
                    queryParameters['endTime'] = endTime;
                method = 'GET';
            }
            else if (operation === 'getAvgPrice') {
                const symbol = inputParametersData.symbol;
                url = `${apiUrl}/v3/avgPrice`;
                queryParameters['symbol'] = symbol;
                method = 'GET';
            }
            else if (operation === 'get24hrTickerPrice') {
                const symbol = inputParametersData.symbol;
                url = `${apiUrl}/v3/ticker/24hr`;
                queryParameters['symbol'] = symbol;
                method = 'GET';
            }
            else if (operation === 'getTickerPrice') {
                const symbol = inputParametersData.symbol;
                url = `${apiUrl}/v3/ticker/price`;
                queryParameters['symbol'] = symbol;
                method = 'GET';
            }
            else if (operation === 'getBookTicker') {
                const symbol = inputParametersData.symbol;
                url = `${apiUrl}/v3/ticker/bookTicker`;
                queryParameters['symbol'] = symbol;
                method = 'GET';
            }
            const axiosConfig = {
                method,
                url,
                params: queryParameters,
                paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            if (Object.keys(queryBody).length > 0) {
                axiosConfig.data = queryBody;
            }
            const response = await (0, axios_1.default)(axiosConfig);
            responseData = response.data;
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
        if (Array.isArray(responseData))
            returnData.push(...responseData);
        else
            returnData.push(responseData);
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: BinancePublic };
//# sourceMappingURL=BinancePublic.js.map