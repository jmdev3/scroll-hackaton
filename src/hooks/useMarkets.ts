import { useCallback, useEffect, useRef, useState } from "react";
import { MarketInfo, useMarketContract } from "./useMarketContract";

export interface UseMarketsReturn {
  markets: MarketInfo[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch all markets from the contract
 * Automatically loads markets on mount when contract is ready
 */
export function useMarkets(): UseMarketsReturn {
  const [markets, setMarkets] = useState<MarketInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const marketContract = useMarketContract();
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const loadMarkets = useCallback(async () => {
    // Prevent duplicate calls
    if (isLoadingRef.current || !marketContract.isReady) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Get the total count of markets
      const count = await marketContract.getMarketsCount();
      const marketCount = Number(count);

      if (marketCount === 0) {
        setMarkets([]);
        hasLoadedRef.current = true;
        return;
      }

      // Fetch all markets by index
      const marketsData: MarketInfo[] = [];
      for (let i = 0; i < marketCount; i++) {
        try {
          const market = await marketContract.getMarketById(i);
          marketsData.push(market);
        } catch (error) {
          console.error(`Error loading market ${i}:`, error);
          // Continue loading other markets even if one fails
        }
      }

      setMarkets(marketsData);
      hasLoadedRef.current = true;
    } catch (error: any) {
      console.error("Error loading markets:", error);
      const errorMessage =
        error.message || "Failed to load markets";
      setError(new Error(errorMessage));
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketContract.isReady]);

  // Load markets on mount when contract is ready
  useEffect(() => {
    if (marketContract.isReady && !isLoadingRef.current && !hasLoadedRef.current) {
      loadMarkets();
    }
  }, [marketContract.isReady, loadMarkets]);

  // Refresh function that allows manual refresh
  const refresh = useCallback(async () => {
    hasLoadedRef.current = false;
    await loadMarkets();
  }, [loadMarkets]);

  return {
    markets,
    loading,
    error,
    refresh,
  };
}
