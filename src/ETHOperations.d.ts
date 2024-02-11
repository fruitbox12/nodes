import { ICommonObject } from '.';
import { NETWORK } from './ChainNetwork';
export interface IETHOperation {
    name: string;
    value: string;
    parentGroup?: string;
    description?: string;
    body: ICommonObject;
    method: string;
    providerNetworks: {
        [key: string]: NETWORK[];
    };
    overrideUrl?: string;
    inputParameters?: string;
    exampleParameters?: string;
    outputResponse?: string;
    exampleResponse?: ICommonObject;
}
export declare const operationCategoryMapping: any;
export declare const alchemySupportedNetworks: NETWORK[];
export declare const infuraSupportedNetworks: NETWORK[];
export declare const qnSupportedNetworks: NETWORK[];
export declare const ethOperations: IETHOperation[];
export declare const polygonOperations: IETHOperation[];
