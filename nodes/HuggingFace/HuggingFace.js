"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class HuggingFace {
    constructor() {
        this.loadMethods = {
            async listModels(nodeData) {
                const returnData = [];
                const actionsData = nodeData.actions;
                if (actionsData === undefined)
                    return returnData;
                const category = actionsData.category;
                try {
                    const axiosConfig = {
                        method: 'GET',
                        url: `https://huggingface.co/api/models?filter=${category}&sort=downloads&direction=-1&limit=30`,
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        }
                    };
                    const response = await (0, axios_1.default)(axiosConfig);
                    const models = response.data;
                    for (let i = 0; i < models.length; i += 1) {
                        const splitedModel = models[i].id.split('/');
                        const modelName = splitedModel.length > 1 ? splitedModel[1] : splitedModel[0];
                        const modelAuthor = splitedModel.length > 1 ? splitedModel[0] : 'HuggingFace';
                        const data = {
                            label: modelName,
                            name: models[i].id,
                            description: `${modelAuthor} (${models[i].downloads} downloads)`
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
        this.label = 'Hugging Face';
        this.name = 'huggingFace';
        this.icon = 'huggingface.png';
        this.type = 'action';
        this.category = 'Artificial Intelligence';
        this.version = 1.0;
        this.description = 'Execute HuggingFace Inference API';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Category',
                name: 'category',
                type: 'options',
                options: [
                    {
                        label: 'Image Classification',
                        name: 'image-classification'
                    },
                    {
                        label: 'Feature Extraction',
                        name: 'feature-extraction'
                    },
                    {
                        label: 'Object Detection',
                        name: 'object-detection'
                    },
                    {
                        label: 'Text Classification',
                        name: 'text-classification'
                    }
                ]
            },
            {
                label: 'Model',
                name: 'model',
                type: 'asyncOptions',
                loadMethod: 'listModels'
            },
            {
                label: 'Image File',
                name: 'imageFile',
                type: 'file',
                show: {
                    'actions.category': ['image-classification', 'object-detection']
                }
            },
            {
                label: 'Input Text',
                name: 'inputText',
                type: 'string',
                rows: 5,
                show: {
                    'actions.category': ['feature-extraction', 'text-classification']
                }
            },
            {
                label: 'Inference Endpoint',
                name: 'inferenceURL',
                type: 'string',
                optional: true,
                description: 'If this is not specify, the default free URL with limited usage will be used'
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'string',
                options: [
                    {
                        label: 'HuggingFace Access Token',
                        name: 'huggingFaceAccessToken'
                    }
                ],
                default: 'huggingFaceAccessToken'
            }
        ];
    }
    async run(nodeData) {
        const credentials = nodeData.credentials;
        const actionsData = nodeData.actions;
        if (actionsData === undefined) {
            throw new Error('Required data missing');
        }
        if (credentials === undefined) {
            throw new Error('Missing credential');
        }
        let responseData;
        const returnData = [];
        const model = actionsData.model;
        const imageFile = actionsData.imageFile;
        const inputText = actionsData.inputText;
        const inferenceURL = actionsData.inferenceURL;
        const url = inferenceURL || `https://api-inference.huggingface.co/models/${model}`;
        if (inputText) {
            const data = { inputs: inputText };
            try {
                const axiosConfig = {
                    method: 'POST',
                    url,
                    data,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${credentials.accessToken}`
                    }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
                throw (0, utils_1.handleErrorMessage)(error);
            }
        }
        else if (imageFile) {
            const splitDataURI = imageFile.split(',');
            const filename = (splitDataURI.pop() || 'filename:').split(':')[1];
            const bf = Buffer.from(splitDataURI.pop() || '', 'base64');
            const formData = new form_data_1.default();
            formData.append('file', bf, filename);
            try {
                const axiosConfig = {
                    method: 'POST',
                    url,
                    data: bf,
                    headers: {
                        Authorization: `Bearer ${credentials.accessToken}`
                    }
                };
                const response = await (0, axios_1.default)(axiosConfig);
                responseData = response.data;
            }
            catch (error) {
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
module.exports = { nodeClass: HuggingFace };
//# sourceMappingURL=HuggingFace.js.map
