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
class CreateNFT {
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
        this.label = 'Create NFT';
        this.name = 'createNFT';
        this.icon = 'createNFT.png';
        this.type = 'action';
        this.category = 'NFT';
        this.version = 1.0;
        this.description = 'Create new NFT (ERC1155)';
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
                description: 'Wallet account to create NFT.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'NFT Metadata',
                name: 'nftMetadata',
                type: 'options',
                options: [
                    {
                        label: 'Ipfs Hash/Pin',
                        name: 'ipfsHash',
                        description: 'Ipfs hash/pin of the folder that contains the json metadata files'
                    },
                    {
                        label: 'URL',
                        name: 'url',
                        description: 'URL of the folder that contains the json metadata files. Ex: https://ipfs.io/ipfs/QmSPiKckfBDhw1pXdjHvU4jndN5pn4ZbKHeA9Nnn622C7U'
                    }
                ],
                description: 'Fetch metadata from a url OR using Ipfs hash/pin'
            },
            {
                label: 'NFT Metadata URL',
                name: 'nftMetadataJsonUrl',
                type: 'string',
                placeholder: 'https://ipfs.io/ipfs/QmSPiKckfBDhw1pXdjHvU4jndN5pn4ZbKHeA9Nnn622C7U',
                description: 'URL of the folder that contains the json metadata files',
                show: {
                    'inputParameters.nftMetadata': ['url']
                }
            },
            {
                label: 'NFT Metadata Ipfs Hash/Pin',
                name: 'nftMetadataHash',
                type: 'string',
                placeholder: 'QmexuwvmmtwsazQ7LK93SyVdFeYRnDbjET414y2xXiToM4',
                description: 'Ipfs hash/pin of the folder that contains the json metadata files',
                show: {
                    'inputParameters.nftMetadata': ['ipfsHash']
                }
            },
            {
                label: 'Contract Name',
                name: 'contractName',
                type: 'string',
                default: '',
                placeholder: 'MyContract',
                optional: true
            },
            {
                label: 'Collection Name',
                name: 'collectionName',
                type: 'string',
                default: '',
                placeholder: 'MyCollection',
                optional: true
            },
            {
                label: 'Solidity Version',
                name: 'solidityVersion',
                type: 'options',
                description: 'Soldity version to compile code for NFT creation',
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
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
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
            let nftContractName = inputParametersData.contractName || `ERC1155Contract${getRandomInt(10000)}`;
            const collectionName = inputParametersData.collectionName || `Untilted Collection #${getRandomInt(10000)}`;
            const nftMetadataJsonUrl = inputParametersData.nftMetadataJsonUrl;
            const nftMetadataHash = inputParametersData.nftMetadataHash;
            const nftSupply = 1;
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
            let metadata = '';
            if (nftMetadataJsonUrl) {
                metadata = `${nftMetadataJsonUrl}/{id}.json`;
            }
            else if (nftMetadataHash) {
                metadata = `ipfs://${nftMetadataHash}/{id}.json`;
            }
            let encodePacked = '';
            if (metadata) {
                encodePacked = metadata.substring(0, metadata.lastIndexOf('/') + 1);
            }
            nftContractName = nftContractName.replace(/\s/g, '');
            const tokenId = 0;
            const contractCode = `// SPDX-License-Identifier: MIT
            pragma solidity ^${solidityVersion};
            
            import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
            import "@openzeppelin/contracts/access/Ownable.sol";
            import "@openzeppelin/contracts/security/Pausable.sol";
            import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
            import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
            import "@openzeppelin/contracts/utils/Strings.sol";
            
            contract ${nftContractName} is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {

                string public name;

                constructor()
                    ERC1155("${metadata}")
                {
                    name = "${collectionName}"; //collection name
                    _mint(msg.sender, ${tokenId}, ${nftSupply}, "");
                }

                // to Put NFT to Opensea
                function uri(uint256 _tokenId) override public view returns (string memory) {
                    return string(
                        abi.encodePacked(
                            "${encodePacked}",
                            Strings.toString(_tokenId),
                            ".json"
                        )
                    );
                }

                function setURI(string memory newuri) public onlyOwner {
                    _setURI(newuri);
                }

                function pause() public onlyOwner {
                    _pause();
                }

                function unpause() public onlyOwner {
                    _unpause();
                }

                function mint(address account, uint256 id, uint256 amount, bytes memory data)
                    public
                    onlyOwner
                {
                    _mint(account, id, amount, data);
                }

                function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
                    public
                    onlyOwner
                {
                    _mintBatch(to, ids, amounts, data);
                }

                function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
                    internal
                    whenNotPaused
                    override(ERC1155, ERC1155Supply)
                {
                    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
                }
            }`;
            input.sources[nftContractName + '.sol'] = { content: contractCode };
            const output = JSON.parse(solc_1.default.compile(JSON.stringify(input), { import: findImports }));
            const contractOutput = output.contracts[nftContractName + '.sol'];
            const contractName = Object.keys(contractOutput)[0];
            const bytecode = contractOutput[contractName].evm.bytecode.object;
            const abi = contractOutput[contractName].abi;
            const factory = new ethers_1.ethers.ContractFactory(abi, bytecode, wallet);
            const deployedContract = await factory.deploy();
            // The contract is NOT deployed yet; we must wait until it is mined
            await deployedContract.deployed();
            const returnItem = {
                explorerLink: `${ChainNetwork_1.networkExplorers[network]}/address/${deployedContract.address}`,
                openseaLink: `${ChainNetwork_1.openseaExplorers[network]}/assets/${deployedContract.address}/${tokenId}`,
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
module.exports = { nodeClass: CreateNFT };
//# sourceMappingURL=CreateNFT.js.map