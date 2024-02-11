"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const jimp_1 = __importDefault(require("jimp"));
const util_1 = require("util");
class ImageEditor {
    constructor() {
        this.label = 'ImageEditor';
        this.name = 'imageEditor';
        this.icon = 'image-editor.svg';
        this.type = 'action';
        this.category = 'Utilities';
        this.version = 1.0;
        this.description = 'Edit image with different manipulation methods';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Selection Method',
                name: 'method',
                type: 'options',
                options: [
                    {
                        label: 'Crop',
                        name: 'crop',
                        description: 'Crop image'
                    },
                    {
                        label: 'Blur',
                        name: 'blur',
                        description: 'Quickly blur an image'
                    },
                    {
                        label: 'Gaussian',
                        name: 'gaussian',
                        description: 'Hardcore blur'
                    },
                    {
                        label: 'Invert',
                        name: 'invert',
                        description: 'Invert an images colors'
                    },
                    {
                        label: 'Resize',
                        name: 'resize',
                        description: 'Resize an image'
                    },
                    {
                        label: 'Cover',
                        name: 'cover',
                        description: 'Scale the image so the given width and height keeping the aspect ratio'
                    },
                    {
                        label: 'Rotate',
                        name: 'rotate',
                        description: 'Rotate an image'
                    },
                    {
                        label: 'Normalize',
                        name: 'normalize',
                        description: 'Normalize the colors in an image'
                    },
                    {
                        label: 'Dither',
                        name: 'dither',
                        description: 'Apply a dither effect to an image'
                    },
                    {
                        label: 'Scale',
                        name: 'scale',
                        description: 'Uniformly scales the image by a factor'
                    }
                ]
            },
            {
                label: 'Image Raw Data (Base64)',
                name: 'rawData',
                type: 'string',
                placeholder: 'data:image/png;base64,<base64_string>'
            }
        ];
        this.inputParameters = [
            /**
             * Blur or Gaussian
             */
            {
                label: 'Blur Pixel Radius',
                name: 'blurPixel',
                type: 'number',
                default: 5,
                show: {
                    'actions.method': ['blur', 'gaussian']
                },
                description: 'The pixel radius of the blur'
            },
            /**
             * Crop
             */
            {
                label: 'Width',
                name: 'width',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['crop']
                },
                description: 'Crop width'
            },
            {
                label: 'Height',
                name: 'height',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['crop']
                },
                description: 'Crop height'
            },
            {
                label: 'Position X',
                name: 'positionX',
                type: 'number',
                default: 10,
                show: {
                    'actions.method': ['crop']
                },
                description: 'X (horizontal) position to crop from'
            },
            {
                label: 'Position Y',
                name: 'positionY',
                type: 'number',
                default: 10,
                show: {
                    'actions.method': ['crop']
                },
                description: 'Y (vertical) position to crop from'
            },
            /**
             * Resize or Cover
             */
            {
                label: 'Width',
                name: 'width',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['resize', 'cover']
                },
                description: 'Resize width'
            },
            {
                label: 'Height',
                name: 'height',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['resize', 'cover']
                },
                description: 'Resize height'
            },
            /**
             * Rotate
             */
            {
                label: 'Rotation Degree',
                name: 'degree',
                type: 'number',
                default: 90,
                show: {
                    'actions.method': ['rotate']
                }
            },
            /**
             * Scale
             */
            {
                label: 'Scale Factor',
                name: 'factor',
                type: 'number',
                default: 2,
                show: {
                    'actions.method': ['scale']
                }
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const actionsData = nodeData.actions;
        if (inputParametersData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }
        const returnData = {};
        const rawData = actionsData.rawData;
        const method = actionsData.method;
        try {
            const imageData = rawData.split(',').pop() || '';
            const image = await jimp_1.default.read(Buffer.from(imageData, 'base64'));
            if (method === 'crop') {
                const positionX = parseInt(inputParametersData.positionX, 10);
                const positionY = parseInt(inputParametersData.positionY, 10);
                const height = parseInt(inputParametersData.height, 10);
                const width = parseInt(inputParametersData.width, 10);
                image.crop(positionX, positionY, width, height, (err) => {
                    if (err)
                        throw (0, utils_1.handleErrorMessage)(err);
                });
            }
            else if (method === 'blur' || method === 'gaussian') {
                const blurPixel = parseInt(inputParametersData.blurPixel, 10);
                if (method === 'blur') {
                    image.blur(blurPixel, (err) => {
                        if (err)
                            throw (0, utils_1.handleErrorMessage)(err);
                    });
                }
                else if (method === 'gaussian') {
                    image.gaussian(blurPixel, (err) => {
                        if (err)
                            throw (0, utils_1.handleErrorMessage)(err);
                    });
                }
            }
            else if (method === 'invert') {
                image.invert((err) => {
                    if (err)
                        throw (0, utils_1.handleErrorMessage)(err);
                });
            }
            else if (method === 'resize' || method === 'cover') {
                const height = parseInt(inputParametersData.height, 10);
                const width = parseInt(inputParametersData.width, 10);
                if (method === 'resize') {
                    image.resize(width, height, (err) => {
                        if (err)
                            throw (0, utils_1.handleErrorMessage)(err);
                    });
                }
                else if (method === 'cover') {
                    image.cover(width, height, (err) => {
                        if (err)
                            throw (0, utils_1.handleErrorMessage)(err);
                    });
                }
            }
            else if (method === 'rotate') {
                const degree = parseInt(inputParametersData.degree, 10);
                image.rotate(degree, (err) => {
                    if (err)
                        throw (0, utils_1.handleErrorMessage)(err);
                });
            }
            else if (method === 'normalize') {
                image.normalize((err) => {
                    if (err)
                        throw (0, utils_1.handleErrorMessage)(err);
                });
            }
            else if (method === 'dither') {
                image.dither565((err) => {
                    if (err)
                        throw (0, utils_1.handleErrorMessage)(err);
                });
            }
            else if (method === 'scale') {
                const factor = parseInt(inputParametersData.factor, 10);
                image.scale(factor, (err) => {
                    if (err)
                        throw (0, utils_1.handleErrorMessage)(err);
                });
            }
            const toBase64 = (0, util_1.promisify)(image.getBase64).bind(image);
            const mimeType = rawData.split(',')[0].split(';')[0].split(':')[1];
            const finalImage = await toBase64(mimeType);
            const attachment = {
                contentType: mimeType,
                content: finalImage
            };
            returnData['data'] = finalImage;
            returnData.attachments = [attachment];
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: ImageEditor };
//# sourceMappingURL=ImageEditor.js.map