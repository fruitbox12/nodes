"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainLinkNetworks = exports.chainLinkNetworkMapping = void 0;
const ChainNetwork_1 = require("../../src/ChainNetwork");
exports.chainLinkNetworkMapping = {
    [ChainNetwork_1.NETWORK.MAINNET]: 'Ethereum Mainnet',
    [ChainNetwork_1.NETWORK.GÖRLI]: 'Goerli Testnet',
    [ChainNetwork_1.NETWORK.ARBITRUM]: 'Arbitrum Mainnet',
    [ChainNetwork_1.NETWORK.ARBITRUM_GOERLI]: 'Arbitrum Goerli',
    [ChainNetwork_1.NETWORK.OPTIMISM]: 'Optimism Mainnet',
    [ChainNetwork_1.NETWORK.OPTIMISM_GOERLI]: 'Optimism Goerli',
    [ChainNetwork_1.NETWORK.MATIC]: 'Polygon Mainnet',
    [ChainNetwork_1.NETWORK.MATIC_MUMBAI]: 'Mumbai Testnet',
    [ChainNetwork_1.NETWORK.BSC]: 'BNB Chain Mainnet',
    [ChainNetwork_1.NETWORK.BSC_TESTNET]: 'BNB Chain Mainnet',
    [ChainNetwork_1.NETWORK.GNOSIS]: 'Gnosis Chain Mainnet',
    [ChainNetwork_1.NETWORK.HECO]: 'HECO Mainnet',
    [ChainNetwork_1.NETWORK.FANTOM]: 'Fantom Mainnet',
    [ChainNetwork_1.NETWORK.FANTOM_TESTNET]: 'Fantom Testnet',
    [ChainNetwork_1.NETWORK.AVALANCHE]: 'Avalanche Mainnet',
    [ChainNetwork_1.NETWORK.AVALANCHE_TESTNET]: 'Avalanche Testnet',
    [ChainNetwork_1.NETWORK.SOLANA]: 'Solana Mainnet',
    [ChainNetwork_1.NETWORK.SOLANA_DEVNET]: 'Solana Devnet',
    [ChainNetwork_1.NETWORK.HARMONY]: 'Harmony Mainnet',
    [ChainNetwork_1.NETWORK.MOONRIVER]: 'Moonriver Mainnet',
    [ChainNetwork_1.NETWORK.MOONBEAM]: 'Moonbeam Mainnet',
    [ChainNetwork_1.NETWORK.METIS]: 'Metis Mainnet',
    [ChainNetwork_1.NETWORK.KLATYN_TESTNET]: 'Klaytn Baobab testnet'
};
exports.chainLinkNetworks = [
    {
        label: ChainNetwork_1.NETWORK_LABEL.MAINNET,
        name: ChainNetwork_1.NETWORK.MAINNET,
        parentGroup: 'Ethereum',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.GÖRLI,
        name: ChainNetwork_1.NETWORK.GÖRLI,
        parentGroup: 'Ethereum',
        hide: {
            'actions.operation': ['getProofReserve']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.MATIC,
        name: ChainNetwork_1.NETWORK.MATIC,
        parentGroup: 'Polygon',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.MATIC_MUMBAI,
        name: ChainNetwork_1.NETWORK.MATIC_MUMBAI,
        parentGroup: 'Polygon',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.ARBITRUM,
        name: ChainNetwork_1.NETWORK.ARBITRUM,
        parentGroup: 'Arbitrum',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.ARBITRUM_GOERLI,
        name: ChainNetwork_1.NETWORK.ARBITRUM_GOERLI,
        parentGroup: 'Arbitrum',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.AVALANCHE,
        name: ChainNetwork_1.NETWORK.AVALANCHE,
        parentGroup: 'Avalanche',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.AVALANCHE_TESTNET,
        name: ChainNetwork_1.NETWORK.AVALANCHE_TESTNET,
        parentGroup: 'Avalanche',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.OPTIMISM,
        name: ChainNetwork_1.NETWORK.OPTIMISM,
        parentGroup: 'Optimism',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.OPTIMISM_GOERLI,
        name: ChainNetwork_1.NETWORK.OPTIMISM_GOERLI,
        parentGroup: 'Optimism',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.BSC,
        name: ChainNetwork_1.NETWORK.BSC,
        parentGroup: 'Binance Smart Chain',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.BSC_TESTNET,
        name: ChainNetwork_1.NETWORK.BSC_TESTNET,
        parentGroup: 'Binance Smart Chain',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.GNOSIS,
        name: ChainNetwork_1.NETWORK.GNOSIS,
        parentGroup: 'Gnosis',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.HECO,
        name: ChainNetwork_1.NETWORK.HECO,
        parentGroup: 'Heco',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.FANTOM,
        name: ChainNetwork_1.NETWORK.FANTOM,
        parentGroup: 'Fantom',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.FANTOM_TESTNET,
        name: ChainNetwork_1.NETWORK.FANTOM_TESTNET,
        parentGroup: 'Fantom',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.SOLANA,
        name: ChainNetwork_1.NETWORK.SOLANA,
        parentGroup: 'Solana',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.SOLANA_DEVNET,
        name: ChainNetwork_1.NETWORK.SOLANA_DEVNET,
        parentGroup: 'Solana',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.HARMONY,
        name: ChainNetwork_1.NETWORK.HARMONY,
        parentGroup: 'Harmony',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.MOONRIVER,
        name: ChainNetwork_1.NETWORK.MOONRIVER,
        parentGroup: 'Moonriver',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.MOONBEAM,
        name: ChainNetwork_1.NETWORK.MOONBEAM,
        parentGroup: 'Moonbeam',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.METIS,
        name: ChainNetwork_1.NETWORK.METIS,
        parentGroup: 'Metis',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: ChainNetwork_1.NETWORK_LABEL.KLATYN_TESTNET,
        name: ChainNetwork_1.NETWORK.KLATYN_TESTNET,
        parentGroup: 'Klaytn Baobab testnet',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    }
];
//# sourceMappingURL=supportedNetwork.js.map