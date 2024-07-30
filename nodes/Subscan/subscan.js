
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");

class Subscan {
    constructor() {
        this.label = 'Subscan';
        this.name = 'subscan';
        this.icon = 'subscan.png';
        this.type = 'action';
        this.category = 'Block Explorer';
        this.version = 1.0;
        this.description = 'Perform Subscan operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get Account Info',
                        name: constants_1.GET_ACCOUNT_INFO.name,
                        description: 'Returns the account information of a given address.'
                    },
                    {
                        label: 'Get Account Balance',
                        name: constants_1.GET_ACCOUNT_BALANCE.name,
                        description: 'Returns the balance of a given address.'
                    },
                    {
                        label: 'Get Extrinsics',
                        name: constants_1.GET_EXTRINSICS.name,
                        description: 'Returns the list of extrinsics performed by an address.'
                    },
                    {
                        label: 'Get Transfers',
                        name: constants_1.GET_TRANSFERS.name,
                        description: 'Returns the list of transfers performed by an address.'
                    },
                    {
                        label: 'Get Rewards',
                        name: constants_1.GET_REWARDS.name,
                        description: 'Returns the list of rewards for a given address.'
                    },
                    {
                        label: 'Get Slashes',
                        name: constants_1.GET_SLASHES.name,
                        description: 'Returns the list of slashes for a given address.'
                    },
                    {
                        label: 'Get Staking Info',
                        name: constants_1.GET_STAKING_INFO.name,
                        description: 'Returns the staking information for a given address.'
                    },
                    {
                        label: 'Get Block Info',
                        name: constants_1.GET_BLOCK_INFO.name,
                        description: 'Returns information about a given block.'
                    },
                    {
                        label: 'Get Event Info',
                        name: constants_1.GET_EVENT_INFO.name,
                        description: 'Returns information about a given event.'
                    },
                    {
                        label: 'Get Validators',
                        name: constants_1.GET_VALIDATORS.name,
                        description: 'Returns a list of validators.'
                    }
                ],
                default: 'getAccountInfo'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    { label: 'Polkadot', name: 'polkadot' },
                    { label: 'Kusama', name: 'kusama' },
                    { label: 'Assethub Polkadot', name: 'assethub-polkadot' },
                    { label: 'Assethub Kusama', name: 'assethub-kusama' },
                    { label: 'Assethub Rococo', name: 'assethub-rococo' },
                    { label: 'Assethub Westend', name: 'assethub-westend' },
                    { label: 'Acala', name: 'acala' },
                    { label: 'Acala Mandala', name: 'acala-mandala' },
                    { label: 'Ajuna', name: 'ajuna' },
                    { label: 'Alephzero', name: 'alephzero' },
                    { label: 'Alephzero testnet', name: 'alephzero-testnet' },
                    { label: 'Altair', name: 'altair' },
                    { label: 'Astar', name: 'astar' },
                    { label: 'Avail testnet', name: 'avail-testnet' },
                    { label: 'Bajun', name: 'bajun' },
                    { label: 'Basilisk', name: 'basilisk' },
                    { label: 'Bifrost', name: 'bifrost' },
                    { label: 'Bifrost Kusama', name: 'bifrost-kusama' },
                    { label: 'BridgeHub Polkadot', name: 'bridgehub-polkadot' },
                    { label: 'BridgeHub Kusama', name: 'bridgehub-kusama' },
                    { label: 'BridgeHub Rococo', name: 'bridgehub-rococo' },
                    { label: 'BridgeHub Westend', name: 'bridgehub-westend' },
                    { label: 'Calamari', name: 'calamari' },
                    { label: 'Centrifuge', name: 'centrifuge' },
                    { label: 'Centrifuge Solo', name: 'centrifuge-solo' },
                    { label: 'Clover', name: 'clover' },
                    { label: 'Composable', name: 'composable' },
                    { label: 'Continuum', name: 'continuum' },
                    { label: 'Creditcoin', name: 'creditcoin' },
                    { label: 'Creditcoin testnet', name: 'creditcoin-testnet' },
                    { label: 'Crust', name: 'crust' },
                    { label: 'Crust Shadow', name: 'crust-shadow' },
                    { label: 'DeepBrain Chain', name: 'dbc' },
                    { label: 'Dock', name: 'dock' },
                    { label: 'Darwinia', name: 'darwinia' },
                    { label: 'Enjin', name: 'enjin' },
                    { label: 'Enjin-matrix', name: 'enjin-matrix' },
                    { label: 'Enjin-canary-matrix', name: 'enjin-canary-matrix' },
                    { label: 'Enjin-canary', name: 'enjin-canary' },
                    { label: 'Humanode', name: 'humanode' },
                    { label: 'HydraDX', name: 'hydradx' },
                    { label: 'IntegriTEE', name: 'integritee' },
                    { label: 'Interlay', name: 'interlay' },
                    { label: 'Joystream', name: 'joystream' },
                    { label: 'Karura', name: 'karura' },
                    { label: 'Kintsugi', name: 'kintsugi' },
                    { label: 'Khala', name: 'khala' },
                    { label: 'Krest', name: 'krest' },
                    { label: 'KILT Peregrine', name: 'kilt-peregrine' },
                    { label: 'KILT Spiritnet', name: 'kilt-spiritnet' },
                    { label: 'Mangata', name: 'mangata' },
                    { label: 'Moonbase', name: 'moonbase' },
                    { label: 'Moonbeam', name: 'moonbeam' },
                    { label: 'Moonriver', name: 'moonriver' },
                    { label: 'Manta', name: 'manta' },
                    { label: 'Nodle', name: 'nodle' },
                    { label: 'NeuroWeb', name: 'neuroweb' },
                    { label: 'NeuroWeb Testnet', name: 'neuroweb-testnet' },
                    { label: 'Peaq', name: 'peaq' },
                    { label: 'Phala', name: 'phala' },
                    { label: 'Picasso', name: 'picasso' },
                    { label: 'Pioneer', name: 'pioneer' },
                    { label: 'Polkadex', name: 'polkadex' },
                    { label: 'Polkadex Parachain', name: 'polkadex-parachain' },
                    { label: 'Polymesh', name: 'polymesh' },
                    { label: 'Polymesh Testnet', name: 'polymesh-testnet' },
                    { label: 'Quartz', name: 'quartz' },
                    { label: 'Robonomics', name: 'robonomics' },
                    { label: 'Rococo', name: 'rococo' },
                    { label: 'Shibuya', name: 'shibuya' },
                    { label: 'Shiden', name: 'shiden' },
                    { label: 'SORA', name: 'sora' },
                    { label: 'Subspace', name: 'subspace' },
                    { label: 'Stafi', name: 'stafi' },
                    { label: 'Turing', name: 'turing' },
                    { label: 'Unique', name: 'unique' },
                    { label: 'Vara', name: 'vara' },
                    { label: 'Westend', name: 'westend' },
                    { label: 'Zeitgeist', name: 'zeitgeist' }
                ],
                default: 'polkadot'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Subscan API Key',
                        name: 'subscanApi'
                    }
                ],
                default: 'subscanApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                description: 'The address parameter(s) required',
                show: {
                    'actions.api': [
                        constants_1.GET_ACCOUNT_INFO.name,
                        constants_1.GET_ACCOUNT_BALANCE.name,
                        constants_1.GET_EXTRINSICS.name,
                        constants_1.GET_TRANSFERS.name,
                        constants_1.GET_REWARDS.name,
                        constants_1.GET_SLASHES.name,
                        constants_1.GET_STAKING_INFO.name
                    ]
                }
            },
            {
                label: 'Block Number',
                name: 'blockNumber',
                type: 'number',
                description: 'The block number to get information for',
                show: {
                    'actions.api': [
                        constants_1.GET_BLOCK_INFO.name
                    ]
                }
            },
            {
                label: 'Event ID',
                name: 'eventId',
                type: 'string',
                description: 'The event ID to get information for',
                show: {
                    'actions.api': [
                        constants_1.GET_EVENT_INFO.name
                    ]
                }
            },
            {
                label: 'Page',
                name: 'page',
                type: 'number',
                optional: true,
                description: 'The page number for pagination',
                show: {
                    'actions.api': [
                        constants_1.GET_EXTRINSICS.name,
                        constants_1.GET_TRANSFERS.name,
                        constants_1.GET_REWARDS.name,
                        constants_1.GET_SLASHES.name
                    ]
                },
                default: 1
            },
            {
                label: 'Page Size',
                name: 'pageSize',
                type: 'number',
                optional: true,
                description: 'The number of items per page',
                show: {
                    'actions.api': [
                        constants_1.GET_EXTRINSICS.name,
                        constants_1.GET_TRANSFERS.name,
                        constants_1.GET_REWARDS.name,
                        constants_1.GET_SLASHES.name
                    ]
                },
                default: 10
            }
        ];
    }

    getNetwork(network) {
        return subscanAPIs[network];
    }

    getBaseParams(api) {
        const operation = constants_1.OPERATIONS.filter(({ name }) => name === api)[0];
        return { action: operation.action };
    }

    async run(nodeData) {
        const actionData = nodeData.actions;
        const networksData = nodeData.networks;
        const inputParameters = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParameters === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }
        // GET api
        const api = actionData.api;
        // GET network
        const network = networksData.network;
        // GET credentials
        const apiKey = credentials.apiKey;
        // GET input parameters
        const address = inputParameters.address;
        const blockNumber = inputParameters.blockNumber;
        const eventId = inputParameters.eventId;
        const page = inputParameters.page;
        const pageSize = inputParameters.pageSize;
        const url = `${this.getNetwork(network)}/api/scan/${this.getBaseParams(api).action}`;

        const params = {
            address,
            block_num: blockNumber,
            event_id: eventId,
            page,
            row: pageSize,
        };

        const axiosConfig = {
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            data: params
        };

        let responseData;
        try {
            const response = await (0, axios_1.default)(axiosConfig);
            responseData = response.data;
        } catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }

        const returnData = Array.isArray(responseData) ? responseData : [responseData];
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}

module.exports = { nodeClass: Subscan };
//# sourceMappingURL=Subscan.js.map
