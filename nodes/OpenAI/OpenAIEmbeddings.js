"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const { OpenAIEmbeddings } = require("@langchain/openai");

class OpenAIEmbeddingsNode {
    constructor() {
        this.loadMethods = {
            async listModels(nodeData) {
                const returnData = [];
                const credentials = nodeData.credentials;
                if (!credentials) return returnData;
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://api.openai.com/v1/models`,
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Authorization: `Bearer ${credentials.apiKey}`
                        }
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const responseData = response.data;
                    const models = responseData.data;
                    for (let i = 0; i < models.length; i += 1) {
                        const data = {
                            label: models[i].id,
                            name: models[i].id
                        };
                        returnData.push(data);
                    }
                    return returnData;
                } catch (e) {
                    return returnData;
                }
            }
        };
        this.label = 'OpenAI Embeddings';
        this.name = 'openAIEmbeddings';
        this.icon = 'openai.png';
        this.type = 'action';
        this.category = 'Artificial Intelligence';
        this.version = 1.0;
        this.description = 'Generate embeddings for a given text using OpenAI API';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Generate Embeddings',
                        name: 'generateEmbeddings'
                    }
                ]
            }
        ];
        this.credentials = [
            {
                label: 'API Key',
                name: 'credentialMethod',
                type: 'string',
                default: '',
                placeholder: 'Enter your OpenAI API Key',
                description: 'OpenAI API Key to use for authentication.'
            }
        ];
        this.inputParameters = [
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'asyncOptions',
                loadMethod: 'listModels',
                description: 'The OpenAI model to use for generating embeddings.',
                default: 'text-embedding-ada-002',
                show: {
                    'actions.operation': ['generateEmbeddings']
                }
            },
            {
                label: 'Text',
                name: 'text',
                type: 'string',
                default: '',
                placeholder: 'Enter the text to generate embeddings for',
                description: 'The input text for generating embeddings.',
                show: {
                    'actions.operation': ['generateEmbeddings']
                }
            },
            {
                label: 'Strip New Lines',
                name: 'stripNewLines',
                type: 'boolean',
                optional: true,
                additionalParams: true,
                description: 'Whether to strip new lines from the input text.',
                show: {
                    'actions.operation': ['generateEmbeddings']
                }
            },
            {
                label: 'Batch Size',
                name: 'batchSize',
                type: 'number',
                optional: true,
                additionalParams: true,
                description: 'The batch size for generating embeddings.',
                show: {
                    'actions.operation': ['generateEmbeddings']
                }
            },
            {
                label: 'Timeout',
                name: 'timeout',
                type: 'number',
                optional: true,
                additionalParams: true,
                description: 'The timeout for the API call.',
                show: {
                    'actions.operation': ['generateEmbeddings']
                }
            },
            {
                label: 'Base Path',
                name: 'basepath',
                type: 'string',
                optional: true,
                additionalParams: true,
                description: 'The base path for the OpenAI API.',
                show: {
                    'actions.operation': ['generateEmbeddings']
                }
            }
        ];
    }

    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        const actionsData = nodeData.actions;
        if (!inputParametersData || !actionsData) {
            throw new Error('Required data missing');
        }
        if (!credentials) {
            throw new Error('Missing credential');
        }
        const returnData = [];
        const operation = actionsData.operation;
        const modelName = inputParametersData.modelName;
        const text = inputParametersData.text;
        const stripNewLines = inputParametersData.stripNewLines;
        const batchSize = inputParametersData.batchSize;
        const timeout = inputParametersData.timeout;
        const basepath = inputParametersData.basepath;

        if (operation !== 'generateEmbeddings') {
            throw new Error('Invalid operation');
        }

        const obj = {
            apiKey: credentials.apiKey,
            modelName,
            stripNewLines,
            batchSize,
            timeout
        };

        try {
            const model = new OpenAIEmbeddings(obj, { basePath: basepath });
            const embeddings = await model.embedQuery(text);
            returnData.push(embeddings);
        } catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }

        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}

module.exports = { nodeClass: OpenAIEmbeddingsNode };
//# sourceMappingURL=OpenAIEmbeddings.js.map
