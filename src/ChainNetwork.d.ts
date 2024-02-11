import { ICommonObject, INetworkMapping, INodeOptionsValue } from '.';
import { ethers } from 'ethers';
/**
 * ENUMS
 */
export declare enum NETWORK {
    MAINNET = "homestead",
    GÖRLI = "goerli",
    MATIC_MUMBAI = "maticmum",
    MATIC = "matic",
    OPTIMISM = "optimism",
    OPTIMISM_GOERLI = "optimism-goerli",
    ARBITRUM = "arbitrum",
    ARBITRUM_GOERLI = "arbitrum-goerli",
    ARBITRUM_NOVA = "arbitrum-nova",
    BSC = "bsc",
    BSC_TESTNET = "bsc-testnet",
    AVALANCHE = "avalanche",
    AVALANCHE_TESTNET = "avalanche-testnet",
    FANTOM = "fantom",
    FANTOM_TESTNET = "fantom-testnet",
    CRONOS = "cronos",
    CRONOS_TESTNET = "cronos-testnet",
    GNOSIS = "gnosis",
    CELO = "celo",
    SOLANA = "solana",
    SOLANA_TESTNET = "solana-testnet",
    SOLANA_DEVNET = "solana-devnet",
    HECO = "heco",
    HARMONY = "harmony",
    MOONRIVER = "moonriver",
    MOONBEAM = "moonbeam",
    METIS = "metis",
    KLATYN_TESTNET = "klaytn-testnet",
    FLOW = "mainnet",
    FLOW_TESTNET = "testnet"
}
export declare enum NETWORK_LABEL {
    MAINNET = "Mainnet",
    GÖRLI = "Goerli",
    MATIC_MUMBAI = "Polygon Mumbai",
    MATIC = "Polygon Mainnet",
    OPTIMISM = "Optimism Mainnet",
    OPTIMISM_GOERLI = "Optimism Goerli",
    ARBITRUM = "Arbitrum Mainnet",
    ARBITRUM_GOERLI = "Arbitrum Goerli",
    ARBITRUM_NOVA = "Arbitrum Nova",
    BSC = "Binance Smart Chain Mainnet",
    BSC_TESTNET = "Binance Smart Chain Testnet",
    AVALANCHE = "Avalanche Mainnet",
    AVALANCHE_TESTNET = "Avalanche Testnet",
    FANTOM = "Fantom Mainnet",
    FANTOM_TESTNET = "Fantom Testnet",
    CRONOS = "Cronos Mainnet",
    CRONOS_TESTNET = "Cronos Testnet",
    GNOSIS = "Gnosis Mainnet",
    CELO = "Celo Mainnet",
    SOLANA = "Solana Mainnet",
    SOLANA_TESTNET = "Solana Testnet",
    SOLANA_DEVNET = "Solana Devnet",
    HECO = "Huobi ECO Chain Mainnet",
    HARMONY = "Harmony Mainnet",
    MOONRIVER = "Moonriver Mainnet",
    MOONBEAM = "Moonbeam Mainnet",
    METIS = "Metis Mainnet",
    KLATYN_TESTNET = "Klaytn Baobab Testnet",
    FLOW = "Flow",
    FLOW_TESTNET = "Flow Testnet"
}
export declare enum NETWORK_PROVIDER {
    INFURA = "infura",
    ALCHEMY = "alchemy",
    QUICKNODE = "quicknode",
    CLOUDFARE = "cloudfare",
    CUSTOMRPC = "customRPC",
    CUSTOMWSS = "customWebsocket",
    BINANCE = "binance",
    POLYGON = "polygon",
    AVAX = "avalanche",
    GNOSIS = "gnosis",
    HECO = "heco",
    FANTOM = "fantom",
    SOLANA = "solana",
    HARMONY = "harmony",
    MOONRIVER = "moonriver",
    MOONBEAM = "moonbeam",
    METIS = "metis",
    KLAYTN = "klaytn",
    FLOW = "flow",
    FLOW_TESTNET = "flow_testnet"
}
export declare enum CHAIN_ID {
    MAINNET = 1,
    GÖRLI = 5,
    BINANCE_MAINNET = 56,
    BINANCE_TESTNET = 97,
    MATIC = 137,
    MATIC_MUMBAI = 80001,
    ARB_MAINNET = 42161,
    ARB_TESTNET_GOERLI = 421613,
    ARB_NOVA = 42170,
    OPT_MAINNET = 10,
    OPT_TESTNET_GOERLI = 420,
    CRONOS_MAINNET = 25,
    CRONOS_TESTNET = 338,
    AVALANCHE_MAINNET = 43114,
    AVALANCHE_TESTNET = 43113,
    FANTOM_MAINNET = 250,
    FANTOM_TESTNET = 4002,
    GNOSIS = 100,
    CELO = 42220,
    HECO = 128,
    HARMONY = 1666600000,
    MOONRIVER = 1285,
    MOONBEAM = 1284,
    METIS = 1088
}
export declare enum DOMAIN_ID {
    MAINNET = 6648936,
    GÖRLI = 3331,
    MATIC_MUMBAI = 9991
}
/**
 * Networks
 */
export declare const ETHNetworks: INodeOptionsValue[];
export declare const BSCNetworks: INodeOptionsValue[];
export declare const PolygonNetworks: INodeOptionsValue[];
export declare const ArbitrumNetworks: INodeOptionsValue[];
export declare const OptimismNetworks: INodeOptionsValue[];
export declare const AvalancheNetworks: INodeOptionsValue[];
export declare const SolanaNetworks: INodeOptionsValue[];
export declare const FantomNetworks: INodeOptionsValue[];
export declare const GnosisNetworks: INodeOptionsValue[];
export declare const HecoNetworks: INodeOptionsValue[];
export declare const HarmonyNetworks: INodeOptionsValue[];
export declare const MoonRiverNetworks: INodeOptionsValue[];
export declare const MoonBeamNetworks: INodeOptionsValue[];
export declare const MetisNetworks: INodeOptionsValue[];
export declare const KlatynNetworks: INodeOptionsValue[];
export declare const FLOWNetworks: INodeOptionsValue[];
/**
 * Network Providers
 */
export declare const customNetworkProviders: INodeOptionsValue[];
export declare const infuraNetworkProviders: INodeOptionsValue[];
export declare const alchemyNetworkProviders: INodeOptionsValue[];
export declare const quickNodeNetworkProviders: INodeOptionsValue[];
export declare const ethTestNetworkProviders: INodeOptionsValue[];
export declare const ethNetworkProviders: INodeOptionsValue[];
export declare const polygonNetworkProviders: INodeOptionsValue[];
export declare const binanceNetworkProviders: INodeOptionsValue[];
export declare const avalancheNetworkProviders: INodeOptionsValue[];
export declare const fantomNetworkProviders: INodeOptionsValue[];
export declare const gnosisNetworkProviders: INodeOptionsValue[];
export declare const hecoNetworkProviders: INodeOptionsValue[];
export declare const solanaNetworkProviders: INodeOptionsValue[];
export declare const harmonyNetworkProviders: INodeOptionsValue[];
export declare const moonriverNetworkProviders: INodeOptionsValue[];
export declare const moonbeamNetworkProviders: INodeOptionsValue[];
export declare const metisNetworkProviders: INodeOptionsValue[];
export declare const klaytnNetworkProviders: INodeOptionsValue[];
export declare const flowNetworkProviders: INodeOptionsValue[];
export declare const flowTestnetNetworkProviders: INodeOptionsValue[];
export declare function getCustomRPCProvider(jsonRPC: string): ethers.providers.JsonRpcProvider;
export declare function getCustomWebsocketProvider(websocketRPC: string): ethers.providers.WebSocketProvider;
export declare function getBscMainnetProvider(): Promise<ethers.providers.FallbackProvider>;
export declare function getBscTestnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getPolygonMainnetProvider(): Promise<ethers.providers.FallbackProvider>;
export declare function getPolygonTestnetProvider(): Promise<ethers.providers.FallbackProvider>;
export declare function getAvalancheTestnetProvider(): Promise<ethers.providers.FallbackProvider>;
export declare function getAvalancheMainnetProvider(): Promise<ethers.providers.FallbackProvider>;
export declare function getGnosisMainnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getHecoMainnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getFantomMainnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getFantomTestnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getHarmonyMainnetProvider(): Promise<ethers.providers.FallbackProvider>;
export declare function getMoonriverMainnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getMoonbeamMainnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getMetisMainnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getKlaytnTestnetProvider(): Promise<ethers.providers.JsonRpcProvider>;
export declare function getFallbackProvider(rpcs: string[], network: string, chainId: CHAIN_ID): Promise<ethers.providers.FallbackProvider>;
export declare function getNetworkProvider(networkProvider: NETWORK_PROVIDER, network: NETWORK, credentials: ICommonObject | undefined, jsonRPC?: string, websocketRPC?: string, isWebSocket?: boolean): Promise<ethers.providers.JsonRpcProvider | ethers.providers.FallbackProvider | ethers.providers.WebSocketProvider | null>;
export declare function getNetworkProvidersList(network: NETWORK): INodeOptionsValue[];
export declare const networkProviderCredentials: {
    label: string;
    name: string;
    type: string;
    options: {
        label: string;
        name: string;
        show: {
            'networks.networkProvider': NETWORK_PROVIDER[];
        };
    }[];
    show: {
        'networks.networkProvider': NETWORK_PROVIDER[];
    };
}[];
/**
 * URLs
 */
export declare const etherscanAPIs: INetworkMapping;
export declare const infuraHTTPAPIs: INetworkMapping;
export declare const infuraWSSAPIs: INetworkMapping;
export declare const alchemyHTTPAPIs: INetworkMapping;
export declare const alchemyWSSAPIs: INetworkMapping;
export declare const networkExplorers: INetworkMapping;
export declare const openseaExplorers: INetworkMapping;
export declare const binanceTestnetRPC: string[];
export declare const binanceMainnetRPC: string[];
export declare const polygonMumbaiRPC: string[];
export declare const polygonMainnetRPC: string[];
export declare const avalancheMainnetRPC: string[];
export declare const avalancheTestnetRPC: string[];
export declare const gnosisMainnetRPC: string[];
export declare const hecoMainnetRPC: string[];
export declare const fantomMainnetRPC: string[];
export declare const fantomTestnetRPC: string[];
export declare const solanaMainnetRPC: string[];
export declare const solanaDevnetRPC: string[];
export declare const solanaTestnetRPC: string[];
export declare const harmoneyMainnetRPC: string[];
export declare const moonriverMainnetRPC: string[];
export declare const moonbeamMainnetRPC: string[];
export declare const metisMainnetRPC: string[];
export declare const klaytnTestnetRPC: string[];
export declare const chainIdLookup: INetworkMapping;
export declare const domainIdLookup: INetworkMapping;
export declare const nativeCurrency: INetworkMapping;
export declare const eventTransferAbi: string[];
export declare const functionTransferAbi: string[];
export declare const erc1155SingleTransferAbi: string[];
export declare const erc1155BatchTransferAbi: string[];
