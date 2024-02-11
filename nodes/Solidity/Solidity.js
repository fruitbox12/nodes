"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const ethers_1 = require("ethers");
const fs = __importStar(require("fs"));
const ChainNetwork_1 = require("../../src/ChainNetwork");
const solc_1 = __importDefault(require("solc"));
function findImports(_path) {
    // Remove all ../ from the path
    while (_path.includes('../')) {
        _path = _path.replace('../', '');
    }
    const filepath = (0, utils_1.getNodeModulesPackagePath)(_path);
    const contents = fs.readFileSync(filepath).toString();
    return { contents };
}
class Solidity {
    constructor() {
        this.loadMethods = {
            async getWallets(nodeData, dbCollection) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined) {
                    return returnData;
                }
                try {
                    if (dbCollection === undefined || !dbCollection || !dbCollection.Wallet) {
                        return returnData;
                    }
                    const wallets = dbCollection.Wallet;
                    for (let i = 0; i < wallets.length; i += 1) {
                        const wallet = wallets[i];
                        const data = {
                            label: `${wallet.name} (${wallet.network})`,
                            name: JSON.stringify(wallet),
                            description: wallet.address
                        };
                        returnData.push(data);
                    }
                    return returnData;
                }
                catch (e) {
                    return returnData;
                }
            },
            async getNetworkProviders(nodeData) {
                const returnData = [];
                const networksData = nodeData.networks;
                if (networksData === undefined)
                    return returnData;
                const network = networksData.network;
                return (0, ChainNetwork_1.getNetworkProvidersList)(network);
            }
        };
        this.label = 'Solidity';
        this.name = 'solidity';
        this.icon = 'solidity.svg';
        this.type = 'action';
        this.category = 'Smart Contract';
        this.version = 1.0;
        this.description = 'Compile and Deploy Solidity Code';
        this.incoming = 1;
        this.outgoing = 1;
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ChainNetwork_1.ETHNetworks, ...ChainNetwork_1.PolygonNetworks, ...ChainNetwork_1.ArbitrumNetworks, ...ChainNetwork_1.OptimismNetworks, ...ChainNetwork_1.BSCNetworks],
                default: 'goerli'
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'asyncOptions',
                loadMethod: 'getNetworkProviders'
            },
            {
                label: 'RPC Endpoint',
                name: 'jsonRPC',
                type: 'string',
                default: '',
                show: {
                    'networks.networkProvider': ['customRPC']
                }
            },
            {
                label: 'Websocket Endpoint',
                name: 'websocketRPC',
                type: 'string',
                default: '',
                show: {
                    'networks.networkProvider': ['customWebsocket']
                }
            }
        ];
        this.credentials = [...ChainNetwork_1.networkProviderCredentials];
        this.inputParameters = [
            {
                label: 'Solidity Code',
                name: 'code',
                type: 'code',
                placeholder: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {}
}`,
                description: 'Custom Solidity code to compile and deploy'
            },
            {
                label: 'Contract Name',
                name: 'contractName',
                description: 'Contract Name to deploy the Solidity Code',
                type: 'string',
                default: '',
                placeholder: 'MyContract'
            },
            {
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to deploy Solidity code',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Constructor Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: '[ "param1", "param2" ]',
                description: 'Input parameters for constructor',
                optional: true
            }
        ];
    }
    async run(nodeData) {
        const networksData = nodeData.networks;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;
        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        try {
            const walletString = inputParametersData.wallet;
            const walletDetails = JSON.parse(walletString);
            const network = networksData.network;
            const provider = await (0, ChainNetwork_1.getNetworkProvider)(networksData.networkProvider, network, credentials, networksData.jsonRPC, networksData.websocketRPC);
            if (!provider)
                throw new Error('Invalid Network Provider');
            // Get wallet instance
            const walletCredential = JSON.parse(walletDetails.walletCredential);
            const wallet = new ethers_1.ethers.Wallet(walletCredential.privateKey, provider);
            // Get input parameters
            const code = inputParametersData.code;
            const solidityContractName = inputParametersData.contractName;
            const parameters = inputParametersData.parameters;
            const input = {
                language: 'Solidity',
                sources: {},
                settings: {
                    outputSelection: {
                        '*': {
                            '*': ['*']
                        }
                    }
                }
            };
            input.sources[solidityContractName + '.sol'] = { content: code };
            const output = JSON.parse(solc_1.default.compile(JSON.stringify(input), { import: findImports }));
            const contractOutput = output.contracts[solidityContractName + '.sol'];
            const contractName = Object.keys(contractOutput)[0];
            const bytecode = contractOutput[contractName].evm.bytecode.object;
            const abi = contractOutput[contractName].abi;
            const factory = new ethers_1.ethers.ContractFactory(abi, bytecode, wallet);
            let contractParameters = [];
            if (parameters) {
                contractParameters = JSON.parse(parameters);
            }
            let deployedContract;
            if (contractParameters.length > 0)
                deployedContract = await factory.deploy(...contractParameters);
            else
                deployedContract = await factory.deploy();
            // The contract is NOT deployed yet; we must wait until it is mined
            await deployedContract.deployed();
            const returnItem = {
                explorerLink: `${ChainNetwork_1.networkExplorers[network]}/address/${deployedContract.address}`,
                address: deployedContract.address,
                transactionHash: deployedContract.deployTransaction.hash
            };
            return (0, utils_1.returnNodeExecutionData)(returnItem);
        }
        catch (e) {
            throw (0, utils_1.handleErrorMessage)(e);
        }
    }
}
module.exports = { nodeClass: Solidity };
//# sourceMappingURL=Solidity.js.map