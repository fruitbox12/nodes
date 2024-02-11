"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteEvents = exports.splitEvents = exports.signatureDropEvents = exports.packEvents = exports.multiWrapEvents = exports.editionEvents = exports.tokenDropEvents = exports.tokenEvents = exports.editionDropEvents = exports.marketplaceEvents = exports.nftCollectionEvents = exports.nftDropEvents = exports.networkLookup = exports.ThirdWebSupportedPrebuiltContract = exports.ThirdWebSupportedNetworks = void 0;
const ChainNetwork_1 = require("../../src/ChainNetwork");
exports.ThirdWebSupportedNetworks = [
    {
        label: ChainNetwork_1.NETWORK_LABEL.MAINNET,
        name: 'mainnet'
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.GÖRLI,
        name: 'goerli'
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.MATIC,
        name: 'polygon'
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.MATIC_MUMBAI,
        name: 'mumbai'
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.ARBITRUM,
        name: ChainNetwork_1.NETWORK.ARBITRUM
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.ARBITRUM_GOERLI,
        name: ChainNetwork_1.NETWORK.ARBITRUM_GOERLI
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.AVALANCHE,
        name: ChainNetwork_1.NETWORK.AVALANCHE
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.AVALANCHE_TESTNET,
        name: ChainNetwork_1.NETWORK.AVALANCHE_TESTNET
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.OPTIMISM,
        name: ChainNetwork_1.NETWORK.OPTIMISM
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.OPTIMISM_GOERLI,
        name: ChainNetwork_1.NETWORK.OPTIMISM_GOERLI
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.FANTOM,
        name: ChainNetwork_1.NETWORK.FANTOM
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.FANTOM_TESTNET,
        name: ChainNetwork_1.NETWORK.FANTOM_TESTNET
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.BSC,
        name: 'binance'
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.BSC_TESTNET,
        name: 'binance-testnet'
    }
    /*
    {
        label: NETWORK_LABEL.SOLANA,
        name: 'mainnet-beta'
    },
    {
        label: NETWORK_LABEL.SOLANA_DEVNET,
        name: 'devnet'
    },
    {
        label: NETWORK_LABEL.SOLANA_TESTNET,
        name: 'testnet'
    }
    */
];
exports.ThirdWebSupportedPrebuiltContract = [
    {
        label: 'Edition',
        name: 'edition',
        description: 'Create editions of ERC1155 tokens'
    },
    {
        label: 'Edition Drop',
        name: 'edition-drop',
        description: 'Release ERC1155 tokens for a set price.'
    },
    {
        label: 'Marketplace',
        name: 'marketplace',
        description: 'Buy and sell ERC721/ERC1155 tokens'
    },
    {
        label: 'Multiwrap',
        name: 'multiwrap',
        description: 'Bundle multiple ERC721/ERC1155/ERC20 tokens into a single ERC721.'
    },
    {
        label: 'NFT Collection',
        name: 'nft-collection',
        description: 'Create collection of unique NFTs.'
    },
    {
        label: 'NFT Drop',
        name: 'nft-drop',
        description: 'Release collection of unique NFTs for a set price'
    },
    {
        label: 'Pack',
        name: 'pack',
        description: 'Pack multiple tokens into ERC1155 NFTs that act as randomized loot boxes'
    },
    {
        label: 'Signature Drop',
        name: 'signature-drop',
        description: 'Signature based minting of ERC721 tokens.'
    },
    {
        label: 'Split',
        name: 'split',
        description: 'Distribute funds among multiple recipients'
    },
    {
        label: 'Token',
        name: 'token',
        description: 'Create cryptocurrency compliant with ERC20 standard'
    },
    {
        label: 'Token Drop',
        name: 'token-drop',
        description: 'Release new ERC20 tokens for a set price'
    },
    {
        label: 'Vote',
        name: 'vote',
        description: 'Create and vote on proposals'
    }
];
exports.networkLookup = {
    mainnet: ChainNetwork_1.NETWORK.MAINNET,
    goerli: ChainNetwork_1.NETWORK.GÖRLI,
    polygon: ChainNetwork_1.NETWORK.MATIC,
    mumbai: ChainNetwork_1.NETWORK.MATIC_MUMBAI,
    binance: ChainNetwork_1.NETWORK.BSC,
    'binance-testnet': ChainNetwork_1.NETWORK.BSC_TESTNET,
    [ChainNetwork_1.NETWORK.ARBITRUM]: ChainNetwork_1.NETWORK.ARBITRUM,
    [ChainNetwork_1.NETWORK.ARBITRUM_GOERLI]: ChainNetwork_1.NETWORK.ARBITRUM_GOERLI,
    [ChainNetwork_1.NETWORK.AVALANCHE]: ChainNetwork_1.NETWORK.AVALANCHE,
    [ChainNetwork_1.NETWORK.AVALANCHE_TESTNET]: ChainNetwork_1.NETWORK.AVALANCHE_TESTNET,
    [ChainNetwork_1.NETWORK.OPTIMISM]: ChainNetwork_1.NETWORK.OPTIMISM,
    [ChainNetwork_1.NETWORK.OPTIMISM_GOERLI]: ChainNetwork_1.NETWORK.OPTIMISM_GOERLI,
    [ChainNetwork_1.NETWORK.FANTOM]: ChainNetwork_1.NETWORK.FANTOM,
    [ChainNetwork_1.NETWORK.FANTOM_TESTNET]: ChainNetwork_1.NETWORK.FANTOM_TESTNET
};
exports.nftDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'TokensLazyMinted',
        name: 'TokensLazyMinted'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'MaxTotalSupplyUpdated',
        name: 'MaxTotalSupplyUpdated'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'TokenURIRevealed',
        name: 'TokenURIRevealed'
    }
];
exports.nftCollectionEvents = [
    {
        label: 'TokensMinted',
        name: 'TokensMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    }
];
exports.marketplaceEvents = [
    {
        label: 'NewSale',
        name: 'NewSale'
    },
    {
        label: 'NewOffer',
        name: 'NewOffer'
    },
    {
        label: 'ListingAdded',
        name: 'ListingAdded'
    },
    {
        label: 'ListingUpdated',
        name: 'ListingUpdated'
    },
    {
        label: 'ListingRemoved',
        name: 'ListingRemoved'
    },
    {
        label: 'AuctionClosed',
        name: 'AuctionClosed'
    },
    {
        label: 'AuctionBuffersUpdated',
        name: 'AuctionBuffersUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
];
exports.editionDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'TokensLazyMinted',
        name: 'TokensLazyMinted'
    },
    {
        label: 'TransferBatch',
        name: 'TransferBatch'
    },
    {
        label: 'TransferSingle',
        name: 'TransferSingle'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'MaxTotalSupplyUpdated',
        name: 'MaxTotalSupplyUpdated'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'SaleRecipientForTokenUpdated',
        name: 'SaleRecipientForTokenUpdated'
    },
    {
        label: 'URI',
        name: 'URI'
    }
];
exports.tokenEvents = [
    {
        label: 'TokensMinted',
        name: 'TokensMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'DelegateChanged',
        name: 'DelegateChanged'
    },
    {
        label: 'DelegateVotesChanged',
        name: 'DelegateVotesChanged'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
];
exports.tokenDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DelegateChanged',
        name: 'DelegateChanged'
    },
    {
        label: 'DelegateVotesChanged',
        name: 'DelegateVotesChanged'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'MaxTotalSupplyUpdated',
        name: 'MaxTotalSupplyUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
];
exports.editionEvents = [
    {
        label: 'TokensMinted',
        name: 'TokensMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'TransferBatch',
        name: 'TransferBatch'
    },
    {
        label: 'TransferSingle',
        name: 'TransferSingle'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'FlatPlatformFeeUpdated',
        name: 'FlatPlatformFeeUpdated'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PlatformFeeTypeUpdated',
        name: 'PlatformFeeTypeUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'URI',
        name: 'URI'
    }
];
exports.multiWrapEvents = [
    {
        label: 'TokensUnwrapped',
        name: 'TokensUnwrapped'
    },
    {
        label: 'TokensWrapped',
        name: 'TokensWrapped'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    }
];
exports.packEvents = [
    {
        label: 'PackCreated',
        name: 'PackCreated'
    },
    {
        label: 'PackOpened',
        name: 'PackOpened'
    },
    {
        label: 'PackUpdated',
        name: 'PackUpdated'
    },
    {
        label: 'TransferBatch',
        name: 'TransferBatch'
    },
    {
        label: 'TransferSingle',
        name: 'TransferSingle'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'URI',
        name: 'URI'
    }
];
exports.signatureDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'TokensLazyMinted',
        name: 'TokensLazyMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'TokenURIRevealed',
        name: 'TokenURIRevealed'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ClaimConditionUpdated',
        name: 'ClaimConditionUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    }
];
exports.splitEvents = [
    {
        label: 'ERC20PaymentReleased',
        name: 'ERC20PaymentReleased'
    },
    {
        label: 'PaymentReceived',
        name: 'PaymentReceived'
    },
    {
        label: 'PaymentReleased',
        name: 'PaymentReleased'
    },
    {
        label: 'PayeeAdded',
        name: 'PayeeAdded'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
];
exports.voteEvents = [
    {
        label: 'ProposalCreated',
        name: 'ProposalCreated'
    },
    {
        label: 'ProposalExecuted',
        name: 'ProposalExecuted'
    },
    {
        label: 'ProposalCanceled',
        name: 'ProposalCanceled'
    },
    {
        label: 'ProposalThresholdSet',
        name: 'ProposalThresholdSet'
    },
    {
        label: 'VoteCast',
        name: 'VoteCast'
    },
    {
        label: 'VoteCastWithParams',
        name: 'VoteCastWithParams'
    },
    {
        label: 'VotingDelaySet',
        name: 'VotingDelaySet'
    },
    {
        label: 'VotingPeriodSet',
        name: 'VotingPeriodSet'
    },
    {
        label: 'QuorumNumeratorUpdated',
        name: 'QuorumNumeratorUpdated'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    }
];
//# sourceMappingURL=supportedNetwork.js.map