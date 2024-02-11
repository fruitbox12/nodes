import { ICommonObject, INodeExecutionData, IWebhookNodeExecutionData, IOAuth2RefreshResponse } from './Interface';
export declare const OAUTH2_REFRESHED = "oAuth2RefreshedData";
export declare const numberOrExpressionRegex = "^(\\d+\\.?\\d*|{{.*}})$";
export declare const notEmptyRegex = "(.|\\s)*\\S(.|\\s)*";
/**
 * Return responses as INodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @returns {INodeExecutionData[]}
 */
export declare function returnNodeExecutionData(responseData: ICommonObject | ICommonObject[], oAuth2RefreshedData?: any): INodeExecutionData[];
/**
 * Return responses as IWebhookNodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @param {string} webhookReturnResponse
 * @returns {IWebhookNodeExecutionData[]}
 */
export declare function returnWebhookNodeExecutionData(responseData: ICommonObject | ICommonObject[], webhookReturnResponse?: string): IWebhookNodeExecutionData[];
/**
 * Serialize axios query params
 *
 * @export
 * @param {any} params
 * @param {boolean} skipIndex // Set to true if you want same params to be: param=1&param=2 instead of: param[0]=1&param[1]=2
 * @returns {string}
 */
export declare function serializeQueryParams(params: any, skipIndex?: boolean): string;
/**
 * Handle error from try catch
 *
 * @export
 * @param {any} error
 * @returns {string}
 */
export declare function handleErrorMessage(error: any): string;
/**
 * Refresh access_token for oAuth2 apps
 *
 * @export
 * @param {ICommonObject} credentials
 */
export declare function refreshOAuth2Token(credentials: ICommonObject): Promise<IOAuth2RefreshResponse>;
/**
 * Returns the path of node modules package
 * @param {string} packageName
 * @returns {string}
 */
export declare const getNodeModulesPackagePath: (packageName: string) => string;
/**
 * Verify valid keys
 * @param {string} storedKey
 * @param {string} suppliedKey
 * @returns {boolean}
 */
export declare const compareKeys: (storedKey: string, suppliedKey: string) => boolean;
