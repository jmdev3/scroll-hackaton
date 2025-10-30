import USDCABI from "@/contracts/USDC.json";
import deployedAddresses from "@/contracts/deployed_addresses.json";
import { Outcome, useMarketContract, useWallet } from "@/hooks";
import type { Event } from "@/types";
import { getRandomPlaceholderImage } from "@/types";
import { Image, message } from "antd";
import { useMemo, useState } from "react";
import { Address, parseUnits } from "viem";
import styles from "./EventCard.module.css";
import PredictionButton from "./PredictionButton/PredictionButton";

const MARKET_ADDRESS = deployedAddresses["MarketModule#Market"] as Address;
const USDC_ADDRESS = deployedAddresses["USDCModule#USDC"] as Address;

interface EventCardProps {
  event: Event;
  marketId: number;
  onBetPlaced?: () => void;
}

export default function EventCard({ event, marketId, onBetPlaced }: EventCardProps) {
  const wallet = useWallet();
  const marketContract = useMarketContract();
  const [isBuyingYes, setIsBuyingYes] = useState(false);
  const [isBuyingNo, setIsBuyingNo] = useState(false);

  const handleBuyShares = async (isYes: boolean) => {
    if (!wallet.isConnected) {
      message.error("Please connect your wallet to buy shares");
      return;
    }

    if (event.resolved) {
      message.error("This market is already resolved");
      return;
    }

    if (!wallet.account) {
      message.error("No wallet account found");
      return;
    }

    if (!marketContract.hasWallet) {
      message.error("Wallet client not available");
      return;
    }

    try {
      // 1 USDC = 1e6 (USDC has 6 decimals)
      const betAmount = parseUnits("1", 6);

      // Set loading state
      if (isYes) {
        setIsBuyingYes(true);
      } else {
        setIsBuyingNo(true);
      }

      // Check USDC allowance
      const publicClient = wallet.publicClient;
      if (!publicClient) {
        throw new Error("Public client not available");
      }

      const allowance = (await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: USDCABI.abi as any,
        functionName: "allowance",
        args: [wallet.account, MARKET_ADDRESS],
      })) as bigint;

      // If allowance is insufficient, approve first
      if (allowance < betAmount) {
        message.loading({ content: "Approving USDC...", key: "approve", duration: 0 });

        // Create wallet client for approval
        const { createWalletClient, custom } = await import("viem");
        if (typeof window === "undefined" || !window.ethereum) {
          throw new Error("No wallet provider found");
        }

        const walletClient = createWalletClient({
          transport: custom(window.ethereum),
        });

        const accounts = await walletClient.getAddresses();
        const account = accounts[0];
        if (!account) {
          throw new Error("No account connected");
        }

        const approveHash = await walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: USDCABI.abi as any,
          functionName: "approve",
          args: [MARKET_ADDRESS, betAmount],
          account,
          chain: null,
        });

        await marketContract.waitForTransaction(approveHash);
        message.success({ content: "USDC approved successfully!", key: "approve" });
      }

      // Place the bet
      message.loading({
        content: `Buying ${isYes ? "Yes" : "No"} share...`,
        key: "place-bet",
        duration: 0,
      });

      const txHash = await marketContract.placeBet(marketId, isYes, betAmount);
      await marketContract.waitForTransaction(txHash);

      message.success({
        content: `Successfully bought 1 ${isYes ? "Yes" : "No"} share!`,
        key: "place-bet",
      });

      // Refresh balances and markets
      await wallet.refreshBalances();
      if (onBetPlaced) {
        onBetPlaced();
      }
    } catch (error: any) {
      console.error("Error buying shares:", error);
      message.error({
        content: `Failed to buy share: ${error.message || "Unknown error"}`,
        key: "place-bet",
      });
    } finally {
      setIsBuyingYes(false);
      setIsBuyingNo(false);
    }
  };

  const handleYesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleBuyShares(true);
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleBuyShares(false);
  };

  // Assign image based on collateral address for consistency
  const imageUrl = useMemo(() => {
    return getRandomPlaceholderImage(event.collateral);
  }, [event.collateral]);

  // Determine if resolved and get result
  const isResolved = event.resolved;
  const resultText = event.result === Outcome.YES ? "Yes" : "No";

  // Calculate total shares for display (USDC has 6 decimals)
  const totalYesSharesFormatted = (Number(event.totalYesShares) / 1e6).toFixed(6);
  const totalNoSharesFormatted = (Number(event.totalNoShares) / 1e6).toFixed(6);
  const totalShares = Number(event.totalYesShares) + Number(event.totalNoShares);

  // Calculate odds and probabilities
  const yesProbability = totalShares > 0 ? (Number(event.totalYesShares) / totalShares) * 100 : 50;
  const noProbability = totalShares > 0 ? (Number(event.totalNoShares) / totalShares) * 100 : 50;

  // Calculate decimal odds (payout multiplier)
  const yesOdds =
    Number(event.totalYesShares) > 0 && totalShares > 0
      ? (totalShares / Number(event.totalYesShares)).toFixed(2)
      : "2.00";
  const noOdds =
    Number(event.totalNoShares) > 0 && totalShares > 0
      ? (totalShares / Number(event.totalNoShares)).toFixed(2)
      : "2.00";

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image preview={false} src={imageUrl} alt={event.question} className={styles.image} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.question}>{event.question}</h3>

        {totalShares > 0 ? (
          <div className={styles.stats}>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Yes:</span>
              <span>{totalYesSharesFormatted}</span>
              <span className={styles.odds}>({yesProbability.toFixed(1)}%)</span>
              <span className={styles.decimalOdds}>{yesOdds}x</span>
            </div>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>No:</span>
              <span>{totalNoSharesFormatted}</span>
              <span className={styles.odds}>({noProbability.toFixed(1)}%)</span>
              <span className={styles.decimalOdds}>{noOdds}x</span>
            </div>
          </div>
        ) : (
          <div className={styles.stats}>
            <div className={styles.shareRow}>
              <span className={styles.odds}>No bets yet</span>
            </div>
          </div>
        )}

        {isResolved ? (
          <div className={styles.resolvedBadge}>Resolved: {resultText}</div>
        ) : (
          <div className={styles.buttonsContainer}>
            <PredictionButton
              variant="yes"
              onClick={handleYesClick}
              disabled={isBuyingYes || isBuyingNo}
            >
              {isBuyingYes ? "Buying..." : "Yes"}
            </PredictionButton>
            <PredictionButton
              variant="no"
              onClick={handleNoClick}
              disabled={isBuyingYes || isBuyingNo}
            >
              {isBuyingNo ? "Buying..." : "No"}
            </PredictionButton>
          </div>
        )}
      </div>
    </div>
  );
}
