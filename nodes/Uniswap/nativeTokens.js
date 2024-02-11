"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeTokens = void 0;
const simple_uniswap_sdk_1 = require("simple-uniswap-sdk");
exports.nativeTokens = {
    homestead: {
        address: simple_uniswap_sdk_1.ETH.MAINNET().contractAddress,
        symbol: 'ETH',
        name: 'ETH',
        decimals: 18,
        chainId: simple_uniswap_sdk_1.ChainId.MAINNET
    },
    goerli: {
        address: simple_uniswap_sdk_1.ETH.GORLI().contractAddress,
        symbol: 'ETH',
        name: 'ETH',
        decimals: 18,
        chainId: simple_uniswap_sdk_1.ChainId.GÖRLI
    }
};
//# sourceMappingURL=nativeTokens.js.map