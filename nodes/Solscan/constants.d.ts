export declare const OPERATION: {
    readonly GET_TOKEN_BALANCES: "getTokenBalances";
    readonly GET_TRANSACTIONS: "getTransactions";
    readonly GET_STAKING_ACCOUNTS: "getStakingAccounts";
    readonly GET_TOKEN_TRANSFERS: "getTokenTransfers";
    readonly GET_SOL_TRANSFERS: "getSolTransfers";
    readonly GET_ACCOUNT_INFO: "getAccountInfo";
    readonly GET_LAST_TRANSACTIONS: "getLastTransactions";
    readonly GET_TRANSACTION_INFO: "getTransactionInfo";
    readonly GET_TOKEN_HOLDER: "getTokenHolder";
    readonly GET_TOKEN_INFO: "getTokenInfo";
    readonly GET_TOKENS: "getTokens";
    readonly GET_TOKEN_MARKET_INFO: "getMarketTokenInfo";
    readonly GET_CHAIN_INFO: "getChainInfo";
};
export declare const SORT_BY: readonly [{
    readonly label: "Market cap";
    readonly name: "market_cap";
}, {
    readonly label: "Volume";
    readonly name: "volume";
}, {
    readonly label: "Holder";
    readonly name: "holder";
}, {
    readonly label: "Price";
    readonly name: "price";
}, {
    readonly label: "Price change 24 h";
    readonly name: "price_change_24h";
}, {
    readonly label: "Price change 7 d";
    readonly name: "price_change_7d";
}, {
    readonly label: "Price change 14 d";
    readonly name: "price_change_14d";
}, {
    readonly label: "Price change 30 d";
    readonly name: "price_change_30d";
}, {
    readonly label: "Price change 60 d";
    readonly name: "price_change_60d";
}, {
    readonly label: "Price change 200 d";
    readonly name: "price_change_200d";
}, {
    readonly label: "Price change 1 y";
    readonly name: "price_change_1y";
}];
export declare const SORT_DIRECTION: readonly [{
    readonly label: "Desc";
    readonly name: "desc";
}, {
    readonly label: "Asc";
    readonly name: "asc";
}];
