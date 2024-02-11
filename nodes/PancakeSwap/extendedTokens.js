"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeTokens = void 0;
const src_1 = require("../../src");
exports.nativeTokens = {
    [src_1.NETWORK.BSC]: {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_ETH',
        symbol: 'BNB',
        name: 'BNB',
        decimals: 18,
        chainId: src_1.CHAIN_ID.BINANCE_MAINNET
    },
    [src_1.NETWORK.BSC_TESTNET]: {
        address: '0xae13d989dac2f0debff460ac112a837c89baa7cd_ETH',
        symbol: 'BNB',
        name: 'BNB',
        decimals: 18,
        chainId: src_1.CHAIN_ID.BINANCE_TESTNET
    }
};
//# sourceMappingURL=extendedTokens.js.map