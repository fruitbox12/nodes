"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SORT_BY = exports.OPERATIONS = exports.GET_HISTORICAL_BNB_PRICE = exports.GET_BNB_PRICE = exports.GET_BNB_SUPPLY = exports.GET_TOKEN_INFO = exports.GET_HISTORICAL_BEP20_TOKEN_BALANCE = exports.GET_HISTORICAL_BEP20_TOKEN_SUPPLY = exports.GET_BEP20_TOKEN_BALANCE = exports.GET_BEP20_TOKEN_SUPPLY = exports.GET_BEP20_CIRCULATION_TOKEN_SUPPLY = exports.CHECK_TRANSACTION_RECEIPT_STATUS = exports.GET_CONTRACT_CREATION = exports.GET_CONTRACT_SOURCE_CODE = exports.GET_ABI = exports.GET_BLOCKS_VALIDATED = exports.GET_INTERNAL_TRANSACTIONS_BY_BLOCK = exports.GET_INTERNAL_TRANSACTIONS_BY_HASH = exports.GET_INTERNAL_TRANSACTIONS = exports.GET_NORMAL_TRANSACTIONS = exports.GET_HISTORICAL_BNB_BALANCE = exports.GET_MULTI_BNB_BALANCE = exports.GET_BNB_BALANCE = void 0;
// Account
exports.GET_BNB_BALANCE = {
    name: 'getBnbBalance',
    module: 'account',
    action: 'balance'
};
exports.GET_MULTI_BNB_BALANCE = {
    name: 'getBnbBalanceMulti',
    module: 'account',
    action: 'balancemulti'
};
exports.GET_HISTORICAL_BNB_BALANCE = {
    name: 'getHistoricalBnbBalance',
    module: 'account',
    action: 'balancehistory'
};
exports.GET_NORMAL_TRANSACTIONS = {
    name: 'getTransactions',
    module: 'account',
    action: 'txlist'
};
exports.GET_INTERNAL_TRANSACTIONS = {
    name: 'getInternalTransactions',
    module: 'account',
    action: 'txlistinternal'
};
exports.GET_INTERNAL_TRANSACTIONS_BY_HASH = {
    name: 'getInternalTransactionsByHash',
    module: 'account',
    action: 'txlistinternal'
};
exports.GET_INTERNAL_TRANSACTIONS_BY_BLOCK = {
    name: 'getInternalTransactionsByBlock',
    module: 'account',
    action: 'txlistinternal'
};
exports.GET_BLOCKS_VALIDATED = {
    name: 'getBlocksValidated',
    module: 'account',
    action: 'getminedblocks'
};
// Contracts
exports.GET_ABI = {
    name: 'getAbi',
    module: 'contract',
    action: 'getabi'
};
exports.GET_CONTRACT_SOURCE_CODE = {
    name: 'getContractSourceCode',
    module: 'contract',
    action: 'getsourcecode'
};
exports.GET_CONTRACT_CREATION = {
    name: 'getContractCreation',
    module: 'contract',
    action: 'getcontractcreation'
};
// Transactions
exports.CHECK_TRANSACTION_RECEIPT_STATUS = {
    name: 'getTransactionReceiptStatus',
    module: 'transaction',
    action: 'gettxreceiptstatus'
};
// Tokens
exports.GET_BEP20_CIRCULATION_TOKEN_SUPPLY = {
    name: 'getBep20TokenCirculatingSupply',
    module: 'stats',
    action: 'tokenCsupply'
};
exports.GET_BEP20_TOKEN_SUPPLY = {
    name: 'getBep20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
};
exports.GET_BEP20_TOKEN_BALANCE = {
    name: 'getBep20TokenBalance',
    module: 'account',
    action: 'tokenbalance'
};
exports.GET_HISTORICAL_BEP20_TOKEN_SUPPLY = {
    name: 'getHistoricalBep20TokenSupply',
    module: 'stats',
    action: 'tokensupplyhistory'
};
exports.GET_HISTORICAL_BEP20_TOKEN_BALANCE = {
    name: 'getHistoricalBep20TokenBalance',
    module: 'account',
    action: 'tokenbalancehistory'
};
exports.GET_TOKEN_INFO = {
    name: 'getTokenInfo',
    module: 'token',
    action: 'tokeninfo'
};
// Stats
exports.GET_BNB_SUPPLY = {
    name: 'getBep20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
};
exports.GET_BNB_PRICE = {
    name: 'getBnbPrice',
    module: 'stats',
    action: 'bnbprice'
};
exports.GET_HISTORICAL_BNB_PRICE = {
    name: 'getHistoricalBnbPrice',
    module: 'stats',
    action: 'bnbdailyprice'
};
exports.OPERATIONS = [
    exports.GET_BNB_BALANCE,
    exports.GET_MULTI_BNB_BALANCE,
    exports.GET_HISTORICAL_BNB_BALANCE,
    exports.GET_NORMAL_TRANSACTIONS,
    exports.GET_INTERNAL_TRANSACTIONS,
    exports.GET_INTERNAL_TRANSACTIONS_BY_HASH,
    exports.GET_INTERNAL_TRANSACTIONS_BY_BLOCK,
    exports.GET_BLOCKS_VALIDATED,
    exports.GET_ABI,
    exports.GET_CONTRACT_SOURCE_CODE,
    exports.GET_CONTRACT_CREATION,
    exports.CHECK_TRANSACTION_RECEIPT_STATUS,
    exports.GET_BEP20_TOKEN_SUPPLY,
    exports.GET_BEP20_TOKEN_BALANCE,
    exports.GET_HISTORICAL_BEP20_TOKEN_SUPPLY,
    exports.GET_HISTORICAL_BEP20_TOKEN_BALANCE,
    exports.GET_TOKEN_INFO,
    exports.GET_BNB_PRICE,
    exports.GET_HISTORICAL_BNB_PRICE,
    exports.GET_BNB_SUPPLY,
    exports.GET_BEP20_CIRCULATION_TOKEN_SUPPLY
];
exports.SORT_BY = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
];
//# sourceMappingURL=constants.js.map