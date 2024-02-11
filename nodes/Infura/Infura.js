"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const ChainNetwork_1 = require("../../src/ChainNetwork");
const ETHOperations_1 = require("../../src/ETHOperations");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const extendedOperation_1 = require("./extendedOperation");
class Infura {
    constructor() {
        this.loadMethods = {
            async getOperations(nodeData) {
                const returnData = [];
                const actionData = nodeData.actions;
                const networksData = nodeData.networks;
                const inputParametersData = nodeData.inputParameters;
                if (actionData === undefined || networksData === undefined || inputParametersData === undefined) {
                    return returnData;
                }
                const api = actionData.api;
                if (api === 'chainAPI') {
                    const network = networksData.network;
                    let totalOperations = [];
                    const chainCategory = inputParametersData.chainCategory;
                    const filteredOperations = ETHOperations_1.ethOperations.filter((op) => Object.prototype.hasOwnProperty.call(op.providerNetworks, 'infura') &&
                        op.providerNetworks['infura'].includes(network) &&
                        op.parentGroup === ETHOperations_1.operationCategoryMapping[chainCategory]);
                    if (network === ChainNetwork_1.NETWORK.MATIC || network === ChainNetwork_1.NETWORK.MATIC_MUMBAI) {
                        totalOperations = [...ETHOperations_1.polygonOperations, ...filteredOperations];
                    }
                    else {
                        totalOperations = filteredOperations;
                    }
                    for (const op of totalOperations) {
                        returnData.push({
                            label: op.name,
                            name: op.value,
                            parentGroup: op.parentGroup,
                            description: op.description,
                            inputParameters: op.inputParameters,
                            exampleParameters: op.exampleParameters,
                            exampleResponse: op.exampleResponse
                        });
                    }
                    return returnData;
                }
                else if (api === 'ipfsAPI') {
                    return extendedOperation_1.IPFSOperationsOptions;
                }
                else {
                    return returnData;
                }
            }
        };
        this.label = 'Infura';
        this.name = 'infura';
        this.icon = 'infura.svg';
        this.type = 'action';
        this.category = 'Network Provider';
        this.version = 1.1;
        this.description = 'Perform Infura onchain operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Chain API',
                        name: 'chainAPI',
                        description: 'API for fetching standard onchain data using Infura supported calls.'
                    },
                    {
                        label: 'IPFS API',
                        name: 'ipfsAPI',
                        description: 'API for interacting with IPFS, a distributed, peer-to-peer (p2p) storage network used for storing and accessing files, websites, applications, and data.'
                    }
                ],
                default: 'chainAPI'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Infura API Key',
                        name: 'infuraApi'
                    }
                ],
                default: 'infuraApi'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ChainNetwork_1.ETHNetworks, ...ChainNetwork_1.PolygonNetworks, ...ChainNetwork_1.ArbitrumNetworks, ...ChainNetwork_1.OptimismNetworks, ...ChainNetwork_1.AvalancheNetworks],
                show: {
                    'actions.api': ['chainAPI']
                }
            }
        ];
        this.inputParameters = [
            {
                label: 'Chain Category',
                name: 'chainCategory',
                type: 'options',
                options: [
                    {
                        label: 'Retrieving Blocks',
                        name: 'retrievingBlocks',
                        description: 'Retrieve onchain blocks data'
                    },
                    {
                        label: 'EVM/Smart Contract Execution',
                        name: 'evmExecution',
                        description: 'Execute or submit transaction onto blockchain'
                    },
                    {
                        label: 'Reading Transactions',
                        name: 'readingTransactions',
                        description: 'Read onchain transactions data'
                    },
                    {
                        label: 'Account Information',
                        name: 'accountInformation',
                        description: 'Retrieve onchain account information'
                    },
                    {
                        label: 'Event Logs',
                        name: 'eventLogs',
                        description: 'Fetch onchain logs'
                    },
                    {
                        label: 'Chain Information',
                        name: 'chainInformation',
                        description: 'Get general selected blockchain information'
                    },
                    {
                        label: 'Retrieving Uncles',
                        name: 'retrievingUncles',
                        description: 'Retrieve onchain uncles blocks data'
                    },
                    {
                        label: 'Filters',
                        name: 'filters',
                        description: 'Get block filters and logs, or create new filter'
                    }
                ],
                show: {
                    'actions.api': ['chainAPI']
                },
                default: 'retrievingBlocks'
            },
            {
                label: 'Operation',
                name: 'operation',
                type: 'asyncOptions',
                loadMethod: 'getOperations'
            },
            ...extendedOperation_1.fileParams,
            ...extendedOperation_1.argParams,
            ...extendedOperation_1.catParams,
            ...extendedOperation_1.dagParams,
            ...extendedOperation_1.getParams,
            ...extendedOperation_1.objectParams,
            ...extendedOperation_1.pinParams,
            {
                label: 'Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: '["param1", "param2"]',
                optional: true,
                description: 'Operation parameters in array. Ex: ["param1", "param2"]',
                show: {
                    'actions.api': ['chainAPI']
                }
            }
        ];
    }
    async run(nodeData) {
        const actionData = nodeData.actions;
        const networksData = nodeData.networks;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }
        // GET api
        const api = actionData.api;
        if (api === 'chainAPI') {
            // GET network
            const network = networksData.network;
            // GET credentials
            const apiKey = credentials.apiKey;
            // GET operation
            const operation = inputParametersData.operation;
            const uri = ChainNetwork_1.infuraHTTPAPIs[network] + apiKey;
            let responseData; // tslint:disable-line: no-any
            let bodyParameters = []; // tslint:disable-line: no-any
            const returnData = [];
            const parameters = inputParametersData.parameters;
            if (parameters) {
                try {
                    bodyParameters = JSON.parse(parameters.replace(/\s/g, ''));
                }
                catch (error) {
                    throw (0, utils_1.handleErrorMessage)(error);
                }
            }
            try {
                let totalOperations = [];
                if (api === 'chainAPI')
                    totalOperations = [...ETHOperations_1.polygonOperations, ...ETHOperations_1.ethOperations];
                const result = totalOperations.find((obj) => {
                    return obj.value === operation;
                });
                if (result === undefined)
                    throw new Error('Invalid Operation');
                const requestBody = JSON.parse(JSON.stringify(result.body));
                const bodyParams = requestBody.params;
                requestBody.params = Array.isArray(bodyParameters) ? bodyParameters.concat(bodyParams) : bodyParameters;
                const axiosConfig = {
                    method: result.method,
                    url: uri,
                    data: requestBody,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
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
        else if (api === 'ipfsAPI') {
            // GET credentials
            const apiKey = credentials.apiKey;
            const secretKey = credentials.secretKey;
            // GET operation
            const operation = inputParametersData.operation;
            let responseData; // tslint:disable-line: no-any
            const returnData = [];
            const apiUrl = 'https://ipfs.infura.io:5001/api';
            let url = '';
            const queryParameters = {};
            let queryBody = {};
            let method = 'POST';
            const headers = {
                'Content-Type': 'application/json',
                Authorization: Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
            };
            if (operation === 'block_get' || operation === 'block_stat') {
                const arg = inputParametersData.arg;
                queryParameters['arg'] = arg;
                method = 'POST';
                let endpoint = '';
                if (operation === 'block_stat') {
                    endpoint = 'block/stat';
                }
                else if (operation === 'block_get') {
                    endpoint = 'block/get';
                }
                url = `${apiUrl}/v0/${endpoint}`;
            }
            else if (operation === 'add' || operation === 'block_put' || operation === 'pin_add') {
                const fileBase64 = inputParametersData.file;
                const splitDataURI = fileBase64.split(',');
                const filename = (splitDataURI.pop() || 'filename:').split(':')[1];
                const bf = Buffer.from(splitDataURI.pop() || '', 'base64');
                const formData = new form_data_1.default();
                formData.append('file', bf, filename);
                method = 'POST';
                let endpoint = '';
                if (operation === 'add') {
                    endpoint = 'add';
                }
                else if (operation === 'block_put') {
                    endpoint = 'block/put';
                }
                else if (operation === 'pin_add') {
                    endpoint = 'pin/add';
                    const arg = inputParametersData.arg;
                    queryParameters['arg'] = arg;
                }
                url = `${apiUrl}/v0/${endpoint}`;
                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary();
                queryBody = formData;
            }
            else if (operation === 'dag_get' || operation === 'dag_resolve') {
                const arg = inputParametersData.arg;
                const outputCodec = inputParametersData['output-codec'];
                queryParameters['arg'] = arg;
                if (outputCodec)
                    queryParameters['output-codec'] = outputCodec;
                method = 'POST';
                let endpoint = '';
                if (operation === 'dag_get') {
                    endpoint = 'dag/get';
                }
                else if (operation === 'dag_resolve') {
                    endpoint = 'dag/resolve';
                }
                url = `${apiUrl}/v0/${endpoint}`;
            }
            else if (operation === 'dag_put') {
                const storeCodec = inputParametersData['store-codec'];
                const inputCodec = inputParametersData['input-codec'];
                const pin = inputParametersData.pin;
                const hash = inputParametersData.hash;
                if (storeCodec)
                    queryParameters['store-codec'] = storeCodec;
                if (inputCodec)
                    queryParameters['input-codec'] = inputCodec;
                if (pin)
                    queryParameters.pin = pin;
                if (hash)
                    queryParameters.hash = hash;
                const fileBase64 = inputParametersData.file;
                const splitDataURI = fileBase64.split(',');
                const filename = (splitDataURI.pop() || 'filename:').split(':')[1];
                const bf = Buffer.from(splitDataURI.pop() || '', 'base64');
                const formData = new form_data_1.default();
                formData.append('file', bf, filename);
                method = 'POST';
                url = `${apiUrl}/v0/dag/put`;
                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary();
                queryBody = formData;
            }
            else if (operation === 'object_data' || operation === 'object_stat' || operation === 'object_get') {
                /*
            else if (operation === 'get') {

                const arg = inputParametersData.arg as string;
                const output = inputParametersData.output as string;
                const archive = inputParametersData.archive as boolean;
                const compress = inputParametersData.compress as boolean;
                const compressionLevel = inputParametersData['compression-level'] as number;

                queryParameters['arg'] = arg;
                if (output) queryParameters['output'] = output;
                if (archive) queryParameters['archive'] = archive;
                if (compress) queryParameters['compress'] = compress;
                if (compressionLevel) queryParameters['compressionLevel'] = compressionLevel;

                method = 'POST';
                url = `${apiUrl}/v0/get`;
            }
            */
                const arg = inputParametersData.arg;
                queryParameters['arg'] = arg;
                method = 'POST';
                let endpoint = '';
                if (operation === 'object_data') {
                    endpoint = 'object/data';
                }
                else if (operation === 'object_get') {
                    endpoint = 'object/get';
                }
                else if (operation === 'object_stat') {
                    endpoint = 'object/stat';
                }
                url = `${apiUrl}/v0/${endpoint}`;
            }
            else if (operation === 'object_put') {
                const inputenc = inputParametersData.inputenc;
                const datafieldenc = inputParametersData.datafieldenc;
                const pin = inputParametersData.pin;
                if (inputenc)
                    queryParameters.inputenc = inputenc;
                if (datafieldenc)
                    queryParameters.datafieldenc = datafieldenc;
                if (pin)
                    queryParameters.pin = pin;
                const fileBase64 = inputParametersData.file;
                const splitDataURI = fileBase64.split(',');
                const filename = (splitDataURI.pop() || 'filename:').split(':')[1];
                const bf = Buffer.from(splitDataURI.pop() || '', 'base64');
                const formData = new form_data_1.default();
                formData.append('file', bf, filename);
                method = 'POST';
                url = `${apiUrl}/v0/object/put`;
                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary();
                queryBody = formData;
            }
            else if (operation === 'pin_ls' || operation === 'pin_rm') {
                const arg = inputParametersData.arg;
                const type = inputParametersData.type;
                queryParameters['arg'] = arg;
                if (type)
                    queryParameters['type'] = type;
                method = 'POST';
                let endpoint = '';
                if (operation === 'pin_ls') {
                    endpoint = 'pin/ls';
                }
                else if (operation === 'pin_rm') {
                    endpoint = 'pin/rm';
                }
                url = `${apiUrl}/v0/${endpoint}`;
            }
            try {
                const result = extendedOperation_1.IPFSOperationsOptions.find((obj) => {
                    return obj.name === operation;
                });
                if (result === undefined)
                    throw new Error('Invalid Operation');
                const axiosConfig = {
                    method,
                    url,
                    params: queryParameters,
                    paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                    headers,
                    data: queryBody
                };
                if (operation === 'cat' || operation === 'get') {
                    const arg = inputParametersData.arg;
                    const ipfsURL = `https://ipfs.infura.io/ipfs/${arg}`;
                    const axiosConfig = {
                        method: 'HEAD',
                        url: ipfsURL
                    };
                    const ipfsResponse = await (0, axios_1.default)(axiosConfig);
                    const mimeType = ipfsResponse.headers['content-type'];
                    const attachment = {
                        content: ipfsURL,
                        contentType: mimeType
                    };
                    const returnData = {};
                    returnData.ipfsURL = ipfsURL;
                    returnData.attachments = [attachment];
                    return (0, utils_1.returnNodeExecutionData)(returnData);
                }
                else {
                    const response = await (0, axios_1.default)(axiosConfig);
                    responseData = response.data;
                }
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
        /*
        else if (api === 'filecoinAPI') {
         
            // GET credentials
            const apiKey = credentials.apiKey as string;
            const secretKey = credentials.secretKey as string;

            // GET operation
            const operation = inputParametersData.operation as string;

            let responseData: any; // tslint:disable-line: no-any
            const returnData: ICommonObject[] = [];
            const url = `https://${apiKey}:${secretKey}@filecoin.infura.io`;
            const queryParameters: ICommonObject = {};
            const queryBody: any = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "",
                "params": []
            };
            const method: Method = 'POST';
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
            };

            if (operation === 'ChainHead') {
                queryBody["method"] = `Filecoin.${operation}`;
            }

            try {
                const result = FilecoinOperationsOptions.find(obj => {
                    return obj.name === operation
                });

                if (result === undefined) throw new Error('Invalid Operation');

                const axiosConfig: AxiosRequestConfig = {
                    method,
                    url,
                    params: queryParameters,
                    paramsSerializer: params => serializeQueryParams(params),
                    headers,
                    data: queryBody
                }

                const response = await axios(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
                throw handleErrorMessage(error);
            }

            if (Array.isArray(responseData)) returnData.push(...responseData);
            else returnData.push(responseData);

            return returnNodeExecutionData(returnData);
        }
        */
        return (0, utils_1.returnNodeExecutionData)([]);
    }
}
module.exports = { nodeClass: Infura };
//# sourceMappingURL=Infura.js.map