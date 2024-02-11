export interface INativeTokens {
    [key: string]: IToken;
}
export interface IToken {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    chainId: number;
}
export declare const nativeTokens: INativeTokens;
