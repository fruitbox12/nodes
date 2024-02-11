"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const supportedNetwork_1 = require("./supportedNetwork");
const extendedEVMOperation_1 = require("./extendedEVMOperation");
const extendedNFTOperation_1 = require("./extendedNFTOperation");
const extendedDeFiOperation_1 = require("./extendedDeFiOperation");
class Moralis {
    constructor() {
        this.loadMethods = {
            async getOperations(nodeData) {
                const returnData = [];
                const actionData = nodeData.actions;
                if (actionData === undefined) {
                    return returnData;
                }
                const api = actionData.api;
                if (api === 'evmAPI') {
                    return extendedEVMOperation_1.nativeEvmOperation;
                }
                else if (api === 'nftAPI') {
                    return extendedNFTOperation_1.nftOperation;
                }
                else if (api === 'defiAPI') {
                    return extendedDeFiOperation_1.defiOperation;
                }
                else if (api === 'ipfsAPI') {
                    return [
                        {
                            label: 'Upload Folder',
                            name: 'uploadFolder',
                            description: 'Upload multiple files in a folder to IPFS and place them in a folder directory.'
                        }
                    ];
                }
                else {
                    return returnData;
                }
            }
        };
        this.label = 'Moralis';
        this.name = 'moralis';
        this.icon = 'moralis.svg';
        this.type = 'action';
        this.category = 'Network Provider';
        this.version = 1.0;
        this.description = 'Execute Moralis APIs';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'EVM API',
                        name: 'evmAPI',
                        description: 'API for interacting/fetching standard onchain data using Moralis API key.'
                    },
                    {
                        label: 'NFT API',
                        name: 'nftAPI',
                        description: 'API for interacting/fetching NFT data using Moralis API key.'
                    },
                    {
                        label: 'DeFi API',
                        name: 'defiAPI',
                        description: 'API for interacting/fetching DeFi data using Moralis API key.'
                    },
                    {
                        label: 'Upload to IPFS',
                        name: 'uploadFolder',
                        description: 'Upload multiple files in a folder to IPFS and place them in a folder directory.'
                    }
                ],
                default: 'evmAPI'
            },
            {
                label: 'Folder',
                name: 'folderContent',
                type: 'folder',
                description: 'The path to a folder to be uploaded.',
                show: {
                    'actions.api': ['uploadFolder']
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
                        label: 'Moralis API Key',
                        name: 'moralisApi'
                    }
                ],
                default: 'moralisApi'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...supportedNetwork_1.MoralisSupportedNetworks],
                hide: {
                    'actions.api': ['uploadFolder']
                }
            }
        ];
        this.inputParameters = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'asyncOptions',
                loadMethod: 'getOperations',
                hide: {
                    'actions.api': ['uploadFolder']
                }
            },
            /**
             * nativeEvmOperation
             */
            ...extendedEVMOperation_1.getBlock,
            ...extendedEVMOperation_1.getDateToBlock,
            ...extendedEVMOperation_1.getTransaction,
            ...extendedEVMOperation_1.getContractEvents,
            ...extendedEVMOperation_1.runContractFunction,
            ...extendedEVMOperation_1.getNativeBalance,
            ...extendedEVMOperation_1.getTokenBalances,
            /**
             * nftOperation
             */
            ...extendedNFTOperation_1.getNFTTransfersByBlock,
            ...extendedNFTOperation_1.getWalletNFTs,
            ...extendedNFTOperation_1.getWalletNFTTransfers,
            ...extendedNFTOperation_1.getWalletNFTCollections,
            ...extendedNFTOperation_1.getNFTsForContract,
            ...extendedNFTOperation_1.getNFTTrades,
            ...extendedNFTOperation_1.getNFTLowestPrice,
            ...extendedNFTOperation_1.getContractNFTs,
            ...extendedNFTOperation_1.reSyncMetadata,
            ...extendedNFTOperation_1.getNFTTokenIdMetadata,
            ...extendedNFTOperation_1.getNFTTokenIdTransfers,
            /**
             * defiOperation
             */
            ...extendedDeFiOperation_1.getPairReserves,
            ...extendedDeFiOperation_1.getPairAddress
        ];
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const networksData = nodeData.networks;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || networksData === undefined || credentials === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const api = actionData.api;
        const operation = inputParametersData.operation;
        const chain = networksData.network;
        const apiKey = credentials.apiKey;
        const returnData = [];
        let responseData;
        let url = '';
        const queryParameters = {};
        if (chain)
            queryParameters['chain'] = chain;
        let queryBody = {};
        let method = 'GET';
        const headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey
        };
        try {
            /**
             * nativeEvmOperation
             */
            if (operation === 'getBlock') {
                const block_number_or_hash = inputParametersData.block_number_or_hash;
                url = `https://deep-index.moralis.io/api/v2/block/${block_number_or_hash}`;
                const subdomain = inputParametersData.subdomain;
                if (subdomain)
                    queryParameters['subdomain'] = chain;
            }
            else if (operation === 'getDateToBlock') {
                url = 'https://deep-index.moralis.io/api/v2/dateToBlock';
                const providerUrl = inputParametersData.providerUrl;
                const date = Date.parse(inputParametersData.date);
                if (providerUrl)
                    queryParameters['providerUrl'] = providerUrl;
                if (date)
                    queryParameters['date'] = date;
            }
            else if (operation === 'getTransaction') {
                const transaction_hash = inputParametersData.transaction_hash;
                url = `https://deep-index.moralis.io/api/v2/transaction/${transaction_hash}`;
                const subdomain = inputParametersData.subdomain;
                if (subdomain)
                    queryParameters['subdomain'] = chain;
            }
            else if (operation === 'getContractEvents') {
                method = 'POST';
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/events`;
                const topic = inputParametersData.topic;
                const subdomain = inputParametersData.subdomain;
                const providerUrl = inputParametersData.providerUrl;
                const from_date = inputParametersData.from_date;
                const to_date = inputParametersData.to_date;
                const from_block = inputParametersData.from_block;
                const to_block = inputParametersData.to_block;
                if (topic)
                    queryParameters['topic'] = topic;
                if (subdomain)
                    queryParameters['subdomain'] = chain;
                if (providerUrl)
                    queryParameters['providerUrl'] = providerUrl;
                if (from_date)
                    queryParameters['from_date'] = Date.parse(from_date);
                if (to_date)
                    queryParameters['to_date'] = Date.parse(to_date);
                if (from_block)
                    queryParameters['from_block'] = from_block;
                if (to_block)
                    queryParameters['to_block'] = to_block;
            }
            else if (operation === 'runContractFunction') {
                method = 'POST';
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/function`;
                const function_name = inputParametersData.function_name;
                const subdomain = inputParametersData.subdomain;
                const providerUrl = inputParametersData.providerUrl;
                const abi_str = inputParametersData.abi;
                let abi = [];
                if (abi_str)
                    abi = JSON.parse(abi_str.replace(/\s/g, ''));
                const params_str = inputParametersData.params;
                let params = [];
                if (params_str)
                    params = JSON.parse(params_str.replace(/\s/g, ''));
                if (function_name)
                    queryParameters['function_name'] = function_name;
                if (subdomain)
                    queryParameters['subdomain'] = chain;
                if (providerUrl)
                    queryParameters['providerUrl'] = providerUrl;
                if (abi_str)
                    queryBody['abi'] = abi;
                if (params_str)
                    queryBody['params'] = params;
            }
            else if (operation === 'getTransactions') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}`;
                const subdomain = inputParametersData.subdomain;
                const from_date = inputParametersData.from_date;
                const to_date = inputParametersData.to_date;
                const from_block = inputParametersData.from_block;
                const to_block = inputParametersData.to_block;
                if (subdomain)
                    queryParameters['subdomain'] = chain;
                if (from_date)
                    queryParameters['from_date'] = Date.parse(from_date);
                if (to_date)
                    queryParameters['to_date'] = Date.parse(to_date);
                if (from_block)
                    queryParameters['from_block'] = from_block;
                if (to_block)
                    queryParameters['to_block'] = to_block;
            }
            else if (operation === 'getNativeBalance') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/balance`;
                const providerUrl = inputParametersData.providerUrl;
                const to_block = inputParametersData.to_block;
                if (providerUrl)
                    queryParameters['providerUrl'] = providerUrl;
                if (to_block)
                    queryParameters['to_block'] = to_block;
            }
            else if (operation === 'getTokenBalances') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/erc20`;
                const subdomain = inputParametersData.subdomain;
                const to_block = inputParametersData.to_block;
                const token_addresses_str = inputParametersData.token_addresses;
                let token_addresses = [];
                if (token_addresses_str)
                    token_addresses = JSON.parse(token_addresses_str.replace(/\s/g, ''));
                if (subdomain)
                    queryParameters['subdomain'] = subdomain;
                if (to_block)
                    queryParameters['to_block'] = to_block;
                if (token_addresses)
                    queryParameters['token_addresses'] = token_addresses;
            }
            else if (operation === 'getTokenTransfers') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/erc20/transfers`;
                const subdomain = inputParametersData.subdomain;
                const from_date = inputParametersData.from_date;
                const to_date = inputParametersData.to_date;
                const from_block = inputParametersData.from_block;
                const to_block = inputParametersData.to_block;
                if (subdomain)
                    queryParameters['subdomain'] = chain;
                if (from_date)
                    queryParameters['from_date'] = Date.parse(from_date);
                if (to_date)
                    queryParameters['to_date'] = Date.parse(to_date);
                if (from_block)
                    queryParameters['from_block'] = from_block;
                if (to_block)
                    queryParameters['to_block'] = to_block;
            }
            /**
             * nftOperation
             */
            if (operation === 'getNFTTransfersByBlock') {
                const block_number_or_hash = inputParametersData.block_number_or_hash;
                url = `https://deep-index.moralis.io/api/v2/block/${block_number_or_hash}/nft/transfers`;
                const subdomain = inputParametersData.subdomain;
                if (subdomain)
                    queryParameters['subdomain'] = chain;
            }
            else if (operation === 'getWalletNFTs') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/nft`;
                const format = inputParametersData.format;
                if (format)
                    queryParameters['format'] = format;
                const token_addresses_str = inputParametersData.token_addresses;
                let token_addresses = [];
                if (token_addresses_str) {
                    token_addresses = JSON.parse(token_addresses_str.replace(/\s/g, ''));
                    queryParameters['token_addresses'] = token_addresses;
                }
            }
            else if (operation === 'getWalletNFTTransfers') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/nft/transfers`;
                const format = inputParametersData.format;
                const direction = inputParametersData.direction;
                const from_block = inputParametersData.from_block;
                const to_block = inputParametersData.to_block;
                if (format)
                    queryParameters['format'] = format;
                if (direction)
                    queryParameters['direction'] = direction;
                if (from_block)
                    queryParameters['from_block'] = from_block;
                if (to_block)
                    queryParameters['to_block'] = to_block;
            }
            else if (operation === 'getWalletNFTCollections') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/${address}/nft/collections`;
            }
            else if (operation === 'getNFTsForContract') {
                const address = inputParametersData.address;
                const token_address = inputParametersData.token_address;
                url = `https://deep-index.moralis.io/api/v2/${address}/nft/${token_address}`;
                const format = inputParametersData.format;
                if (format)
                    queryParameters['format'] = format;
            }
            else if (operation === 'getNFTTrades') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/trades`;
                const marketplace = inputParametersData.marketplace;
                const format = inputParametersData.format;
                const providerUrl = inputParametersData.providerUrl;
                const from_block = inputParametersData.from_block;
                const to_block = inputParametersData.to_block;
                const from_date = inputParametersData.from_date;
                const to_date = inputParametersData.to_date;
                if (format)
                    queryParameters['format'] = format;
                if (marketplace)
                    queryParameters['marketplace'] = marketplace;
                if (providerUrl)
                    queryParameters['providerUrl'] = providerUrl;
                if (from_block)
                    queryParameters['from_block'] = from_block;
                if (to_block)
                    queryParameters['to_block'] = to_block;
                if (from_date)
                    queryParameters['from_date'] = Date.parse(from_date);
                if (to_date)
                    queryParameters['to_date'] = Date.parse(to_date);
            }
            else if (operation === 'getNFTLowestPrice') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/lowestprice`;
                const marketplace = inputParametersData.marketplace;
                const days = inputParametersData.format;
                const providerUrl = inputParametersData.providerUrl;
                if (days)
                    queryParameters['days'] = days;
                if (marketplace)
                    queryParameters['marketplace'] = marketplace;
                if (providerUrl)
                    queryParameters['providerUrl'] = providerUrl;
            }
            else if (operation === 'getNFTTransfersFromToBlock') {
                url = `https://deep-index.moralis.io/api/v2/nft/transfers`;
                const format = inputParametersData.format;
                const from_block = inputParametersData.from_block;
                const to_block = inputParametersData.to_block;
                const from_date = inputParametersData.from_date;
                const to_date = inputParametersData.to_date;
                if (format)
                    queryParameters['format'] = format;
                if (from_block)
                    queryParameters['from_block'] = from_block;
                if (to_block)
                    queryParameters['to_block'] = to_block;
                if (from_date)
                    queryParameters['from_date'] = Date.parse(from_date);
                if (to_date)
                    queryParameters['to_date'] = Date.parse(to_date);
            }
            else if (operation === 'getContractNFTs') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}`;
                const format = inputParametersData.format;
                const totalRanges = inputParametersData.totalRanges;
                const range = inputParametersData.range;
                if (format)
                    queryParameters['format'] = format;
                if (totalRanges)
                    queryParameters['totalRanges'] = totalRanges;
                if (range)
                    queryParameters['range'] = range;
            }
            else if (operation === 'getNFTContractTransfers') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/transfers`;
                const format = inputParametersData.format;
                if (format)
                    queryParameters['format'] = format;
            }
            else if (operation === 'getNFTOwners') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/owners`;
                const format = inputParametersData.format;
                if (format)
                    queryParameters['format'] = format;
            }
            else if (operation === 'getNFTMetadata') {
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/metadata`;
            }
            else if (operation === 'reSyncMetadata') {
                const address = inputParametersData.address;
                const token_id = inputParametersData.token_id;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}/metadata/resync`;
                const flag = inputParametersData.flag;
                const mode = inputParametersData.mode;
                if (flag)
                    queryParameters['flag'] = flag;
                if (mode)
                    queryParameters['mode'] = mode;
            }
            else if (operation === 'syncNFTContract') {
                method = 'PUT';
                const address = inputParametersData.address;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/sync`;
            }
            else if (operation === 'getNFTTokenIdMetadata') {
                const address = inputParametersData.address;
                const token_id = inputParametersData.token_id;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}`;
                const format = inputParametersData.format;
                if (format)
                    queryParameters['format'] = format;
            }
            else if (operation === 'getNFTTokenIdOwners') {
                const address = inputParametersData.address;
                const token_id = inputParametersData.token_id;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}/owners`;
                const format = inputParametersData.format;
                if (format)
                    queryParameters['format'] = format;
            }
            else if (operation === 'getNFTTokenIdTransfers') {
                const address = inputParametersData.address;
                const token_id = inputParametersData.token_id;
                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}/transfers`;
                const format = inputParametersData.format;
                const order = inputParametersData.order;
                if (format)
                    queryParameters['format'] = format;
                if (order)
                    queryParameters['order'] = order;
            }
            /**
             * defiOperation
             */
            if (operation === 'getPairReserves') {
                const pair_address = inputParametersData.pair_address;
                url = `https://deep-index.moralis.io/api/v2/${pair_address}/reserves`;
                const to_block = inputParametersData.to_block;
                const to_date = inputParametersData.to_date;
                if (to_block)
                    queryParameters['to_block'] = to_block;
                if (to_date)
                    queryParameters['to_date'] = Date.parse(to_date);
            }
            else if (operation === 'getPairAddress') {
                const token0_address = inputParametersData.token0_address;
                const token1_address = inputParametersData.token1_address;
                url = `https://deep-index.moralis.io/api/v2/${token0_address}/${token1_address}/pairAddress`;
                const to_block = inputParametersData.to_block;
                const to_date = inputParametersData.to_date;
                const exchange = inputParametersData.exchange;
                if (to_block)
                    queryParameters['to_block'] = to_block;
                if (to_date)
                    queryParameters['to_date'] = Date.parse(to_date);
                if (exchange)
                    queryParameters['exchange'] = exchange;
            }
            /**
             * ipfsOperation
             */
            if (api === 'uploadFolder') {
                method = 'POST';
                url = 'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder';
                const bodyParams = [];
                const folderContent = actionData.folderContent;
                const base64Array = JSON.parse(folderContent.replace(/\s/g, ''));
                for (let i = 0; i < base64Array.length; i += 1) {
                    const fileBase64 = base64Array[i];
                    const splitDataURI = fileBase64.split(',');
                    const filepath = (splitDataURI.pop() || 'filepath:').split(':')[1];
                    const content = splitDataURI.pop() || '';
                    bodyParams.push({
                        path: filepath,
                        content
                    });
                }
                queryBody = bodyParams;
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
module.exports = { nodeClass: Moralis };
//# sourceMappingURL=Moralis.js.map