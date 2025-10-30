import { useEffect, useMemo, useState } from "react";
import { Address, createPublicClient, createWalletClient, custom, formatEther, http } from "viem";
import { SCROLL_SEPOLIA_RPC } from "../constants";
import deployedAddresses from "../contracts/deployed_addresses.json";
import USDCABI from "../contracts/USDC.json";
import { defineChain } from "viem";

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

const USDC_ADDRESS = deployedAddresses["USDCModule#USDC"] as Address;

export function useWallet() {
  const [account, setAccount] = useState<Address | null>(null);
  const [nativeBalance, setNativeBalance] = useState<bigint | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Create public client
  const publicClient = useMemo(() => {
    try {
      const transport =
        typeof window !== "undefined" && window.ethereum
          ? custom(window.ethereum)
          : http(SCROLL_SEPOLIA_RPC);

      return createPublicClient({
        chain: scrollSepolia,
        transport,
      });
    } catch (error) {
      console.error("Failed to create public client:", error);
      return null;
    }
  }, []);

  // Create wallet client
  const walletClient = useMemo(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        return createWalletClient({
          chain: scrollSepolia,
          transport: custom(window.ethereum),
        });
      } catch (error) {
        console.error("Failed to create wallet client:", error);
        return null;
      }
    }
    return null;
  }, []);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum && publicClient) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts && accounts.length > 0) {
            const address = accounts[0] as Address;
            setAccount(address);
            await fetchBalances(address);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setNativeBalance(null);
          setUsdcBalance(null);
        } else {
          const address = accounts[0] as Address;
          setAccount(address);
          fetchBalances(address);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [publicClient]);

  // Fetch balances for native currency and USDC
  const fetchBalances = async (address: Address) => {
    if (!publicClient) return;

    try {
      // Fetch native balance
      const balance = await publicClient.getBalance({ address });
      setNativeBalance(balance);

      // Fetch USDC balance
      const usdcBalanceResult = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: USDCABI.abi as any,
        functionName: "balanceOf",
        args: [address],
      });

      setUsdcBalance(usdcBalanceResult as bigint);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  // Connect wallet
  const connect = async () => {
    if (!window.ethereum) {
      throw new Error("No wallet provider found. Please install MetaMask or another Web3 wallet.");
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0] as Address;
        setAccount(address);
        await fetchBalances(address);
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null);
    setNativeBalance(null);
    setUsdcBalance(null);
  };

  // Format native balance
  const formattedNativeBalance = useMemo(() => {
    if (nativeBalance === null) return "0.00";
    return parseFloat(formatEther(nativeBalance)).toFixed(4);
  }, [nativeBalance]);

  // Format USDC balance (USDC has 6 decimals)
  const formattedUsdcBalance = useMemo(() => {
    if (usdcBalance === null) return "0.00";
    // USDC has 6 decimals
    return (Number(usdcBalance) / 1e6).toFixed(2);
  }, [usdcBalance]);

  return {
    account,
    isConnected: !!account,
    isConnecting,
    nativeBalance,
    usdcBalance,
    formattedNativeBalance,
    formattedUsdcBalance,
    connect,
    disconnect,
    refreshBalances: () => account && fetchBalances(account),
    walletClient,
    publicClient,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (args: any) => void) => void;
      removeListener: (event: string, callback: (args: any) => void) => void;
      selectedAddress?: string;
    };
  }
}
