"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
class BinancePrivate {
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
        this.label = 'Binance Private';
        this.name = 'binancePrivate';
        this.icon = 'binance-logo.svg';
        this.type = 'action';
        this.category = 'Centralized Exchange';
        this.version = 1.0;
        this.description = 'Binance Private APIs that require API and Secret keys';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                description: 'Network to execute API: Test or Live',
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
                        label: 'Send New Order',
                        name: 'postNewOrder',
                        description: 'Send in a new order.'
                    },
                    {
                        label: 'Test New Order',
                        name: 'postTestNewOrder',
                        description: 'Test new order creation. Creates and validates a new order but does not send it into the matching engine.'
                    },
                    {
                        label: 'Query Order',
                        name: 'getOrder',
                        description: `Check an order's status.`
                    },
                    {
                        label: 'Cancel Order',
                        name: 'delOrder',
                        description: `Cancel an active order.`
                    },
                    {
                        label: 'Cancel All Open Orders on a Symbol',
                        name: 'delOpenOrders',
                        description: `Cancels all active orders on a symbol. This includes OCO orders.`
                    },
                    {
                        label: 'Query Current Open Orders',
                        name: 'getOpenOrders',
                        description: `Get all open orders on a symbol.`
                    },
                    {
                        label: 'Query All Orders',
                        name: 'getAllOrders',
                        description: `Get all account orders; active, canceled, or filled.`
                    },
                    {
                        label: 'Query Account Information',
                        name: 'getAccountInformation',
                        description: `Get current account information.`
                    },
                    {
                        label: 'Query Account Trade List',
                        name: 'getMyTrades',
                        description: `Get trades for a specific account and symbol.`
                    },
                    {
                        label: 'Query Current Order Count Usage',
                        name: 'getOrderCountUsage',
                        description: `Displays the user's current order count usage for all intervals.`
                    }
                ],
                default: 'getAccountInformation'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Binance API Key',
                        name: 'binanceApi'
                    }
                ],
                default: 'binanceApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Symbol',
                name: 'symbol',
                type: 'asyncOptions',
                loadMethod: 'getSupportedSymbols',
                show: {
                    'actions.operation': [
                        'postNewOrder',
                        'postTestNewOrder',
                        'getOrder',
                        'delOrder',
                        'delOpenOrders',
                        'getOpenOrders',
                        'getAllOrders',
                        'getMyTrades'
                    ]
                }
            },
            {
                label: 'Order Side',
                name: 'side',
                type: 'options',
                options: [
                    {
                        label: 'BUY',
                        name: 'BUY'
                    },
                    {
                        label: 'SELL',
                        name: 'SELL'
                    }
                ],
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Order Type',
                name: 'type',
                type: 'options',
                options: [
                    {
                        label: 'LIMIT',
                        name: 'LIMIT'
                    },
                    {
                        label: 'MARKET',
                        name: 'MARKET'
                    },
                    {
                        label: 'STOP_LOSS',
                        name: 'STOP_LOSS'
                    },
                    {
                        label: 'STOP_LOSS_LIMIT',
                        name: 'STOP_LOSS_LIMIT'
                    },
                    {
                        label: 'TAKE_PROFIT',
                        name: 'TAKE_PROFIT'
                    },
                    {
                        label: 'TAKE_PROFIT_LIMIT',
                        name: 'TAKE_PROFIT_LIMIT'
                    },
                    {
                        label: 'LIMIT_MAKER',
                        name: 'LIMIT_MAKER'
                    }
                ],
                default: 'LIMIT',
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Time in Force',
                name: 'timeInForce',
                type: 'options',
                description: 'This sets how long an order will be active before expiration.',
                options: [
                    {
                        label: 'Good Til Canceled',
                        name: 'GTC',
                        description: 'An order will be on the book unless the order is canceled.'
                    },
                    {
                        label: 'Immediate Or Cancel',
                        name: 'IOC',
                        description: 'An order will try to fill the order as much as it can before the order expires.'
                    },
                    {
                        label: 'Fill or Kill',
                        name: 'FOK',
                        description: 'An order will expire if the full order cannot be filled upon execution.'
                    }
                ],
                optional: {
                    'inputParameters.type': ['MARKET', 'STOP_LOSS', 'TAKE_PROFIT', 'LIMIT_MAKER']
                },
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Quantity',
                name: 'quantity',
                type: 'number',
                description: 'For MARKET order type, Quantity or Quote Order Quantity is mandatory.',
                optional: {
                    'inputParameters.type': ['MARKET'],
                    'inputParameters.quoteOrderQty': utils_1.numberOrExpressionRegex
                },
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Quote Order Quantity',
                name: 'quoteOrderQty',
                type: 'number',
                description: 'Specifies the amount the user wants to spend (when buying) or receive (when selling). For MARKET order type, Quantity or Quote Order Quantity is mandatory.',
                optional: {
                    'inputParameters.quantity': utils_1.numberOrExpressionRegex
                },
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder'],
                    'inputParameters.type': ['MARKET']
                }
            },
            {
                label: 'Price',
                name: 'price',
                type: 'number',
                optional: {
                    'inputParameters.type': ['MARKET', 'STOP_LOSS', 'TAKE_PROFIT']
                },
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'New Client Order Id',
                name: 'newClientOrderId',
                description: 'A unique id among open orders. Automatically generated if not sent. Orders with the same newClientOrderID can be accepted only when the previous one is filled, otherwise the order will be rejected.',
                type: 'string',
                optional: true,
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Stop Price',
                name: 'stopPrice',
                type: 'number',
                description: 'For [STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT] order type, Stop Price or Trailing Delta is mandatory.',
                optional: {
                    'inputParameters.trailingDelta': utils_1.numberOrExpressionRegex
                },
                show: {
                    'inputParameters.type': ['STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT'],
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Trailing Delta',
                name: 'trailingDelta',
                type: 'number',
                description: 'For [STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT] order type, Stop Price or Trailing Delta is mandatory.',
                optional: {
                    'inputParameters.stopPrice': utils_1.numberOrExpressionRegex
                },
                show: {
                    'inputParameters.type': ['STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT'],
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Iceberg Quantity',
                name: 'icebergQty',
                type: 'number',
                optional: true,
                show: {
                    'inputParameters.type': ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'],
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'New Order Response Type',
                name: 'newOrderRespType',
                type: 'options',
                description: 'Set the response JSON. MARKET and LIMIT order types default to FULL, all other orders default to ACK.',
                options: [
                    {
                        label: 'ACK',
                        name: 'ACK'
                    },
                    {
                        label: 'RESULT',
                        name: 'RESULT'
                    },
                    {
                        label: 'FULL',
                        name: 'FULL'
                    }
                ],
                optional: true,
                show: {
                    'actions.operation': ['postNewOrder', 'postTestNewOrder']
                }
            },
            {
                label: 'Order Id',
                name: 'orderId',
                type: 'number',
                description: 'Order Id or Orig Client Order Id is mandatory.',
                optional: {
                    'inputParameters.origClientOrderId': utils_1.notEmptyRegex
                },
                show: {
                    'actions.operation': ['getOrder', 'delOrder']
                }
            },
            {
                label: 'Orig Client Order Id',
                name: 'origClientOrderId',
                type: 'string',
                description: 'Order Id or Orig Client Order Id is mandatory.',
                optional: {
                    'inputParameters.orderId': utils_1.numberOrExpressionRegex
                },
                show: {
                    'actions.operation': ['getOrder', 'delOrder']
                }
            },
            {
                label: 'Order Id',
                name: 'orderId',
                type: 'number',
                description: 'Get orders >= Order Id. Otherwise most recent orders are returned. Not needed if Start Time and/or End Time provided.',
                optional: true,
                show: {
                    'actions.operation': ['getAllOrders', 'getMyTrades']
                }
            },
            {
                label: 'Start Time',
                name: 'startTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.operation': ['getAllOrders', 'getMyTrades']
                }
            },
            {
                label: 'End Time',
                name: 'endTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.operation': ['getAllOrders', 'getMyTrades']
                }
            },
            {
                label: 'From Id',
                name: 'fromId',
                type: 'number',
                optional: true,
                description: 'TradeId to fetch from. Default gets most recent trades.',
                show: {
                    'actions.operation': ['getMyTrades']
                }
            },
            {
                label: 'Limit',
                name: 'limit',
                type: 'number',
                default: 500,
                optional: true,
                show: {
                    'actions.operation': ['getAllOrders', 'getMyTrades']
                }
            }
        ];
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const network = actionData.network;
        const operation = actionData.operation;
        const apiKey = credentials.apiKey;
        const secretKey = credentials.secretKey;
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
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            if (operation === 'postNewOrder' || operation === 'postTestNewOrder') {
                const symbol = inputParametersData.symbol;
                const side = inputParametersData.side;
                const type = inputParametersData.type;
                const timeInForce = inputParametersData.timeInForce;
                const quantity = inputParametersData.quantity;
                const quoteOrderQty = inputParametersData.quoteOrderQty;
                const price = inputParametersData.price;
                const newClientOrderId = inputParametersData.newClientOrderId;
                const stopPrice = inputParametersData.stopPrice;
                const trailingDelta = inputParametersData.trailingDelta;
                const icebergQty = inputParametersData.icebergQty;
                const newOrderRespType = inputParametersData.newOrderRespType;
                const timestamp = Date.now();
                queryParameters['symbol'] = symbol;
                queryParameters['side'] = side;
                queryParameters['type'] = type;
                if (timeInForce)
                    queryParameters['timeInForce'] = timeInForce;
                if (quantity)
                    queryParameters['quantity'] = quantity;
                if (quoteOrderQty)
                    queryParameters['quoteOrderQty'] = quoteOrderQty;
                if (price)
                    queryParameters['price'] = price;
                if (newClientOrderId)
                    queryParameters['newClientOrderId'] = newClientOrderId;
                if (stopPrice)
                    queryParameters['stopPrice'] = stopPrice;
                if (trailingDelta)
                    queryParameters['trailingDelta'] = trailingDelta;
                if (icebergQty)
                    queryParameters['icebergQty'] = icebergQty;
                if (newOrderRespType)
                    queryParameters['newOrderRespType'] = newOrderRespType;
                queryParameters['recvWindow'] = 5000;
                queryParameters['timestamp'] = timestamp;
                const serializedQueryParams = (0, utils_1.serializeQueryParams)(queryParameters);
                const signature = (0, crypto_1.createHmac)('sha256', secretKey).update(serializedQueryParams).digest('hex');
                queryParameters['signature'] = signature;
                method = 'POST';
                headers['X-MBX-APIKEY'] = apiKey;
                url = `${apiUrl}/v3/order`;
                if (operation === 'postTestNewOrder')
                    url += '/test';
            }
            else if (operation === 'getOrder' || operation === 'delOrder') {
                const symbol = inputParametersData.symbol;
                const orderId = inputParametersData.orderId;
                const origClientOrderId = inputParametersData.origClientOrderId;
                const timestamp = Date.now();
                queryParameters['symbol'] = symbol;
                if (orderId)
                    queryParameters['orderId'] = orderId;
                if (origClientOrderId)
                    queryParameters['origClientOrderId'] = origClientOrderId;
                queryParameters['recvWindow'] = 5000;
                queryParameters['timestamp'] = timestamp;
                const serializedQueryParams = (0, utils_1.serializeQueryParams)(queryParameters);
                const signature = (0, crypto_1.createHmac)('sha256', secretKey).update(serializedQueryParams).digest('hex');
                queryParameters['signature'] = signature;
                method = operation === 'delOrder' ? 'DELETE' : 'GET';
                headers['X-MBX-APIKEY'] = apiKey;
                url = `${apiUrl}/v3/order`;
            }
            else if (operation === 'getOpenOrders' || operation === 'delOpenOrders') {
                const symbol = inputParametersData.symbol;
                const timestamp = Date.now();
                queryParameters['symbol'] = symbol;
                queryParameters['recvWindow'] = 5000;
                queryParameters['timestamp'] = timestamp;
                const serializedQueryParams = (0, utils_1.serializeQueryParams)(queryParameters);
                const signature = (0, crypto_1.createHmac)('sha256', secretKey).update(serializedQueryParams).digest('hex');
                queryParameters['signature'] = signature;
                method = operation === 'delOpenOrders' ? 'DELETE' : 'GET';
                headers['X-MBX-APIKEY'] = apiKey;
                url = `${apiUrl}/v3/openOrders`;
            }
            else if (operation === 'getAllOrders' || operation === 'getMyTrades') {
                const symbol = inputParametersData.symbol;
                const orderId = inputParametersData.orderId;
                const startTime = Date.parse(inputParametersData.startTime);
                const endTime = Date.parse(inputParametersData.endTime);
                const limit = inputParametersData.limit;
                const fromId = inputParametersData.fromId;
                const timestamp = Date.now();
                queryParameters['symbol'] = symbol;
                if (orderId)
                    queryParameters['orderId'] = orderId;
                if (startTime)
                    queryParameters['startTime'] = startTime;
                if (endTime)
                    queryParameters['endTime'] = endTime;
                if (limit)
                    queryParameters['limit'] = limit;
                if (fromId)
                    queryParameters['fromId'] = fromId;
                queryParameters['recvWindow'] = 5000;
                queryParameters['timestamp'] = timestamp;
                const serializedQueryParams = (0, utils_1.serializeQueryParams)(queryParameters);
                const signature = (0, crypto_1.createHmac)('sha256', secretKey).update(serializedQueryParams).digest('hex');
                queryParameters['signature'] = signature;
                method = 'GET';
                headers['X-MBX-APIKEY'] = apiKey;
                const endpoint = operation === 'getMyTrades' ? 'myTrades' : 'allOrders';
                url = `${apiUrl}/v3/${endpoint}`;
            }
            else if (operation === 'getAccountInformation' || operation === 'getOrderCountUsage') {
                const timestamp = Date.now();
                queryParameters['recvWindow'] = 5000;
                queryParameters['timestamp'] = timestamp;
                const serializedQueryParams = (0, utils_1.serializeQueryParams)(queryParameters);
                const signature = (0, crypto_1.createHmac)('sha256', secretKey).update(serializedQueryParams).digest('hex');
                queryParameters['signature'] = signature;
                method = 'GET';
                headers['X-MBX-APIKEY'] = apiKey;
                const endpoint = operation === 'getAccountInformation' ? 'account' : 'rateLimit/order';
                url = `${apiUrl}/v3/${endpoint}`;
            }
            const axiosConfig = {
                method,
                url,
                params: queryParameters,
                paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                headers
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
        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        }
        else {
            returnData.push(responseData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: BinancePrivate };
//# sourceMappingURL=BinancePrivate.js.map