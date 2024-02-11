"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const extendedParameters_1 = require("./extendedParameters");
class OpenSea {
    constructor() {
        this.label = 'OpenSea';
        this.name = 'opensea';
        this.icon = 'opensea.svg';
        this.type = 'action';
        this.category = 'NFT';
        this.version = 1.0;
        this.description = 'Query OpenSea information';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Retrieve Assets',
                        name: 'retrieveAssets',
                        description: 'Returns a set of NFTs.'
                    },
                    {
                        label: 'Retrieve Events',
                        name: 'retrieveEvents',
                        description: 'Returns a list of Events.'
                    },
                    {
                        label: 'Retrieve Collections',
                        name: 'retrieveCollections',
                        description: 'Returns a list of collections supported and vetted by OpenSea.'
                    },
                    {
                        label: 'Retrieve Bundles',
                        name: 'retrieveBundles',
                        description: 'Returns a list of bundles. Bundles are groups of NFTs for sale on OpenSea.'
                    },
                    {
                        label: 'Retrieve An Asset',
                        name: 'retrieveAnAsset',
                        description: 'Fetch information about a single NFT, based on its contract address and token ID.'
                    },
                    {
                        label: 'Retrieve A Contract',
                        name: 'retrieveAContract',
                        description: 'Fetch detailed information about a specified contract.'
                    },
                    {
                        label: 'Retrieve A Collection',
                        name: 'retrieveACollection',
                        description: 'Retrieve more in-depth information about an individual collection, including real time statistics such as floor price.'
                    },
                    {
                        label: 'Retrieve Collection Stats',
                        name: 'retrieveCollectionStats',
                        description: 'Fetch stats for a specific collection, including real-time floor price data.'
                    }
                ],
                default: ''
            },
            {
                label: 'Event Type',
                name: 'event_type',
                type: 'options',
                options: [
                    {
                        label: 'Auctions',
                        name: 'created'
                    },
                    {
                        label: 'Sales',
                        name: 'successful'
                    },
                    {
                        label: 'Transfer',
                        name: 'transfer'
                    },
                    {
                        label: 'Approve',
                        name: 'approve'
                    },
                    {
                        label: 'Bid Entered',
                        name: 'bid_entered'
                    },
                    {
                        label: 'Bid Withdrawn',
                        name: 'bid_withdrawn'
                    },
                    {
                        label: 'Cancelled',
                        name: 'cancelled'
                    },
                    {
                        label: 'All Events',
                        name: 'all'
                    }
                ],
                default: '',
                description: 'The event type to filter',
                show: {
                    'actions.operation': ['retrieveEvents']
                }
            },
            {
                label: 'Auction Type',
                name: 'auction_type',
                type: 'options',
                options: [
                    {
                        label: 'Sell to the highest bidder',
                        name: 'english',
                        description: 'The highest bid wins at the end'
                    },
                    {
                        label: 'Sell with a declining price',
                        name: 'dutch',
                        description: 'The price falls until someone purchases the item'
                    },
                    {
                        label: 'CryptoPunks Auctions',
                        name: 'min-price'
                    }
                ],
                default: '',
                optional: true,
                description: 'Filter by an auction type',
                show: {
                    'actions.operation': ['retrieveEvents'],
                    'actions.event_type': ['created']
                }
            },
            {
                label: 'Environment',
                name: 'environment',
                type: 'options',
                description: 'Environment to execute operation: Test or Main',
                options: [
                    {
                        label: 'TEST',
                        name: 'https://testnets-api.opensea.io/api/v1',
                        description: 'Testnet: https://testnets.opensea.io/'
                    },
                    {
                        label: 'MAIN',
                        name: 'https://api.opensea.io/api/v1',
                        description: 'Mainnet: https://opensea.io/'
                    }
                ],
                default: ''
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'OpenSea API Key',
                        name: 'openSeaApi',
                        description: 'How to get API key: https://docs.opensea.io/reference/request-an-api-key'
                    }
                ],
                default: 'openSeaApi',
                show: {
                    'actions.environment': ['https://api.opensea.io/api/v1']
                }
            }
        ];
        this.inputParameters = [
            ...extendedParameters_1.retrieveAssets,
            ...extendedParameters_1.retrieveEvents,
            ...extendedParameters_1.retrieveCollections,
            ...extendedParameters_1.retrieveBundles,
            ...extendedParameters_1.retrieveAnAsset,
            ...extendedParameters_1.retrieveAContract,
            ...extendedParameters_1.retrieveACollection
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const actionData = nodeData.actions;
        if (actionData === undefined) {
            throw new Error('Required data missing');
        }
        const operation = actionData.operation;
        const baseURL = actionData.environment;
        const returnData = [];
        let responseData;
        let url = '';
        const queryParameters = {};
        const method = 'GET';
        const headers = {
            'Content-Type': 'application/json'
        };
        if (baseURL === 'https://api.opensea.io/api/v1') {
            // Mainnet
            const credentials = nodeData.credentials;
            if (credentials === undefined) {
                throw new Error('Missing credentials');
            }
            const apiKey = credentials.apiKey;
            headers['X-API-KEY'] = apiKey;
        }
        try {
            if (operation === 'retrieveAssets') {
                url = `${baseURL}/assets`;
                const owner = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.owner;
                if (owner)
                    queryParameters['owner'] = owner;
                const token_ids_string = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.token_ids;
                if (token_ids_string) {
                    const token_ids = JSON.parse(token_ids_string.replace(/\s/g, ''));
                    if (token_ids.length)
                        queryParameters['token_ids'] = token_ids;
                }
                const asset_contract_address = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.asset_contract_address;
                if (asset_contract_address)
                    queryParameters['asset_contract_address'] = asset_contract_address;
                const asset_contract_addresses_string = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.asset_contract_addresses;
                if (asset_contract_addresses_string) {
                    const asset_contract_addresses = JSON.parse(asset_contract_addresses_string.replace(/\s/g, ''));
                    if (asset_contract_addresses.length)
                        queryParameters['asset_contract_addresses'] = asset_contract_addresses;
                }
                const order_by = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.order_by;
                if (order_by)
                    queryParameters['order_by'] = order_by;
                const order_direction = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.order_direction;
                if (order_direction)
                    queryParameters['order_direction'] = order_direction;
                const offset = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.offset;
                if (offset)
                    queryParameters['offset'] = offset;
                const limit = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.limit;
                if (limit)
                    queryParameters['limit'] = limit;
                const collection = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.collection;
                if (collection)
                    queryParameters['collection'] = collection;
                const include_orders = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.include_orders;
                if (include_orders)
                    queryParameters['include_orders'] = include_orders;
            }
            else if (operation === 'retrieveEvents') {
                url = `${baseURL}/events`;
                const event_type = actionData.event_type;
                if (event_type && event_type !== 'all')
                    queryParameters['event_type'] = event_type;
                const auction_type = actionData.auction_type;
                if (auction_type)
                    queryParameters['auction_type'] = auction_type;
                const asset_contract_address = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.asset_contract_address;
                if (asset_contract_address)
                    queryParameters['asset_contract_address'] = asset_contract_address;
                const collection_slug = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.collection_slug;
                if (collection_slug)
                    queryParameters['collection_slug'] = collection_slug;
                const token_id = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.token_id;
                if (token_id)
                    queryParameters['token_id'] = token_id;
                const account_address = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.account_address;
                if (account_address)
                    queryParameters['account_address'] = account_address;
                const only_opensea = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.only_opensea;
                if (only_opensea)
                    queryParameters['only_opensea'] = only_opensea;
                const offset = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.offset;
                if (offset)
                    queryParameters['offset'] = offset;
                const limit = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.limit;
                if (limit)
                    queryParameters['limit'] = limit;
                const occurred_before = Date.parse(inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.occurred_before);
                if (occurred_before)
                    queryParameters['occurred_before'] = occurred_before;
                const occurred_after = Date.parse(inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.occurred_after);
                if (occurred_after)
                    queryParameters['occurred_after'] = occurred_after;
            }
            else if (operation === 'retrieveCollections') {
                url = `${baseURL}/collections`;
                const asset_owner = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.asset_owner;
                if (asset_owner)
                    queryParameters['asset_owner'] = asset_owner;
                const offset = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.offset;
                if (offset)
                    queryParameters['offset'] = offset;
                const limit = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.limit;
                if (limit)
                    queryParameters['limit'] = limit;
            }
            else if (operation === 'retrieveBundles') {
                url = `${baseURL}/bundles`;
                const on_sale = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.on_sale;
                if (on_sale)
                    queryParameters['on_sale'] = on_sale;
                const owner = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.owner;
                if (owner)
                    queryParameters['owner'] = owner;
                const token_ids_string = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.token_ids;
                if (token_ids_string) {
                    const token_ids = JSON.parse(token_ids_string.replace(/\s/g, ''));
                    if (token_ids.length)
                        queryParameters['token_ids'] = token_ids;
                }
                const asset_contract_address = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.asset_contract_address;
                if (asset_contract_address)
                    queryParameters['asset_contract_address'] = asset_contract_address;
                const asset_contract_addresses_string = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.asset_contract_addresses;
                if (asset_contract_addresses_string) {
                    const asset_contract_addresses = JSON.parse(asset_contract_addresses_string.replace(/\s/g, ''));
                    if (asset_contract_addresses.length)
                        queryParameters['asset_contract_addresses'] = asset_contract_addresses;
                }
                const offset = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.offset;
                if (offset)
                    queryParameters['offset'] = offset;
                const limit = inputParametersData === null || inputParametersData === void 0 ? void 0 : inputParametersData.limit;
                if (limit)
                    queryParameters['limit'] = limit;
            }
            else if (operation === 'retrieveAnAsset') {
                const token_id = inputParametersData.token_id;
                const asset_contract_address = inputParametersData.asset_contract_address;
                url = `${baseURL}/asset/${asset_contract_address}/${token_id}`;
            }
            else if (operation === 'retrieveAContract') {
                const asset_contract_address = inputParametersData.asset_contract_address;
                url = `${baseURL}/asset_contract/${asset_contract_address}`;
            }
            else if (operation === 'retrieveACollection') {
                const collection_slug = inputParametersData.collection_slug;
                url = `${baseURL}/collection/${collection_slug}`;
            }
            else if (operation === 'retrieveCollectionStats') {
                const collection_slug = inputParametersData.collection_slug;
                url = `${baseURL}/collection/${collection_slug}/stats`;
            }
            const axiosConfig = {
                method,
                url,
                headers
            };
            if (Object.keys(queryParameters).length > 0) {
                axiosConfig.params = queryParameters;
                axiosConfig.paramsSerializer = (params) => (0, utils_1.serializeQueryParams)(params, true);
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
module.exports = { nodeClass: OpenSea };
//# sourceMappingURL=Opensea.js.map