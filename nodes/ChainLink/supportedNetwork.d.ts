import { INodeOptionsValue } from '../../src';
import { NETWORK } from '../../src/ChainNetwork';
export type IChainLinkNetworkMapping = {
    [key in NETWORK]: string;
};
export declare const chainLinkNetworkMapping: IChainLinkNetworkMapping;
export declare const chainLinkNetworks: INodeOptionsValue[];
