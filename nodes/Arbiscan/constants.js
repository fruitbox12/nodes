"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SORT_BY = exports.OPERATIONS = exports.GET_ETHER_SUPPLY = exports.GET_ETHER_PRICE = exports.GET_ERC20_TOKEN_BALANCE = exports.GET_ERC20_TOKEN_SUPPLY = exports.CHECK_TRANSACTION_RECEIPT_STATUS = exports.CHECK_CONTRACT_EXECUTION_STATUS = exports.GET_CONTRACT_SOURCE_CODE = exports.GET_ABI = exports.GET_INTERNAL_TRANSACTIONS_BY_BLOCK = exports.GET_INTERNAL_TRANSACTIONS_BY_HASH = exports.GET_INTERNAL_TRANSACTIONS = exports.GET_NORMAL_TRANSACTIONS = exports.GET_MULTI_ETHER_BALANCE = exports.GET_ETHER_BALANCE = void 0;
// Account
exports.GET_ETHER_BALANCE = {
    name: 'getEtherBalance',
    module: 'account',
    action: 'balance'
};
exports.GET_MULTI_ETHER_BALANCE = {
    name: 'getEtherBalanceMulti',
    module: 'account',
    action: 'balancemulti'
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
// Transactions
exports.CHECK_CONTRACT_EXECUTION_STATUS = {
    name: 'getContractExecutionStatus',
    module: 'transaction',
    action: 'getstatus'
};
exports.CHECK_TRANSACTION_RECEIPT_STATUS = {
    name: 'getTransactionReceiptStatus',
    module: 'transaction',
    action: 'gettxreceiptstatus'
};
// Tokens
exports.GET_ERC20_TOKEN_SUPPLY = {
    name: 'getErc20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
};
exports.GET_ERC20_TOKEN_BALANCE = {
    name: 'getErc20TokenBalance',
    module: 'account',
    action: 'tokenbalance'
};
// Stats
exports.GET_ETHER_PRICE = {
    name: 'getEtherPrice',
    module: 'stats',
    action: 'ethprice'
};
exports.GET_ETHER_SUPPLY = {
    name: 'getEtherSupply',
    module: 'stats',
    action: 'ethsupply'
};
exports.OPERATIONS = [
    exports.GET_ETHER_BALANCE,
    exports.GET_MULTI_ETHER_BALANCE,
    exports.GET_NORMAL_TRANSACTIONS,
    exports.GET_INTERNAL_TRANSACTIONS,
    exports.GET_INTERNAL_TRANSACTIONS_BY_HASH,
    exports.GET_INTERNAL_TRANSACTIONS_BY_BLOCK,
    exports.GET_ABI,
    exports.GET_CONTRACT_SOURCE_CODE,
    exports.CHECK_TRANSACTION_RECEIPT_STATUS,
    exports.CHECK_CONTRACT_EXECUTION_STATUS,
    exports.GET_ERC20_TOKEN_SUPPLY,
    exports.GET_ERC20_TOKEN_BALANCE,
    exports.GET_ETHER_PRICE,
    exports.GET_ETHER_SUPPLY
];
exports.SORT_BY = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
];
//# sourceMappingURL=constants.js.map