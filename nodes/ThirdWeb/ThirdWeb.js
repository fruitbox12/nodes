"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const vm2_1 = require("vm2");
const supportedNetwork_1 = require("./supportedNetwork");
const sdk_1 = require("@thirdweb-dev/sdk");
const constants_1 = require("./constants");
const ChainNetwork_1 = require("../../src/ChainNetwork");
//import { ThirdwebSDK as ThirdwebSolanaSDK } from '@thirdweb-dev/sdk/solana'
class ThirdWeb {
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
            }
        };
        this.label = 'ThirdWeb';
        this.name = 'thirdWeb';
        this.icon = 'thirdweb.svg';
        this.type = 'action';
        this.category = 'Development';
        this.version = 2.0;
        this.description = 'Execute ThirdWeb SDK code snippet';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Read data from contracts',
                        name: 'read'
                    },
                    {
                        label: 'Execute transactions on contracts',
                        name: 'execute'
                    },
                    {
                        label: 'Deploy new contract',
                        name: 'deploy'
                    }
                ],
                default: 'read'
            }
        ];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...supportedNetwork_1.ThirdWebSupportedNetworks],
                default: 'mainnet'
            }
        ];
        this.inputParameters = [
            {
                label: 'Contract Address',
                name: 'contract',
                type: 'string',
                description: 'Navigate to ThirdWeb -> Code -> Getting started -> Javascript, copy the address used in the code section',
                placeholder: '0x6a8c7F715D5f044437dA5b0576eD1289eC9b7eB6',
                show: {
                    'actions.operation': ['read', 'execute']
                }
            },
            {
                label: 'Prebuilt Contract Type',
                name: 'contractType',
                type: 'options',
                description: 'Navigate to ThirdWeb -> Code -> Getting started -> Javascript, select the prebuilt contract used in the code section. Ex: await sdk.getContract("0x...", "nft-drop")',
                options: [...supportedNetwork_1.ThirdWebSupportedPrebuiltContract]
            },
            {
                label: 'Code',
                name: 'code',
                type: 'code',
                placeholder: `const ethers = require('ethers');\n\n//Get NFT Balance\nconst walletAddress = "0xE597E574889537A3A9120d1B5793cdFAEf6B6c10";\nconst balance = await contract.balanceOf(walletAddress);\nreturn ethers.utils.formatEther(balance);`,
                description: 'Custom code to run',
                show: {
                    'actions.operation': ['read', 'execute']
                }
            },
            {
                label: 'External Modules',
                name: 'external',
                type: 'json',
                placeholder: '["ethers"]',
                description: `Import installed dependencies within Outerbridge and use it within code. Ex: const ethers = require('ethers');`,
                optional: true,
                show: {
                    'actions.operation': ['read', 'execute']
                }
            },
            {
                label: 'Wallet Account',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to execute transaction or deploy contract.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets',
                show: {
                    'actions.operation': ['execute', 'deploy']
                }
            },
            ...constants_1.nftDropParameters,
            ...constants_1.marketplaceParameters,
            ...constants_1.multiWrapParameters,
            ...constants_1.splitContractParameters,
            ...constants_1.tokenDropParameters,
            ...constants_1.voteParameters
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const actionsData = nodeData.actions;
        const networksData = nodeData.networks;
        if (inputParametersData === undefined || actionsData === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }
        const operation = actionsData.operation;
        const contractAddress = inputParametersData.contract;
        const contractType = inputParametersData.contractType;
        const network = networksData.network;
        const walletString = inputParametersData.wallet;
        const imageType = inputParametersData.imageType;
        const name = inputParametersData.name;
        const description = inputParametersData.description;
        const symbol = inputParametersData.symbol;
        const primary_sale_recipient = inputParametersData.primary_sale_recipient;
        const fee_recipient = inputParametersData.fee_recipient;
        const seller_fee_basis_points = inputParametersData.seller_fee_basis_points;
        const platform_fee_recipient = inputParametersData.platform_fee_recipient;
        const platform_fee_basis_points = inputParametersData.platform_fee_basis_points;
        const external_link = inputParametersData.external_link;
        const trusted_forwarders = inputParametersData.trusted_forwarders;
        const recipients = inputParametersData.recipients;
        const voting_token_address = inputParametersData.voting_token_address;
        const proposal_token_threshold = inputParametersData.proposal_token_threshold;
        const voting_delay_in_blocks = inputParametersData.voting_delay_in_blocks;
        const voting_period_in_blocks = inputParametersData.voting_period_in_blocks;
        const voting_quorum_fraction = inputParametersData.voting_quorum_fraction;
        let responseData;
        const returnData = [];
        if (operation === 'read' || operation === 'execute') {
            const contract = await getThirdWebSDK(operation, network, contractAddress, contractType, walletString);
            // Global object
            const sandbox = {
                $nodeData: nodeData,
                $contract: contract
            };
            const options = {
                console: 'inherit',
                sandbox,
                require: {
                    external: false,
                    builtin: ['*']
                }
            };
            const code = inputParametersData.code;
            const external = inputParametersData.external;
            if (external) {
                const deps = JSON.parse(external);
                if (deps && deps.length) {
                    options.require.external = {
                        modules: deps
                    };
                }
            }
            const vm = new vm2_1.NodeVM(options);
            try {
                if (!code)
                    responseData = [];
                else {
                    const initCode = `const contract = $contract;\n`;
                    responseData = await vm.run(`module.exports = async function() {${initCode}${code}}()`, __dirname);
                }
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else if (operation === 'deploy') {
            const walletDetails = JSON.parse(walletString);
            const walletCredential = JSON.parse(walletDetails.walletCredential);
            const sdk = sdk_1.ThirdwebSDK.fromPrivateKey(walletCredential.privateKey, network);
            if (contractType === 'nft-drop' ||
                contractType === 'nft-collection' ||
                contractType === 'edition' ||
                contractType === 'edition-drop' ||
                contractType === 'pack' ||
                contractType === 'signature-drop') {
                const metadata = {
                    name,
                    primary_sale_recipient
                };
                if (imageType)
                    metadata.image = getImage(imageType, inputParametersData);
                if (symbol)
                    metadata.symbol = symbol;
                if (description)
                    metadata.description = description;
                if (fee_recipient)
                    metadata.fee_recipient = fee_recipient;
                if (seller_fee_basis_points)
                    metadata.seller_fee_basis_points = parseInt(seller_fee_basis_points, 10);
                if (platform_fee_recipient)
                    metadata.platform_fee_recipient = platform_fee_recipient;
                if (platform_fee_basis_points)
                    metadata.platform_fee_basis_points = parseInt(platform_fee_basis_points, 10);
                if (external_link)
                    metadata.external_link = external_link;
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders);
                    }
                    catch (error) {
                        throw (0, utils_1.handleErrorMessage)(error);
                    }
                }
                let contractAddress = '';
                if (contractType === 'nft-drop')
                    contractAddress = await sdk.deployer.deployNFTDrop(metadata);
                else if (contractType === 'nft-collection')
                    contractAddress = await sdk.deployer.deployNFTCollection(metadata);
                else if (contractType === 'edition')
                    contractAddress = await sdk.deployer.deployEdition(metadata);
                else if (contractType === 'edition-drop')
                    contractAddress = await sdk.deployer.deployEditionDrop(metadata);
                else if (contractType === 'pack')
                    contractAddress = await sdk.deployer.deployPack(metadata);
                else if (contractType === 'signature-drop')
                    contractAddress = await sdk.deployer.deploySignatureDrop(metadata);
                const returnItem = {
                    address: contractAddress,
                    explorerLink: `${ChainNetwork_1.networkExplorers[supportedNetwork_1.networkLookup[network]]}/address/${contractAddress}`
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
            else if (contractType === 'marketplace') {
                const metadata = {
                    name
                };
                if (imageType)
                    metadata.image = getImage(imageType, inputParametersData);
                if (description)
                    metadata.description = description;
                if (platform_fee_recipient)
                    metadata.platform_fee_recipient = platform_fee_recipient;
                if (platform_fee_basis_points)
                    metadata.platform_fee_basis_points = parseInt(platform_fee_basis_points, 10);
                if (external_link)
                    metadata.external_link = external_link;
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders);
                    }
                    catch (error) {
                        throw (0, utils_1.handleErrorMessage)(error);
                    }
                }
                const contractAddress = await sdk.deployer.deployMarketplace(metadata);
                const returnItem = {
                    address: contractAddress,
                    explorerLink: `${ChainNetwork_1.networkExplorers[supportedNetwork_1.networkLookup[network]]}/address/${contractAddress}`
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
            else if (contractType === 'multiwrap') {
                const metadata = {
                    name
                };
                if (imageType)
                    metadata.image = getImage(imageType, inputParametersData);
                if (symbol)
                    metadata.symbol = symbol;
                if (description)
                    metadata.description = description;
                if (fee_recipient)
                    metadata.fee_recipient = fee_recipient;
                if (seller_fee_basis_points)
                    metadata.seller_fee_basis_points = parseInt(seller_fee_basis_points, 10);
                if (external_link)
                    metadata.external_link = external_link;
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders);
                    }
                    catch (error) {
                        throw (0, utils_1.handleErrorMessage)(error);
                    }
                }
                const contractAddress = await sdk.deployer.deployMultiwrap(metadata);
                const returnItem = {
                    address: contractAddress,
                    explorerLink: `${ChainNetwork_1.networkExplorers[supportedNetwork_1.networkLookup[network]]}/address/${contractAddress}`
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
            else if (contractType === 'split') {
                let listOfRecipients = [];
                if (recipients) {
                    try {
                        listOfRecipients = JSON.parse(recipients.replace(/\s/g, ''));
                    }
                    catch (error) {
                        throw (0, utils_1.handleErrorMessage)(error);
                    }
                }
                const metadata = {
                    name,
                    recipients: listOfRecipients
                };
                if (imageType)
                    metadata.image = getImage(imageType, inputParametersData);
                if (description)
                    metadata.description = description;
                if (external_link)
                    metadata.external_link = external_link;
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders);
                    }
                    catch (error) {
                        throw (0, utils_1.handleErrorMessage)(error);
                    }
                }
                const contractAddress = await sdk.deployer.deploySplit(metadata);
                const returnItem = {
                    address: contractAddress,
                    explorerLink: `${ChainNetwork_1.networkExplorers[supportedNetwork_1.networkLookup[network]]}/address/${contractAddress}`
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
            else if (contractType === 'token' || contractType === 'token-drop') {
                const metadata = {
                    name,
                    primary_sale_recipient
                };
                if (imageType)
                    metadata.image = getImage(imageType, inputParametersData);
                if (symbol)
                    metadata.symbol = symbol;
                if (description)
                    metadata.description = description;
                if (platform_fee_recipient)
                    metadata.platform_fee_recipient = platform_fee_recipient;
                if (platform_fee_basis_points)
                    metadata.platform_fee_basis_points = parseInt(platform_fee_basis_points, 10);
                if (external_link)
                    metadata.external_link = external_link;
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders);
                    }
                    catch (error) {
                        throw (0, utils_1.handleErrorMessage)(error);
                    }
                }
                let contractAddress = '';
                if (contractType === 'token')
                    contractAddress = await sdk.deployer.deployToken(metadata);
                else if (contractType === 'token-drop')
                    contractAddress = await sdk.deployer.deployTokenDrop(metadata);
                const returnItem = {
                    address: contractAddress,
                    explorerLink: `${ChainNetwork_1.networkExplorers[supportedNetwork_1.networkLookup[network]]}/address/${contractAddress}`
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
            else if (contractType === 'vote') {
                const metadata = {
                    name,
                    voting_token_address
                };
                if (imageType)
                    metadata.image = getImage(imageType, inputParametersData);
                if (description)
                    metadata.description = description;
                if (voting_delay_in_blocks)
                    metadata.voting_delay_in_blocks = parseInt(voting_delay_in_blocks, 10);
                if (voting_period_in_blocks)
                    metadata.voting_period_in_blocks = parseInt(voting_period_in_blocks, 10);
                if (voting_quorum_fraction)
                    metadata.voting_quorum_fraction = parseInt(voting_quorum_fraction, 10);
                if (proposal_token_threshold)
                    metadata.proposal_token_threshold = proposal_token_threshold;
                if (external_link)
                    metadata.external_link = external_link;
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders);
                    }
                    catch (error) {
                        throw (0, utils_1.handleErrorMessage)(error);
                    }
                }
                const contractAddress = await sdk.deployer.deployVote(metadata);
                const returnItem = {
                    address: contractAddress,
                    explorerLink: `${ChainNetwork_1.networkExplorers[supportedNetwork_1.networkLookup[network]]}/address/${contractAddress}`
                };
                return (0, utils_1.returnNodeExecutionData)(returnItem);
            }
        }
        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        }
        else {
            returnData.push(responseData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
const getImage = (imageType, inputParametersData) => {
    let image;
    if (imageType === 'url') {
        image = inputParametersData.imageURL;
    }
    else if (imageType === 'base64') {
        const imageBase64 = inputParametersData.imageBase64;
        const splitDataURI = imageBase64.split(',');
        image = Buffer.from(splitDataURI.pop() || '', 'base64');
    }
    return image;
};
const getThirdWebSDK = async (operation, network, contractAddress, contractType, walletString) => {
    if (operation === 'read') {
        //return await ThirdwebSolanaSDK.fromNetwork(network).getProgram(contractAddress, contractType as any)
        return await new sdk_1.ThirdwebSDK(network).getContract(contractAddress, contractType);
    }
    else {
        const walletDetails = JSON.parse(walletString);
        const walletCredential = JSON.parse(walletDetails.walletCredential);
        //return await ThirdwebSolanaSDK.fromPrivateKey(walletCredential.privateKey, network).getProgram(contractAddress, contractType as any)
        return await sdk_1.ThirdwebSDK.fromPrivateKey(walletCredential.privateKey, network).getContract(contractAddress, contractType);
    }
};
module.exports = { nodeClass: ThirdWeb };
//# sourceMappingURL=ThirdWeb.js.map