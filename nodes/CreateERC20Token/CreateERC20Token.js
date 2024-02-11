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
    const filepath = (0, utils_1.getNodeModulesPackagePath)(_path);
    const contents = fs.readFileSync(filepath).toString();
    return { contents };
}
class CreateERC20Token {
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
        this.label = 'Create Token';
        this.name = 'createToken';
        this.icon = 'erc20.svg';
        this.type = 'action';
        this.category = 'Cryptocurrency';
        this.version = 1.0;
        this.description = 'Create new cryptocurrency token (ERC20)';
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
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to create ERC20 Token.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Token Name',
                name: 'tokenName',
                type: 'string',
                default: '',
                placeholder: 'MyToken'
            },
            {
                label: 'Token Symbol',
                name: 'tokenSymbol',
                type: 'string',
                default: '',
                placeholder: 'MYT'
            },
            {
                label: 'Token Supply',
                name: 'tokenSupply',
                type: 'number',
                default: 1000,
                description: 'Initialy supply of the token'
            },
            {
                label: 'Solidity Version',
                name: 'solidityVersion',
                type: 'options',
                description: 'Soldity version to compile code for token creation',
                options: [
                    {
                        label: '0.8.10',
                        name: '0.8.10'
                    },
                    {
                        label: '0.8.11',
                        name: '0.8.11'
                    },
                    {
                        label: '0.8.12',
                        name: '0.8.12'
                    },
                    {
                        label: '0.8.13',
                        name: '0.8.13'
                    },
                    {
                        label: '0.8.14',
                        name: '0.8.14'
                    },
                    {
                        label: '0.8.15',
                        name: '0.8.15'
                    }
                ],
                default: '0.8.15'
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
            const tokenName = inputParametersData.tokenName;
            const tokenSupply = inputParametersData.tokenSupply;
            const tokenSymbol = inputParametersData.tokenSymbol;
            const solidityVersion = inputParametersData.solidityVersion;
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
            const contractCode = `// SPDX-License-Identifier: MIT
            pragma solidity ^${solidityVersion};
            import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            
            contract ${tokenName.trim()} is ERC20 {
                constructor(uint256 initialSupply) ERC20("${tokenName} Token", "${tokenSymbol}"){
                    _mint(msg.sender, initialSupply);
                }
            }`;
            input.sources[tokenName + '.sol'] = { content: contractCode };
            const output = JSON.parse(solc_1.default.compile(JSON.stringify(input), { import: findImports }));
            const contractOutput = output.contracts[tokenName + '.sol'];
            const contractName = Object.keys(contractOutput)[0];
            const bytecode = contractOutput[contractName].evm.bytecode.object;
            const abi = contractOutput[contractName].abi;
            const factory = new ethers_1.ethers.ContractFactory(abi, bytecode, wallet);
            const deployedContract = await factory.deploy(ethers_1.ethers.BigNumber.from(`${tokenSupply}000000000000000000`));
            // The contract is NOT deployed yet; we must wait until it is mined
            await deployedContract.deployed();
            const returnItem = {
                link: `${ChainNetwork_1.networkExplorers[network]}/address/${deployedContract.address}`,
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
module.exports = { nodeClass: CreateERC20Token };
//# sourceMappingURL=CreateERC20Token.js.map