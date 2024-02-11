"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareKeys = exports.getNodeModulesPackagePath = exports.refreshOAuth2Token = exports.handleErrorMessage = exports.serializeQueryParams = exports.returnWebhookNodeExecutionData = exports.returnNodeExecutionData = exports.notEmptyRegex = exports.numberOrExpressionRegex = exports.OAUTH2_REFRESHED = void 0;
const axios_1 = __importDefault(require("axios"));
const client_oauth2_1 = __importDefault(require("client-oauth2"));
const form_data_1 = __importDefault(require("form-data"));
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.OAUTH2_REFRESHED = 'oAuth2RefreshedData';
exports.numberOrExpressionRegex = '^(\\d+\\.?\\d*|{{.*}})$'; //return true if string consists only numbers OR expression {{}}
exports.notEmptyRegex = '(.|\\s)*\\S(.|\\s)*'; //return true if string is not empty or blank
/**
 * Return responses as INodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @returns {INodeExecutionData[]}
 */
function returnNodeExecutionData(responseData, oAuth2RefreshedData) {
    const returnData = [];
    if (!Array.isArray(responseData)) {
        responseData = [responseData];
    }
    responseData.forEach((data) => {
        const obj = { data };
        if (data && data.attachments) {
            if (Array.isArray(data.attachments) && data.attachments.length)
                obj.attachments = data.attachments;
            else if (!Array.isArray(data.attachments))
                obj.attachments = data.attachments;
        }
        if (data && data.html)
            obj.html = data.html;
        if (oAuth2RefreshedData && Object.keys(oAuth2RefreshedData).length > 0)
            obj[exports.OAUTH2_REFRESHED] = oAuth2RefreshedData;
        returnData.push(obj);
    });
    return returnData;
}
exports.returnNodeExecutionData = returnNodeExecutionData;
/**
 * Return responses as IWebhookNodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @param {string} webhookReturnResponse
 * @returns {IWebhookNodeExecutionData[]}
 */
function returnWebhookNodeExecutionData(responseData, webhookReturnResponse) {
    const returnData = [];
    if (!Array.isArray(responseData)) {
        responseData = [responseData];
    }
    responseData.forEach((data) => {
        const returnObj = {
            data
        };
        if (webhookReturnResponse)
            returnObj.response = webhookReturnResponse;
        returnData.push(returnObj);
    });
    return returnData;
}
exports.returnWebhookNodeExecutionData = returnWebhookNodeExecutionData;
/**
 * Serialize axios query params
 *
 * @export
 * @param {any} params
 * @param {boolean} skipIndex // Set to true if you want same params to be: param=1&param=2 instead of: param[0]=1&param[1]=2
 * @returns {string}
 */
function serializeQueryParams(params, skipIndex) {
    const parts = [];
    const encode = (val) => {
        return encodeURIComponent(val)
            .replace(/%3A/gi, ':')
            .replace(/%24/g, '$')
            .replace(/%2C/gi, ',')
            .replace(/%20/g, '+')
            .replace(/%5B/gi, '[')
            .replace(/%5D/gi, ']');
    };
    const convertPart = (key, val) => {
        if (val instanceof Date)
            val = val.toISOString();
        else if (val instanceof Object)
            val = JSON.stringify(val);
        parts.push(encode(key) + '=' + encode(val));
    };
    Object.entries(params).forEach(([key, val]) => {
        if (val === null || typeof val === 'undefined')
            return;
        if (Array.isArray(val))
            val.forEach((v, i) => convertPart(`${key}${skipIndex ? '' : `[${i}]`}`, v));
        else
            convertPart(key, val);
    });
    return parts.join('&');
}
exports.serializeQueryParams = serializeQueryParams;
/**
 * Handle error from try catch
 *
 * @export
 * @param {any} error
 * @returns {string}
 */
function handleErrorMessage(error) {
    let errorMessage = '';
    if (error.message) {
        errorMessage += error.message + '. ';
    }
    if (error.response && error.response.data) {
        if (error.response.data.error) {
            if (typeof error.response.data.error === 'object')
                errorMessage += JSON.stringify(error.response.data.error) + '. ';
            else if (typeof error.response.data.error === 'string')
                errorMessage += error.response.data.error + '. ';
        }
        else if (error.response.data.msg)
            errorMessage += error.response.data.msg + '. ';
        else if (error.response.data.Message)
            errorMessage += error.response.data.Message + '. ';
        else if (typeof error.response.data === 'string')
            errorMessage += error.response.data + '. ';
    }
    if (!errorMessage)
        errorMessage = 'Unexpected Error.';
    return errorMessage;
}
exports.handleErrorMessage = handleErrorMessage;
/**
 * Refresh access_token for oAuth2 apps
 *
 * @export
 * @param {ICommonObject} credentials
 */
async function refreshOAuth2Token(credentials) {
    const accessTokenUrl = credentials.accessTokenUrl;
    const authUrl = credentials.authUrl;
    const client_id = credentials.clientID;
    const client_secret = credentials.clientSecret;
    const refreshToken = credentials.refresh_token;
    const accessToken = credentials.access_token;
    const tokenType = credentials.token_type;
    return await refreshThroughClient(client_id, client_secret, accessTokenUrl, authUrl, accessToken, refreshToken, tokenType);
}
exports.refreshOAuth2Token = refreshOAuth2Token;
const refreshThroughClient = async (client_id, client_secret, accessTokenUrl, authUrl, accessToken, refreshToken, tokenType) => {
    try {
        const oAuth2Parameters = {
            clientId: client_id,
            clientSecret: client_secret,
            accessTokenUri: accessTokenUrl,
            authorizationUri: authUrl
        };
        const oAuthObj = new client_oauth2_1.default(oAuth2Parameters);
        const { data } = await oAuthObj.credentials.getToken();
        const tokenInstance = oAuthObj.createToken(accessToken, refreshToken, tokenType, data);
        const newToken = await tokenInstance.refresh();
        const { access_token, expires_in } = newToken.data;
        const returnItem = {
            access_token,
            expires_in
        };
        return returnItem;
    }
    catch (e) {
        return await refreshThroughHttpBody(client_id, client_secret, accessTokenUrl, refreshToken);
    }
};
const refreshThroughHttpBody = async (client_id, client_secret, accessTokenUrl, refreshToken) => {
    const method = 'POST';
    const axiosConfig = {
        method,
        url: accessTokenUrl,
        data: {
            grant_type: 'refresh_token',
            client_id,
            client_secret,
            refresh_token: refreshToken
        },
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };
    try {
        const response = await (0, axios_1.default)(axiosConfig);
        const refreshedTokenResp = response.data;
        const returnItem = {
            access_token: refreshedTokenResp.access_token,
            expires_in: refreshedTokenResp.expires_in
        };
        return returnItem;
    }
    catch (e) {
        return await refreshThroughHttpHeader(client_id, client_secret, accessTokenUrl, refreshToken);
    }
};
const refreshThroughHttpHeader = async (client_id, client_secret, accessTokenUrl, refreshToken) => {
    const method = 'POST';
    const formData = new form_data_1.default();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);
    const axiosConfig = {
        method,
        url: accessTokenUrl,
        data: formData,
        headers: Object.assign(Object.assign({}, formData.getHeaders()), { Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}` })
    };
    try {
        const response = await (0, axios_1.default)(axiosConfig);
        const refreshedTokenResp = response.data;
        const returnItem = {
            access_token: refreshedTokenResp.access_token,
            expires_in: refreshedTokenResp.expires_in
        };
        return returnItem;
    }
    catch (e) {
        throw handleErrorMessage(e);
    }
};
/**
 * Returns the path of node modules package
 * @param {string} packageName
 * @returns {string}
 */
const getNodeModulesPackagePath = (packageName) => {
    const checkPaths = [
        path.join(__dirname, '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', '..', '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', packageName)
    ];
    for (const checkPath of checkPaths) {
        if (fs.existsSync(checkPath)) {
            return checkPath;
        }
    }
    return '';
};
exports.getNodeModulesPackagePath = getNodeModulesPackagePath;
/**
 * Verify valid keys
 * @param {string} storedKey
 * @param {string} suppliedKey
 * @returns {boolean}
 */
const compareKeys = (storedKey, suppliedKey) => {
    const [hashedPassword, salt] = storedKey.split('.');
    const buffer = (0, crypto_1.scryptSync)(suppliedKey, salt, 64);
    return (0, crypto_1.timingSafeEqual)(Buffer.from(hashedPassword, 'hex'), buffer);
};
exports.compareKeys = compareKeys;
//# sourceMappingURL=utils.js.map