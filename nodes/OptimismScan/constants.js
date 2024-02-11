"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SORT_BY = exports.OPERATIONS = exports.GET_ERC20_TOKEN_ACCOUNT_BALANCE = exports.GET_ERC20_TOKEN_SUPPLY = exports.GET_CONTRACT_SOURCE_CODE = exports.GET_CONTRACT_ABI = exports.GET_WITHDRAWAL = exports.GET_DEPOSIT = exports.GET_ERC20_TOKEN_TRANSFER = exports.GET_NORMAL_TRANSACTIONS = exports.GET_ETH_BALANCE_MULTI = exports.GET_ETH_BALANCE = void 0;
// Account
exports.GET_ETH_BALANCE = {
    name: 'getEthBalance',
    module: 'account',
    action: 'balance'
};
exports.GET_ETH_BALANCE_MULTI = {
    name: 'getEthBalanceMulti',
    module: 'account',
    action: 'balancemulti'
};
exports.GET_NORMAL_TRANSACTIONS = {
    name: 'getNormalTransactions',
    module: 'account',
    action: 'txlist'
};
exports.GET_ERC20_TOKEN_TRANSFER = {
    name: 'getErc20TokenTransfer',
    module: 'account',
    action: 'tokentx'
};
exports.GET_DEPOSIT = {
    name: 'getDeposit',
    module: 'account',
    action: 'getdeposittxs'
};
exports.GET_WITHDRAWAL = {
    name: 'getWithdrawal',
    module: 'account',
    action: 'getwithdrawaltxs'
};
// Contracts
exports.GET_CONTRACT_ABI = {
    name: 'getContractAbi',
    module: 'contract',
    action: 'getabi'
};
exports.GET_CONTRACT_SOURCE_CODE = {
    name: 'getContractSourceCode',
    module: 'contract',
    action: 'getsourcecode'
};
// Tokens
exports.GET_ERC20_TOKEN_SUPPLY = {
    name: 'getErc20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
};
exports.GET_ERC20_TOKEN_ACCOUNT_BALANCE = {
    name: 'getErc20TokenAccountBalance',
    module: 'account',
    action: 'tokenbalance'
};
exports.OPERATIONS = [
    exports.GET_ETH_BALANCE,
    exports.GET_ETH_BALANCE_MULTI,
    exports.GET_NORMAL_TRANSACTIONS,
    exports.GET_ERC20_TOKEN_TRANSFER,
    exports.GET_DEPOSIT,
    exports.GET_WITHDRAWAL,
    exports.GET_CONTRACT_ABI,
    exports.GET_CONTRACT_SOURCE_CODE,
    exports.GET_ERC20_TOKEN_SUPPLY,
    exports.GET_ERC20_TOKEN_ACCOUNT_BALANCE
];
exports.SORT_BY = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
];
//# sourceMappingURL=constants.js.map