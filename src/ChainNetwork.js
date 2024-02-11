"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGnosisMainnetProvider = exports.getAvalancheMainnetProvider = exports.getAvalancheTestnetProvider = exports.getPolygonTestnetProvider = exports.getPolygonMainnetProvider = exports.getBscTestnetProvider = exports.getBscMainnetProvider = exports.getCustomWebsocketProvider = exports.getCustomRPCProvider = exports.flowTestnetNetworkProviders = exports.flowNetworkProviders = exports.klaytnNetworkProviders = exports.metisNetworkProviders = exports.moonbeamNetworkProviders = exports.moonriverNetworkProviders = exports.harmonyNetworkProviders = exports.solanaNetworkProviders = exports.hecoNetworkProviders = exports.gnosisNetworkProviders = exports.fantomNetworkProviders = exports.avalancheNetworkProviders = exports.binanceNetworkProviders = exports.polygonNetworkProviders = exports.ethNetworkProviders = exports.ethTestNetworkProviders = exports.quickNodeNetworkProviders = exports.alchemyNetworkProviders = exports.infuraNetworkProviders = exports.customNetworkProviders = exports.FLOWNetworks = exports.KlatynNetworks = exports.MetisNetworks = exports.MoonBeamNetworks = exports.MoonRiverNetworks = exports.HarmonyNetworks = exports.HecoNetworks = exports.GnosisNetworks = exports.FantomNetworks = exports.SolanaNetworks = exports.AvalancheNetworks = exports.OptimismNetworks = exports.ArbitrumNetworks = exports.PolygonNetworks = exports.BSCNetworks = exports.ETHNetworks = exports.DOMAIN_ID = exports.CHAIN_ID = exports.NETWORK_PROVIDER = exports.NETWORK_LABEL = exports.NETWORK = void 0;
exports.erc1155BatchTransferAbi = exports.erc1155SingleTransferAbi = exports.functionTransferAbi = exports.eventTransferAbi = exports.nativeCurrency = exports.domainIdLookup = exports.chainIdLookup = exports.klaytnTestnetRPC = exports.metisMainnetRPC = exports.moonbeamMainnetRPC = exports.moonriverMainnetRPC = exports.harmoneyMainnetRPC = exports.solanaTestnetRPC = exports.solanaDevnetRPC = exports.solanaMainnetRPC = exports.fantomTestnetRPC = exports.fantomMainnetRPC = exports.hecoMainnetRPC = exports.gnosisMainnetRPC = exports.avalancheTestnetRPC = exports.avalancheMainnetRPC = exports.polygonMainnetRPC = exports.polygonMumbaiRPC = exports.binanceMainnetRPC = exports.binanceTestnetRPC = exports.openseaExplorers = exports.networkExplorers = exports.alchemyWSSAPIs = exports.alchemyHTTPAPIs = exports.infuraWSSAPIs = exports.infuraHTTPAPIs = exports.etherscanAPIs = exports.networkProviderCredentials = exports.getNetworkProvidersList = exports.getNetworkProvider = exports.getFallbackProvider = exports.getKlaytnTestnetProvider = exports.getMetisMainnetProvider = exports.getMoonbeamMainnetProvider = exports.getMoonriverMainnetProvider = exports.getHarmonyMainnetProvider = exports.getFantomTestnetProvider = exports.getFantomMainnetProvider = exports.getHecoMainnetProvider = void 0;
const ethers_1 = require("ethers");
/**
 * ENUMS
 */
var NETWORK;
(function (NETWORK) {
    NETWORK["MAINNET"] = "homestead";
    NETWORK["G\u00D6RLI"] = "goerli";
    NETWORK["MATIC_MUMBAI"] = "maticmum";
    NETWORK["MATIC"] = "matic";
    NETWORK["OPTIMISM"] = "optimism";
    NETWORK["OPTIMISM_GOERLI"] = "optimism-goerli";
    NETWORK["ARBITRUM"] = "arbitrum";
    NETWORK["ARBITRUM_GOERLI"] = "arbitrum-goerli";
    NETWORK["ARBITRUM_NOVA"] = "arbitrum-nova";
    NETWORK["BSC"] = "bsc";
    NETWORK["BSC_TESTNET"] = "bsc-testnet";
    NETWORK["AVALANCHE"] = "avalanche";
    NETWORK["AVALANCHE_TESTNET"] = "avalanche-testnet";
    NETWORK["FANTOM"] = "fantom";
    NETWORK["FANTOM_TESTNET"] = "fantom-testnet";
    NETWORK["CRONOS"] = "cronos";
    NETWORK["CRONOS_TESTNET"] = "cronos-testnet";
    NETWORK["GNOSIS"] = "gnosis";
    NETWORK["CELO"] = "celo";
    NETWORK["SOLANA"] = "solana";
    NETWORK["SOLANA_TESTNET"] = "solana-testnet";
    NETWORK["SOLANA_DEVNET"] = "solana-devnet";
    NETWORK["HECO"] = "heco";
    NETWORK["HARMONY"] = "harmony";
    NETWORK["MOONRIVER"] = "moonriver";
    NETWORK["MOONBEAM"] = "moonbeam";
    NETWORK["METIS"] = "metis";
    NETWORK["KLATYN_TESTNET"] = "klaytn-testnet";
    NETWORK["FLOW"] = "mainnet";
    NETWORK["FLOW_TESTNET"] = "testnet";
})(NETWORK = exports.NETWORK || (exports.NETWORK = {}));
var NETWORK_LABEL;
(function (NETWORK_LABEL) {
    NETWORK_LABEL["MAINNET"] = "Mainnet";
    NETWORK_LABEL["G\u00D6RLI"] = "Goerli";
    NETWORK_LABEL["MATIC_MUMBAI"] = "Polygon Mumbai";
    NETWORK_LABEL["MATIC"] = "Polygon Mainnet";
    NETWORK_LABEL["OPTIMISM"] = "Optimism Mainnet";
    NETWORK_LABEL["OPTIMISM_GOERLI"] = "Optimism Goerli";
    NETWORK_LABEL["ARBITRUM"] = "Arbitrum Mainnet";
    NETWORK_LABEL["ARBITRUM_GOERLI"] = "Arbitrum Goerli";
    NETWORK_LABEL["ARBITRUM_NOVA"] = "Arbitrum Nova";
    NETWORK_LABEL["BSC"] = "Binance Smart Chain Mainnet";
    NETWORK_LABEL["BSC_TESTNET"] = "Binance Smart Chain Testnet";
    NETWORK_LABEL["AVALANCHE"] = "Avalanche Mainnet";
    NETWORK_LABEL["AVALANCHE_TESTNET"] = "Avalanche Testnet";
    NETWORK_LABEL["FANTOM"] = "Fantom Mainnet";
    NETWORK_LABEL["FANTOM_TESTNET"] = "Fantom Testnet";
    NETWORK_LABEL["CRONOS"] = "Cronos Mainnet";
    NETWORK_LABEL["CRONOS_TESTNET"] = "Cronos Testnet";
    NETWORK_LABEL["GNOSIS"] = "Gnosis Mainnet";
    NETWORK_LABEL["CELO"] = "Celo Mainnet";
    NETWORK_LABEL["SOLANA"] = "Solana Mainnet";
    NETWORK_LABEL["SOLANA_TESTNET"] = "Solana Testnet";
    NETWORK_LABEL["SOLANA_DEVNET"] = "Solana Devnet";
    NETWORK_LABEL["HECO"] = "Huobi ECO Chain Mainnet";
    NETWORK_LABEL["HARMONY"] = "Harmony Mainnet";
    NETWORK_LABEL["MOONRIVER"] = "Moonriver Mainnet";
    NETWORK_LABEL["MOONBEAM"] = "Moonbeam Mainnet";
    NETWORK_LABEL["METIS"] = "Metis Mainnet";
    NETWORK_LABEL["KLATYN_TESTNET"] = "Klaytn Baobab Testnet";
    NETWORK_LABEL["FLOW"] = "Flow";
    NETWORK_LABEL["FLOW_TESTNET"] = "Flow Testnet";
})(NETWORK_LABEL = exports.NETWORK_LABEL || (exports.NETWORK_LABEL = {}));
var NETWORK_PROVIDER;
(function (NETWORK_PROVIDER) {
    NETWORK_PROVIDER["INFURA"] = "infura";
    NETWORK_PROVIDER["ALCHEMY"] = "alchemy";
    NETWORK_PROVIDER["QUICKNODE"] = "quicknode";
    NETWORK_PROVIDER["CLOUDFARE"] = "cloudfare";
    NETWORK_PROVIDER["CUSTOMRPC"] = "customRPC";
    NETWORK_PROVIDER["CUSTOMWSS"] = "customWebsocket";
    NETWORK_PROVIDER["BINANCE"] = "binance";
    NETWORK_PROVIDER["POLYGON"] = "polygon";
    NETWORK_PROVIDER["AVAX"] = "avalanche";
    NETWORK_PROVIDER["GNOSIS"] = "gnosis";
    NETWORK_PROVIDER["HECO"] = "heco";
    NETWORK_PROVIDER["FANTOM"] = "fantom";
    NETWORK_PROVIDER["SOLANA"] = "solana";
    NETWORK_PROVIDER["HARMONY"] = "harmony";
    NETWORK_PROVIDER["MOONRIVER"] = "moonriver";
    NETWORK_PROVIDER["MOONBEAM"] = "moonbeam";
    NETWORK_PROVIDER["METIS"] = "metis";
    NETWORK_PROVIDER["KLAYTN"] = "klaytn";
    NETWORK_PROVIDER["FLOW"] = "flow";
    NETWORK_PROVIDER["FLOW_TESTNET"] = "flow_testnet";
})(NETWORK_PROVIDER = exports.NETWORK_PROVIDER || (exports.NETWORK_PROVIDER = {}));
var CHAIN_ID;
(function (CHAIN_ID) {
    CHAIN_ID[CHAIN_ID["MAINNET"] = 1] = "MAINNET";
    CHAIN_ID[CHAIN_ID["G\u00D6RLI"] = 5] = "G\u00D6RLI";
    CHAIN_ID[CHAIN_ID["BINANCE_MAINNET"] = 56] = "BINANCE_MAINNET";
    CHAIN_ID[CHAIN_ID["BINANCE_TESTNET"] = 97] = "BINANCE_TESTNET";
    CHAIN_ID[CHAIN_ID["MATIC"] = 137] = "MATIC";
    CHAIN_ID[CHAIN_ID["MATIC_MUMBAI"] = 80001] = "MATIC_MUMBAI";
    CHAIN_ID[CHAIN_ID["ARB_MAINNET"] = 42161] = "ARB_MAINNET";
    CHAIN_ID[CHAIN_ID["ARB_TESTNET_GOERLI"] = 421613] = "ARB_TESTNET_GOERLI";
    CHAIN_ID[CHAIN_ID["ARB_NOVA"] = 42170] = "ARB_NOVA";
    CHAIN_ID[CHAIN_ID["OPT_MAINNET"] = 10] = "OPT_MAINNET";
    CHAIN_ID[CHAIN_ID["OPT_TESTNET_GOERLI"] = 420] = "OPT_TESTNET_GOERLI";
    CHAIN_ID[CHAIN_ID["CRONOS_MAINNET"] = 25] = "CRONOS_MAINNET";
    CHAIN_ID[CHAIN_ID["CRONOS_TESTNET"] = 338] = "CRONOS_TESTNET";
    CHAIN_ID[CHAIN_ID["AVALANCHE_MAINNET"] = 43114] = "AVALANCHE_MAINNET";
    CHAIN_ID[CHAIN_ID["AVALANCHE_TESTNET"] = 43113] = "AVALANCHE_TESTNET";
    CHAIN_ID[CHAIN_ID["FANTOM_MAINNET"] = 250] = "FANTOM_MAINNET";
    CHAIN_ID[CHAIN_ID["FANTOM_TESTNET"] = 4002] = "FANTOM_TESTNET";
    CHAIN_ID[CHAIN_ID["GNOSIS"] = 100] = "GNOSIS";
    CHAIN_ID[CHAIN_ID["CELO"] = 42220] = "CELO";
    CHAIN_ID[CHAIN_ID["HECO"] = 128] = "HECO";
    CHAIN_ID[CHAIN_ID["HARMONY"] = 1666600000] = "HARMONY";
    CHAIN_ID[CHAIN_ID["MOONRIVER"] = 1285] = "MOONRIVER";
    CHAIN_ID[CHAIN_ID["MOONBEAM"] = 1284] = "MOONBEAM";
    CHAIN_ID[CHAIN_ID["METIS"] = 1088] = "METIS";
})(CHAIN_ID = exports.CHAIN_ID || (exports.CHAIN_ID = {}));
var DOMAIN_ID;
(function (DOMAIN_ID) {
    DOMAIN_ID[DOMAIN_ID["MAINNET"] = 6648936] = "MAINNET";
    DOMAIN_ID[DOMAIN_ID["G\u00D6RLI"] = 3331] = "G\u00D6RLI";
    DOMAIN_ID[DOMAIN_ID["MATIC_MUMBAI"] = 9991] = "MATIC_MUMBAI";
})(DOMAIN_ID = exports.DOMAIN_ID || (exports.DOMAIN_ID = {}));
/**
 * Networks
 */
exports.ETHNetworks = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: NETWORK.MAINNET,
        parentGroup: 'Ethereum'
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: NETWORK.GÖRLI,
        parentGroup: 'Ethereum'
    }
];
exports.BSCNetworks = [
    {
        label: NETWORK_LABEL.BSC,
        name: NETWORK.BSC,
        parentGroup: 'Binance Smart Chain'
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: NETWORK.BSC_TESTNET,
        parentGroup: 'Binance Smart Chain'
    }
];
exports.PolygonNetworks = [
    {
        label: NETWORK_LABEL.MATIC,
        name: NETWORK.MATIC,
        parentGroup: 'Polygon'
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: NETWORK.MATIC_MUMBAI,
        parentGroup: 'Polygon'
    }
];
exports.ArbitrumNetworks = [
    {
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM,
        parentGroup: 'Arbitrum'
    },
    {
        label: NETWORK_LABEL.ARBITRUM_GOERLI,
        name: NETWORK.ARBITRUM_GOERLI,
        parentGroup: 'Arbitrum'
    }
];
exports.OptimismNetworks = [
    {
        label: NETWORK_LABEL.OPTIMISM,
        name: NETWORK.OPTIMISM,
        parentGroup: 'Optimism'
    },
    {
        label: NETWORK_LABEL.OPTIMISM_GOERLI,
        name: NETWORK.OPTIMISM_GOERLI,
        parentGroup: 'Optimism'
    }
];
exports.AvalancheNetworks = [
    {
        label: NETWORK_LABEL.AVALANCHE,
        name: NETWORK.AVALANCHE,
        parentGroup: 'Avalanche'
    },
    {
        label: NETWORK_LABEL.AVALANCHE_TESTNET,
        name: NETWORK.AVALANCHE_TESTNET,
        parentGroup: 'Avalanche'
    }
];
exports.SolanaNetworks = [
    {
        label: NETWORK_LABEL.SOLANA,
        name: NETWORK.SOLANA,
        parentGroup: 'Solana'
    },
    {
        label: NETWORK_LABEL.SOLANA_DEVNET,
        name: NETWORK.SOLANA_DEVNET,
        parentGroup: 'Solana'
    },
    {
        label: NETWORK_LABEL.SOLANA_TESTNET,
        name: NETWORK.SOLANA_TESTNET,
        parentGroup: 'Solana'
    }
];
exports.FantomNetworks = [
    {
        label: NETWORK_LABEL.FANTOM,
        name: NETWORK.FANTOM,
        parentGroup: 'Fantom'
    },
    {
        label: NETWORK_LABEL.FANTOM_TESTNET,
        name: NETWORK.FANTOM_TESTNET,
        parentGroup: 'Fantom'
    }
];
exports.GnosisNetworks = [
    {
        label: NETWORK_LABEL.GNOSIS,
        name: NETWORK.GNOSIS,
        parentGroup: 'Gnosis'
    }
];
exports.HecoNetworks = [
    {
        label: NETWORK_LABEL.HECO,
        name: NETWORK.HECO,
        parentGroup: 'Heco'
    }
];
exports.HarmonyNetworks = [
    {
        label: NETWORK_LABEL.HARMONY,
        name: NETWORK.HARMONY,
        parentGroup: 'Harmony'
    }
];
exports.MoonRiverNetworks = [
    {
        label: NETWORK_LABEL.MOONRIVER,
        name: NETWORK.MOONRIVER,
        parentGroup: 'MoonRiver'
    }
];
exports.MoonBeamNetworks = [
    {
        label: NETWORK_LABEL.MOONBEAM,
        name: NETWORK.MOONBEAM,
        parentGroup: 'MoonBeam'
    }
];
exports.MetisNetworks = [
    {
        label: NETWORK_LABEL.METIS,
        name: NETWORK.METIS,
        parentGroup: 'Metis'
    }
];
exports.KlatynNetworks = [
    {
        label: NETWORK_LABEL.KLATYN_TESTNET,
        name: NETWORK.KLATYN_TESTNET,
        parentGroup: 'Klatyn'
    }
];
exports.FLOWNetworks = [
    {
        label: NETWORK_LABEL.FLOW,
        name: NETWORK.FLOW,
        parentGroup: 'Flow Mainnet'
    },
    {
        label: NETWORK_LABEL.FLOW_TESTNET,
        name: NETWORK.FLOW_TESTNET,
        parentGroup: 'Flow Testnet'
    }
];
/**
 * Network Providers
 */
exports.customNetworkProviders = [
    {
        label: 'Custom RPC Endpoint',
        name: NETWORK_PROVIDER.CUSTOMRPC,
        description: 'HTTP endpoint',
        parentGroup: 'Custom Nodes'
    },
    {
        label: 'Custom Websocket Endpoint',
        name: NETWORK_PROVIDER.CUSTOMWSS,
        description: 'WSS Endpoint',
        parentGroup: 'Custom Nodes'
    }
];
exports.infuraNetworkProviders = [
    {
        label: 'Infura',
        name: NETWORK_PROVIDER.INFURA,
        description: 'Infura RPC/Websocket',
        parentGroup: 'Private Nodes'
    }
];
exports.alchemyNetworkProviders = [
    {
        label: 'Alchemy',
        name: NETWORK_PROVIDER.ALCHEMY,
        description: 'Alchemy RPC/Websocket',
        parentGroup: 'Private Nodes'
    }
];
exports.quickNodeNetworkProviders = [
    {
        label: 'QuickNode',
        name: NETWORK_PROVIDER.QUICKNODE,
        description: 'QuickNode HTTP and WSS Endpoints',
        parentGroup: 'Private Nodes'
    }
];
exports.ethTestNetworkProviders = [
    ...exports.alchemyNetworkProviders,
    ...exports.infuraNetworkProviders,
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.ethNetworkProviders = [
    {
        label: 'Cloudfare',
        name: NETWORK_PROVIDER.CLOUDFARE,
        description: 'Public Cloudfare RPC',
        parentGroup: 'Public Nodes'
    },
    ...exports.alchemyNetworkProviders,
    ...exports.infuraNetworkProviders,
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.polygonNetworkProviders = [
    {
        label: 'Polygon',
        name: NETWORK_PROVIDER.POLYGON,
        description: 'Public Polygon RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.alchemyNetworkProviders,
    ...exports.infuraNetworkProviders,
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.binanceNetworkProviders = [
    {
        label: 'Binance',
        name: NETWORK_PROVIDER.BINANCE,
        description: 'Public Binance RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.avalancheNetworkProviders = [
    {
        label: 'Avalanche',
        name: NETWORK_PROVIDER.AVAX,
        description: 'Public Avalanche RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.infuraNetworkProviders,
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.fantomNetworkProviders = [
    {
        label: 'Fantom',
        name: NETWORK_PROVIDER.FANTOM,
        description: 'Public Fantom RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.gnosisNetworkProviders = [
    {
        label: 'Gnosis',
        name: NETWORK_PROVIDER.GNOSIS,
        description: 'Public Gnosis RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.hecoNetworkProviders = [
    {
        label: 'Huobi ECO Chain',
        name: NETWORK_PROVIDER.HECO,
        description: 'Public HECO RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.customNetworkProviders
];
exports.solanaNetworkProviders = [...exports.quickNodeNetworkProviders, ...exports.customNetworkProviders];
exports.harmonyNetworkProviders = [
    {
        label: 'Harmony',
        name: NETWORK_PROVIDER.HARMONY,
        description: 'Public Harmony RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.quickNodeNetworkProviders,
    ...exports.customNetworkProviders
];
exports.moonriverNetworkProviders = [
    {
        label: 'Moonriver',
        name: NETWORK_PROVIDER.MOONRIVER,
        description: 'Public Moonriver RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.customNetworkProviders
];
exports.moonbeamNetworkProviders = [
    {
        label: 'Moonbeam',
        name: NETWORK_PROVIDER.MOONBEAM,
        description: 'Public Moonbeam RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.customNetworkProviders
];
exports.metisNetworkProviders = [
    {
        label: 'Metis',
        name: NETWORK_PROVIDER.METIS,
        description: 'Public Metis RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.customNetworkProviders
];
exports.klaytnNetworkProviders = [
    {
        label: 'Klaytn',
        name: NETWORK_PROVIDER.KLAYTN,
        description: 'Public Klaytn RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.customNetworkProviders
];
exports.flowNetworkProviders = [
    {
        label: 'Flow',
        name: NETWORK_PROVIDER.FLOW,
        description: 'Public FLOW RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.customNetworkProviders
];
exports.flowTestnetNetworkProviders = [
    {
        label: 'Flow Testnet',
        name: NETWORK_PROVIDER.FLOW_TESTNET,
        description: 'Public FLOW testnet RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...exports.customNetworkProviders
];
function getCustomRPCProvider(jsonRPC) {
    return new ethers_1.ethers.providers.JsonRpcProvider(jsonRPC);
}
exports.getCustomRPCProvider = getCustomRPCProvider;
function getCustomWebsocketProvider(websocketRPC) {
    return new ethers_1.ethers.providers.WebSocketProvider(websocketRPC);
}
exports.getCustomWebsocketProvider = getCustomWebsocketProvider;
async function getBscMainnetProvider() {
    return await getFallbackProvider(exports.binanceMainnetRPC, 'binance', CHAIN_ID.BINANCE_MAINNET);
}
exports.getBscMainnetProvider = getBscMainnetProvider;
async function getBscTestnetProvider() {
    return await new ethers_1.ethers.providers.JsonRpcProvider(exports.binanceTestnetRPC[0]);
}
exports.getBscTestnetProvider = getBscTestnetProvider;
async function getPolygonMainnetProvider() {
    return await getFallbackProvider(exports.polygonMainnetRPC, 'polygon', CHAIN_ID.MATIC);
}
exports.getPolygonMainnetProvider = getPolygonMainnetProvider;
async function getPolygonTestnetProvider() {
    return await getFallbackProvider(exports.polygonMumbaiRPC, 'polygon', CHAIN_ID.MATIC_MUMBAI);
}
exports.getPolygonTestnetProvider = getPolygonTestnetProvider;
async function getAvalancheTestnetProvider() {
    return await getFallbackProvider(exports.avalancheTestnetRPC, 'avalanche', CHAIN_ID.AVALANCHE_TESTNET);
}
exports.getAvalancheTestnetProvider = getAvalancheTestnetProvider;
async function getAvalancheMainnetProvider() {
    return await getFallbackProvider(exports.avalancheMainnetRPC, 'avalanche', CHAIN_ID.AVALANCHE_MAINNET);
}
exports.getAvalancheMainnetProvider = getAvalancheMainnetProvider;
async function getGnosisMainnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.gnosisMainnetRPC[0]);
}
exports.getGnosisMainnetProvider = getGnosisMainnetProvider;
async function getHecoMainnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.hecoMainnetRPC[0]);
}
exports.getHecoMainnetProvider = getHecoMainnetProvider;
async function getFantomMainnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.fantomMainnetRPC[0]);
}
exports.getFantomMainnetProvider = getFantomMainnetProvider;
async function getFantomTestnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.fantomTestnetRPC[0]);
}
exports.getFantomTestnetProvider = getFantomTestnetProvider;
async function getHarmonyMainnetProvider() {
    return await getFallbackProvider(exports.harmoneyMainnetRPC, 'harmony', CHAIN_ID.HARMONY);
}
exports.getHarmonyMainnetProvider = getHarmonyMainnetProvider;
async function getMoonriverMainnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.moonriverMainnetRPC[0]);
}
exports.getMoonriverMainnetProvider = getMoonriverMainnetProvider;
async function getMoonbeamMainnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.moonbeamMainnetRPC[0]);
}
exports.getMoonbeamMainnetProvider = getMoonbeamMainnetProvider;
async function getMetisMainnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.metisMainnetRPC[0]);
}
exports.getMetisMainnetProvider = getMetisMainnetProvider;
async function getKlaytnTestnetProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(exports.klaytnTestnetRPC[0]);
}
exports.getKlaytnTestnetProvider = getKlaytnTestnetProvider;
async function getFallbackProvider(rpcs, network, chainId) {
    const prvs = [];
    for (let i = 0; i < rpcs.length; i++) {
        const node = rpcs[i];
        const prv = new ethers_1.ethers.providers.StaticJsonRpcProvider({ url: node, timeout: 1000 }, {
            name: network,
            chainId
        });
        await prv.ready;
        prvs.push({
            provider: prv,
            stallTimeout: 1000
        });
    }
    return new ethers_1.ethers.providers.FallbackProvider(prvs);
}
exports.getFallbackProvider = getFallbackProvider;
async function getNetworkProvider(networkProvider, network, credentials, jsonRPC, websocketRPC, isWebSocket) {
    if (credentials === undefined &&
        (networkProvider === NETWORK_PROVIDER.INFURA ||
            networkProvider === NETWORK_PROVIDER.ALCHEMY ||
            networkProvider === NETWORK_PROVIDER.QUICKNODE)) {
        throw new Error('Missing credentials');
    }
    switch (networkProvider) {
        case NETWORK_PROVIDER.ALCHEMY:
            return isWebSocket
                ? new ethers_1.ethers.providers.WebSocketProvider(`${exports.alchemyWSSAPIs[network]}${credentials.apiKey}`)
                : new ethers_1.ethers.providers.AlchemyProvider(network, credentials.apiKey);
        case NETWORK_PROVIDER.INFURA:
            return isWebSocket
                ? new ethers_1.ethers.providers.WebSocketProvider(`${exports.infuraWSSAPIs[network]}${credentials.apiKey}`)
                : new ethers_1.ethers.providers.InfuraProvider(network, {
                    apiKey: credentials.apiKey,
                    secretKey: credentials.secretKey
                });
        case NETWORK_PROVIDER.QUICKNODE:
            return isWebSocket
                ? new ethers_1.ethers.providers.WebSocketProvider(credentials.wssProvider)
                : new ethers_1.ethers.providers.JsonRpcProvider(credentials.httpProvider);
        case NETWORK_PROVIDER.CLOUDFARE:
            return new ethers_1.ethers.providers.CloudflareProvider();
        case NETWORK_PROVIDER.BINANCE:
            if (network === NETWORK.BSC)
                return await getBscMainnetProvider();
            else if (network === NETWORK.BSC_TESTNET)
                return await getBscTestnetProvider();
            else
                return null;
        case NETWORK_PROVIDER.POLYGON:
            if (network === NETWORK.MATIC)
                return await getPolygonMainnetProvider();
            else if (network === NETWORK.MATIC_MUMBAI)
                return await getPolygonTestnetProvider();
            else
                return null;
        case NETWORK_PROVIDER.AVAX:
            if (network === NETWORK.AVALANCHE)
                return await getAvalancheMainnetProvider();
            else if (network === NETWORK.AVALANCHE_TESTNET)
                return await getAvalancheTestnetProvider();
            else
                return null;
        case NETWORK_PROVIDER.FANTOM:
            if (network === NETWORK.FANTOM)
                return await getFantomMainnetProvider();
            else if (network === NETWORK.FANTOM_TESTNET)
                return await getFantomTestnetProvider();
            else
                return null;
        case NETWORK_PROVIDER.GNOSIS:
            return await getGnosisMainnetProvider();
        case NETWORK_PROVIDER.HECO:
            return await getHecoMainnetProvider();
        case NETWORK_PROVIDER.HARMONY:
            return await getHarmonyMainnetProvider();
        case NETWORK_PROVIDER.MOONRIVER:
            return await getMoonriverMainnetProvider();
        case NETWORK_PROVIDER.MOONBEAM:
            return await getMoonbeamMainnetProvider();
        case NETWORK_PROVIDER.METIS:
            return await getMetisMainnetProvider();
        case NETWORK_PROVIDER.KLAYTN:
            return await getKlaytnTestnetProvider();
        case NETWORK_PROVIDER.CUSTOMRPC:
            return jsonRPC ? getCustomRPCProvider(jsonRPC) : null;
        case NETWORK_PROVIDER.CUSTOMWSS:
            return websocketRPC ? getCustomWebsocketProvider(websocketRPC) : null;
        default:
            return null;
    }
}
exports.getNetworkProvider = getNetworkProvider;
function getNetworkProvidersList(network) {
    switch (network) {
        case NETWORK.MAINNET:
            return exports.ethNetworkProviders;
        case NETWORK.GÖRLI:
            return exports.ethTestNetworkProviders;
        case NETWORK.MATIC:
        case NETWORK.MATIC_MUMBAI:
            return exports.polygonNetworkProviders;
        case NETWORK.OPTIMISM:
        case NETWORK.OPTIMISM_GOERLI:
            return exports.ethTestNetworkProviders;
        case NETWORK.ARBITRUM:
        case NETWORK.ARBITRUM_GOERLI:
            return exports.ethTestNetworkProviders;
        case NETWORK.AVALANCHE:
        case NETWORK.AVALANCHE_TESTNET:
            return exports.avalancheNetworkProviders;
        case NETWORK.FANTOM:
        case NETWORK.FANTOM_TESTNET:
            return exports.fantomNetworkProviders;
        case NETWORK.SOLANA:
        case NETWORK.SOLANA_DEVNET:
        case NETWORK.SOLANA_TESTNET:
            return exports.solanaNetworkProviders;
        case NETWORK.BSC:
        case NETWORK.BSC_TESTNET:
            return exports.binanceNetworkProviders;
        case NETWORK.GNOSIS:
            return exports.gnosisNetworkProviders;
        case NETWORK.HECO:
            return exports.hecoNetworkProviders;
        case NETWORK.HARMONY:
            return exports.harmonyNetworkProviders;
        case NETWORK.MOONRIVER:
            return exports.moonriverNetworkProviders;
        case NETWORK.MOONBEAM:
            return exports.moonbeamNetworkProviders;
        case NETWORK.METIS:
            return exports.metisNetworkProviders;
        case NETWORK.KLATYN_TESTNET:
            return exports.klaytnNetworkProviders;
        case NETWORK.FLOW:
            return exports.flowNetworkProviders;
        case NETWORK.FLOW_TESTNET:
            return exports.flowTestnetNetworkProviders;
        default:
            return exports.customNetworkProviders;
    }
}
exports.getNetworkProvidersList = getNetworkProvidersList;
exports.networkProviderCredentials = [
    {
        label: 'Credential Method',
        name: 'credentialMethod',
        type: 'options',
        options: [
            {
                label: 'Alchemy API Key',
                name: 'alchemyApi',
                show: {
                    'networks.networkProvider': [NETWORK_PROVIDER.ALCHEMY]
                }
            },
            {
                label: 'Infura API Key',
                name: 'infuraApi',
                show: {
                    'networks.networkProvider': [NETWORK_PROVIDER.INFURA]
                }
            },
            {
                label: 'QuickNode Endpoints',
                name: 'quickNodeEndpoints',
                show: {
                    'networks.networkProvider': [NETWORK_PROVIDER.QUICKNODE]
                }
            }
        ],
        show: {
            'networks.networkProvider': [NETWORK_PROVIDER.ALCHEMY, NETWORK_PROVIDER.INFURA, NETWORK_PROVIDER.QUICKNODE]
        }
    }
];
/**
 * URLs
 */
exports.etherscanAPIs = {
    [NETWORK.MAINNET]: 'https://api.etherscan.io/api',
    [NETWORK.GÖRLI]: 'https://api-goerli.etherscan.io/api',
    [NETWORK.MATIC]: 'https://api.polygonscan.com/api',
    [NETWORK.MATIC_MUMBAI]: 'https://api-testnet.polygonscan.com/api',
    [NETWORK.OPTIMISM]: 'https://api-optimistic.etherscan.io/api',
    [NETWORK.OPTIMISM_GOERLI]: 'https://api-goerli-optimistic.etherscan.io/api',
    [NETWORK.ARBITRUM]: 'https://api.arbiscan.io/api',
    [NETWORK.ARBITRUM_GOERLI]: 'https://api-goerli.arbiscan.io/api',
    [NETWORK.BSC]: 'https://api.bscscan.com/api',
    [NETWORK.BSC_TESTNET]: 'https://api-testnet.bscscan.com/api',
    [NETWORK.AVALANCHE]: 'https://api.snowtrace.io/api',
    [NETWORK.AVALANCHE_TESTNET]: 'https://api-testnet.snowtrace.io/api',
    [NETWORK.FANTOM]: 'https://api.ftmscan.com/api',
    [NETWORK.FANTOM_TESTNET]: 'https://api-testnet.ftmscan.com/api',
    [NETWORK.CRONOS]: 'https://api.cronoscan.com/api',
    [NETWORK.CRONOS_TESTNET]: 'https://api-testnet.cronoscan.com/api',
    [NETWORK.GNOSIS]: 'https://api.gnosisscan.io/api',
    [NETWORK.CELO]: 'https://api.celoscan.io/api',
    [NETWORK.MOONRIVER]: 'https://api-moonriver.moonscan.io/api',
    [NETWORK.MOONBEAM]: 'https://api-moonbeam.moonscan.io/api'
};
exports.infuraHTTPAPIs = {
    [NETWORK.MAINNET]: 'https://mainnet.infura.io/v3/',
    [NETWORK.GÖRLI]: 'https://goerli.infura.io/v3/',
    [NETWORK.MATIC]: 'https://polygon-mainnet.infura.io/v3/',
    [NETWORK.MATIC_MUMBAI]: 'https://polygon-mumbai.infura.io/v3/',
    [NETWORK.OPTIMISM]: 'https://optimism-mainnet.infura.io/v3/',
    [NETWORK.OPTIMISM_GOERLI]: 'https://optimism-goerli.infura.io/v3/',
    [NETWORK.ARBITRUM]: 'https://arbitrum-mainnet.infura.io/v3/',
    [NETWORK.ARBITRUM_GOERLI]: 'https://arbitrum-goerli.infura.io/v3/'
};
exports.infuraWSSAPIs = {
    [NETWORK.MAINNET]: 'wss://mainnet.infura.io/ws/v3/',
    [NETWORK.GÖRLI]: 'wss://goerli.infura.io/ws/v3/',
    [NETWORK.MATIC]: 'wss://polygon-mainnet.infura.io/ws/v3/',
    [NETWORK.MATIC_MUMBAI]: 'wss://polygon-mumbai.infura.io/ws/v3/',
    [NETWORK.OPTIMISM]: 'wss://optimism-mainnet.infura.io/ws/v3/',
    [NETWORK.OPTIMISM_GOERLI]: 'wss://optimism-goerli.infura.io/ws/v3/',
    [NETWORK.ARBITRUM]: 'wss://arbitrum-mainnet.infura.io/ws/v3/',
    [NETWORK.ARBITRUM_GOERLI]: 'wss://arbitrum-goerli.infura.io/ws/v3/'
};
exports.alchemyHTTPAPIs = {
    [NETWORK.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/',
    [NETWORK.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/',
    [NETWORK.MATIC]: 'https://polygon-mainnet.g.alchemy.com/v2/',
    [NETWORK.MATIC_MUMBAI]: 'https://polygon-mumbai.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM]: 'https://opt-mainnet.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM_GOERLI]: 'https://opt-goerli.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM]: 'https://arb-mainnet.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM_GOERLI]: 'https://arb-goerli.g.alchemy.com/v2/',
    [NETWORK.SOLANA]: 'https://solana-mainnet.g.alchemy.com/v2/',
    [NETWORK.SOLANA_DEVNET]: 'https://solana-devnet.g.alchemy.com/v2/'
};
exports.alchemyWSSAPIs = {
    [NETWORK.MAINNET]: 'wss://eth-mainnet.alchemyapi.io/v2/',
    [NETWORK.GÖRLI]: 'wss://eth-goerli.alchemyapi.io/v2/',
    [NETWORK.MATIC]: 'wss://polygon-mainnet.g.alchemy.com/v2/',
    [NETWORK.MATIC_MUMBAI]: 'wss://polygon-mumbai.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM]: 'wss://opt-mainnet.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM_GOERLI]: 'wss://opt-goerli.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM]: 'wss://arb-mainnet.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM_GOERLI]: 'wss://arb-goerli.g.alchemy.com/v2/',
    [NETWORK.SOLANA]: 'wss://solana-mainnet.g.alchemy.com/v2/',
    [NETWORK.SOLANA_DEVNET]: 'wss://solana-devnet.g.alchemy.com/v2/'
};
exports.networkExplorers = {
    [NETWORK.MAINNET]: 'https://etherscan.io',
    [NETWORK.GÖRLI]: 'https://goerli.etherscan.io',
    [NETWORK.MATIC]: 'https://polygonscan.com',
    [NETWORK.MATIC_MUMBAI]: 'https://mumbai.polygonscan.com',
    [NETWORK.OPTIMISM]: 'https://optimistic.etherscan.io',
    [NETWORK.OPTIMISM_GOERLI]: 'https://goerli-optimistic.etherscan.io',
    [NETWORK.ARBITRUM]: 'https://arbiscan.io',
    [NETWORK.ARBITRUM_GOERLI]: 'https://goerli-explorer.arbitrum.io',
    [NETWORK.BSC]: 'https://bscscan.com',
    [NETWORK.BSC_TESTNET]: 'https://testnet.bscscan.com',
    [NETWORK.FANTOM]: 'https://ftmscan.com',
    [NETWORK.FANTOM_TESTNET]: 'https://testnet.ftmscan.com',
    [NETWORK.CRONOS]: 'https://cronoscan.com',
    [NETWORK.CRONOS_TESTNET]: 'https://testnet.cronoscan.com',
    [NETWORK.GNOSIS]: 'https://gnosisscan.io',
    [NETWORK.CELO]: 'https://celoscan.io',
    [NETWORK.MOONRIVER]: 'https://moonriver.moonscan.io',
    [NETWORK.MOONBEAM]: 'https://moonscan.io'
};
exports.openseaExplorers = {
    [NETWORK.MAINNET]: 'https://opensea.io',
    [NETWORK.GÖRLI]: 'https://testnets.opensea.io',
    [NETWORK.MATIC]: 'https://opensea.io/assets/matic',
    [NETWORK.MATIC_MUMBAI]: 'https://testnets.opensea.io/assets/mumbai'
};
exports.binanceTestnetRPC = [
    'https://data-seed-prebsc-1-s3.binance.org:8545',
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-2-s2.binance.org:8545'
];
exports.binanceMainnetRPC = [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org',
    'https://bsc.nodereal.io'
];
exports.polygonMumbaiRPC = [
    'https://matic-testnet-archive-rpc.bwarelabs.com',
    'https://rpc-mumbai.maticvigil.com',
    'https://matic-mumbai.chainstacklabs.com',
    'https://rpc-mumbai.matic.today'
];
exports.polygonMainnetRPC = ['https://polygon-rpc.com', 'https://rpc-mainnet.matic.quiknode.pro'];
exports.avalancheMainnetRPC = ['https://api.avax.network/ext/bc/C/rpc', 'https://rpc.ankr.com/avalanche'];
exports.avalancheTestnetRPC = ['https://api.avax-test.network/ext/bc/C/rpc'];
exports.gnosisMainnetRPC = ['https://rpc.gnosischain.com'];
exports.hecoMainnetRPC = ['https://http-mainnet.hecochain.com'];
exports.fantomMainnetRPC = ['https://rpc.ftm.tools'];
exports.fantomTestnetRPC = ['https://rpc.testnet.fantom.network'];
exports.solanaMainnetRPC = ['https://api.mainnet-beta.solana.com'];
exports.solanaDevnetRPC = ['https://api.devnet.solana.com'];
exports.solanaTestnetRPC = ['https://api.testnet.solana.com'];
exports.harmoneyMainnetRPC = ['https://api.harmony.one', 'https://harmony-mainnet.chainstacklabs.com'];
exports.moonriverMainnetRPC = ['https://rpc.api.moonriver.moonbeam.network'];
exports.moonbeamMainnetRPC = ['https://rpc.api.moonbeam.network'];
exports.metisMainnetRPC = ['https://andromeda.metis.io/?owner=1088'];
exports.klaytnTestnetRPC = ['https://api.baobab.klaytn.net:8651	'];
exports.chainIdLookup = {
    [NETWORK.MAINNET]: CHAIN_ID.MAINNET,
    [NETWORK.GÖRLI]: CHAIN_ID.GÖRLI,
    [NETWORK.MATIC]: CHAIN_ID.MATIC,
    [NETWORK.MATIC_MUMBAI]: CHAIN_ID.MATIC_MUMBAI,
    [NETWORK.OPTIMISM]: CHAIN_ID.OPT_MAINNET,
    [NETWORK.OPTIMISM_GOERLI]: CHAIN_ID.OPT_TESTNET_GOERLI,
    [NETWORK.ARBITRUM]: CHAIN_ID.ARB_MAINNET,
    [NETWORK.ARBITRUM_GOERLI]: CHAIN_ID.ARB_TESTNET_GOERLI,
    [NETWORK.ARBITRUM_NOVA]: CHAIN_ID.ARB_NOVA,
    [NETWORK.BSC]: CHAIN_ID.BINANCE_MAINNET,
    [NETWORK.BSC_TESTNET]: CHAIN_ID.BINANCE_TESTNET,
    [NETWORK.CRONOS]: CHAIN_ID.CRONOS_MAINNET,
    [NETWORK.CRONOS_TESTNET]: CHAIN_ID.CRONOS_TESTNET,
    [NETWORK.AVALANCHE]: CHAIN_ID.AVALANCHE_MAINNET,
    [NETWORK.AVALANCHE_TESTNET]: CHAIN_ID.AVALANCHE_TESTNET,
    [NETWORK.FANTOM]: CHAIN_ID.FANTOM_MAINNET,
    [NETWORK.FANTOM_TESTNET]: CHAIN_ID.FANTOM_TESTNET,
    [NETWORK.GNOSIS]: CHAIN_ID.GNOSIS,
    [NETWORK.CELO]: CHAIN_ID.CELO,
    [NETWORK.HECO]: CHAIN_ID.HECO,
    [NETWORK.MOONRIVER]: CHAIN_ID.MOONRIVER,
    [NETWORK.HECO]: CHAIN_ID.HECO,
    [NETWORK.HARMONY]: CHAIN_ID.HARMONY,
    [NETWORK.METIS]: CHAIN_ID.METIS
};
exports.domainIdLookup = {
    [NETWORK.MAINNET]: DOMAIN_ID.MAINNET,
    [NETWORK.GÖRLI]: DOMAIN_ID.GÖRLI,
    [NETWORK.MATIC_MUMBAI]: DOMAIN_ID.MATIC_MUMBAI
};
exports.nativeCurrency = {
    [NETWORK.MAINNET]: 'ETH',
    [NETWORK.GÖRLI]: 'ETH',
    [NETWORK.MATIC]: 'MATIC',
    [NETWORK.MATIC_MUMBAI]: 'MATIC',
    [NETWORK.OPTIMISM]: 'ETH',
    [NETWORK.OPTIMISM_GOERLI]: 'ETH',
    [NETWORK.ARBITRUM]: 'ETH',
    [NETWORK.ARBITRUM_GOERLI]: 'ETH',
    [NETWORK.ARBITRUM_NOVA]: 'ETH',
    [NETWORK.BSC]: 'BNB',
    [NETWORK.BSC_TESTNET]: 'BNB',
    [NETWORK.FANTOM]: 'FTM',
    [NETWORK.FANTOM_TESTNET]: 'FTM',
    [NETWORK.AVALANCHE]: 'AVAX',
    [NETWORK.AVALANCHE_TESTNET]: 'AVAX',
    [NETWORK.GNOSIS]: 'xDAI',
    [NETWORK.CELO]: 'CELO',
    [NETWORK.MOONRIVER]: 'MOVR',
    [NETWORK.MOONBEAM]: 'GLMR'
};
exports.eventTransferAbi = ['event Transfer(address indexed from, address indexed to, uint value)'];
exports.functionTransferAbi = ['function transfer(address to, uint256 amount) external returns (boolean)'];
exports.erc1155SingleTransferAbi = [
    'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint id, uint value)'
];
exports.erc1155BatchTransferAbi = [
    'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint[] id, uint[] value)'
];
//# sourceMappingURL=ChainNetwork.js.map