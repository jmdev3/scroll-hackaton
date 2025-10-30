import { useMemo } from "react";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
  PublicClient,
  WalletClient,
} from "viem";
import { SCROLL_SEPOLIA_RPC } from "../constants";
import deployedAddresses from "../contracts/deployed_addresses.json";
import MarketABI from "../contracts/Market.json";

// Scroll Sepolia chain definition (Chain ID: 534351)
const scrollSepolia = defineChain({
  id: 534351,
  name: "Scroll Sepolia",
  network: "scroll-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [SCROLL_SEPOLIA_RPC],
    },
    public: {
      http: [SCROLL_SEPOLIA_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: "ScrollSepolia Explorer",
      url: "https://sepolia.scrollscan.com",
    },
  },
  testnet: true,
});

// Contract address - you may want to make this configurable per network
const MARKET_ADDRESS = deployedAddresses["MarketModule#Market"] as Address;

// Types based on contract structure
export enum Outcome {
  YES = 0,
  NO = 1,
}

export interface MarketInfo {
  owner: Address;
  question: string;
  collateral: Address;
  totalYesShares: bigint;
  totalNoShares: bigint;
  totalBalance: bigint;
  result: Outcome;
  resolved: boolean;
}

export interface UseMarketContractOptions {
  // RPC URL for the network (e.g., "http://localhost:8545" or a public RPC)
  rpcUrl?: string;
  // Wallet client for write operations (can be passed from wallet connection)
  walletClient?: WalletClient;
  // Chain ID (optional, defaults based on RPC)
  chainId?: number;
}

/**
 * Hook to interact with the Market contract
 *
 * @param options Configuration options for the contract interaction
 * @returns Object with contract interaction functions
 */
export function useMarketContract(options: UseMarketContractOptions = {}) {
  const { rpcUrl, walletClient: providedWalletClient } = options;

  // Create public client for read operations
  const publicClient: PublicClient | null = useMemo(() => {
    try {
      const hasWindowEthereum = typeof window !== "undefined" && window.ethereum;

      // Use provided RPC URL, or window.ethereum if available, or default to Scroll Sepolia RPC
      const transport = rpcUrl
        ? http(rpcUrl)
        : hasWindowEthereum
          ? custom(window.ethereum)
          : http(SCROLL_SEPOLIA_RPC);

      // Use Scroll Sepolia chain when using Scroll Sepolia RPC (not using window.ethereum)
      const chain = !hasWindowEthereum || rpcUrl ? scrollSepolia : undefined;

      return createPublicClient({
        chain,
        transport,
      });
    } catch (error) {
      console.error("Failed to create public client:", error);
      return null;
    }
  }, [rpcUrl]);

  // Create wallet client from window.ethereum if available
  const walletClient: WalletClient | null = useMemo(() => {
    if (providedWalletClient) {
      return providedWalletClient;
    }

    if (typeof window !== "undefined" && window.ethereum) {
      try {
        return createWalletClient({
          transport: custom(window.ethereum),
        });
      } catch (error) {
        console.error("Failed to create wallet client:", error);
        return null;
      }
    }

    return null;
  }, [providedWalletClient]);

  /**
   * Get the total number of markets
   */
  const getMarketsCount = async (): Promise<bigint> => {
    if (!publicClient) {
      throw new Error("Public client not available");
    }

    try {
      // Verify contract exists by checking code
      const code = await publicClient.getBytecode({ address: MARKET_ADDRESS });
      if (!code || code === "0x") {
        throw new Error(
          `No contract found at address ${MARKET_ADDRESS}. Please verify the contract is deployed on Scroll Sepolia.`
        );
      }

      const count = await publicClient.readContract({
        address: MARKET_ADDRESS,
        abi: MarketABI.abi as any,
        functionName: "getMarketsCount",
        args: [],
      });

      return count as bigint;
    } catch (error: any) {
      console.error("Error getting markets count:", error);
      if (error.message?.includes("No contract found")) {
        throw error;
      }
      throw new Error(
        `Failed to call getMarketsCount: ${error.message || "Unknown error"}. Contract address: ${MARKET_ADDRESS}`
      );
    }
  };

  /**
   * Get market information by ID
   */
  const getMarketById = async (marketId: number): Promise<MarketInfo> => {
    if (!publicClient) {
      throw new Error("Public client not available");
    }

    try {
      const result = (await publicClient.readContract({
        address: MARKET_ADDRESS,
        abi: MarketABI.abi as any,
        functionName: "getMarketById",
        args: [BigInt(marketId)],
      })) as [Address, string, Address, bigint, bigint, bigint, Outcome, boolean];

      return {
        owner: result[0],
        question: result[1],
        collateral: result[2],
        totalYesShares: result[3],
        totalNoShares: result[4],
        totalBalance: result[5],
        result: result[6],
        resolved: result[7],
      };
    } catch (error) {
      console.error(`Error getting market ${marketId}:`, error);
      throw error;
    }
  };

  /**
   * Get user's shares for a specific market
   */
  const getUserShares = async (
    marketId: number,
    userAddress: Address,
    isYes: boolean
  ): Promise<bigint> => {
    if (!publicClient) {
      throw new Error("Public client not available");
    }

    try {
      const shares = await publicClient.readContract({
        address: MARKET_ADDRESS,
        abi: MarketABI.abi as any,
        functionName: "getUserShares",
        args: [BigInt(marketId), userAddress, isYes],
      });

      return shares as bigint;
    } catch (error) {
      console.error("Error getting user shares:", error);
      throw error;
    }
  };

  /**
   * Create a new market
   */
  const createMarket = async (question: string, collateralAddress: Address): Promise<string> => {
    if (!walletClient) {
      throw new Error("Wallet client not available. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    if (!account) {
      throw new Error("No account connected. Please connect your wallet.");
    }

    try {
      const hash = await walletClient.writeContract({
        address: MARKET_ADDRESS,
        abi: MarketABI.abi as any,
        functionName: "createMarket",
        args: [question, collateralAddress],
        account,
        chain: null,
      });

      return hash;
    } catch (error) {
      console.error("Error creating market:", error);
      throw error;
    }
  };

  /**
   * Place a bet on a market
   */
  const placeBet = async (marketId: number, isYes: boolean, betAmount: bigint): Promise<string> => {
    if (!walletClient) {
      throw new Error("Wallet client not available. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    if (!account) {
      throw new Error("No account connected. Please connect your wallet.");
    }

    try {
      const hash = await walletClient.writeContract({
        address: MARKET_ADDRESS,
        abi: MarketABI.abi as any,
        functionName: "placeBet",
        args: [BigInt(marketId), isYes, betAmount],
        account,
        chain: null,
      });

      return hash;
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  };

  /**
   * Solve a market (only owner can call)
   */
  const solveMarket = async (marketId: number, result: Outcome): Promise<string> => {
    if (!walletClient) {
      throw new Error("Wallet client not available. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    if (!account) {
      throw new Error("No account connected. Please connect your wallet.");
    }

    try {
      const hash = await walletClient.writeContract({
        address: MARKET_ADDRESS,
        abi: MarketABI.abi as any,
        functionName: "solveMarket",
        args: [BigInt(marketId), result],
        account,
        chain: null,
      });

      return hash;
    } catch (error) {
      console.error("Error solving market:", error);
      throw error;
    }
  };

  /**
   * Settle a market to claim winnings
   */
  const settle = async (marketId: number): Promise<string> => {
    if (!walletClient) {
      throw new Error("Wallet client not available. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    if (!account) {
      throw new Error("No account connected. Please connect your wallet.");
    }

    try {
      const hash = await walletClient.writeContract({
        address: MARKET_ADDRESS,
        abi: MarketABI.abi as any,
        functionName: "settle",
        args: [BigInt(marketId)],
        account,
        chain: null,
      });

      return hash;
    } catch (error) {
      console.error("Error settling market:", error);
      throw error;
    }
  };

  /**
   * Wait for a transaction to be mined
   */
  const waitForTransaction = async (hash: string): Promise<any> => {
    if (!publicClient) {
      throw new Error("Public client not available");
    }

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
      });
      return receipt;
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      throw error;
    }
  };

  return {
    // Contract address
    contractAddress: MARKET_ADDRESS,

    // Read operations
    getMarketsCount,
    getMarketById,
    getUserShares,

    // Write operations
    createMarket,
    placeBet,
    solveMarket,
    settle,

    // Utilities
    waitForTransaction,

    // Client status
    isReady: !!publicClient,
    hasWallet: !!walletClient,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
