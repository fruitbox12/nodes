import { INodeOptionsValue } from '../../src';
import { NETWORK } from '../../src/ChainNetwork';
export type prebuiltType = 'edition' | 'edition-drop' | 'marketplace' | 'multiwrap' | 'nft-collection' | 'nft-drop' | 'pack' | 'signature-drop' | 'split' | 'token' | 'token-drop' | 'vote';
export declare const ThirdWebSupportedNetworks: INodeOptionsValue[];
export declare const ThirdWebSupportedPrebuiltContract: INodeOptionsValue[];
interface IThirdWebNetwork {
    [key: string]: NETWORK;
}
export declare const networkLookup: IThirdWebNetwork;
export declare const nftDropEvents: INodeOptionsValue[];
export declare const nftCollectionEvents: INodeOptionsValue[];
export declare const marketplaceEvents: INodeOptionsValue[];
export declare const editionDropEvents: INodeOptionsValue[];
export declare const tokenEvents: INodeOptionsValue[];
export declare const tokenDropEvents: INodeOptionsValue[];
export declare const editionEvents: INodeOptionsValue[];
export declare const multiWrapEvents: INodeOptionsValue[];
export declare const packEvents: INodeOptionsValue[];
export declare const signatureDropEvents: INodeOptionsValue[];
export declare const splitEvents: INodeOptionsValue[];
export declare const voteEvents: INodeOptionsValue[];
export {};
