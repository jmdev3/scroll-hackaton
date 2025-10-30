"use client";

import { Outcome } from "@/hooks/useMarketContract";
import type { Event } from "@/types";
import EventSlider from "./EventSlider";
import styles from "./HeroSection.module.css";

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: "1",
    collateral: "0xaD2588AFAE3Fb69ec39966d8E732021fe63BFe86" as const,
    owner: "0x4e62C4aFF48d80D67a395180ed5b6A0E1b924Bff" as const,
    question: "Will Bitcoin reach $100,000 by end of 2024?",
    resolved: false,
    result: Outcome.YES,
    totalBalance: 0n,
    totalNoShares: 0n,
    totalYesShares: 0n,
  },
  {
    id: "2",
    collateral: "0xaD2588AFAE3Fb69ec39966d8E732021fe63BFe87" as const,
    owner: "0x4e62C4aFF48d80D67a395180ed5b6A0E1b924Bff" as const,
    question: "Will the Lakers win the NBA championship this season?",
    resolved: false,
    result: Outcome.NO,
    totalBalance: 0n,
    totalNoShares: 0n,
    totalYesShares: 0n,
  },
  {
    id: "3",
    collateral: "0xaD2588AFAE3Fb69ec39966d8E732021fe63BFe88" as const,
    owner: "0x4e62C4aFF48d80D67a395180ed5b6A0E1b924Bff" as const,
    question: "Will AI achieve human-level reasoning by 2025?",
    resolved: false,
    result: Outcome.YES,
    totalBalance: 0n,
    totalNoShares: 0n,
    totalYesShares: 0n,
  },
];

const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <EventSlider
          events={mockEvents}
          autoplay={true}
          autoplaySpeed={5000}
          showDots={true}
          showArrows={true}
        />
      </div>
    </div>
  );
};

export default HeroSection;
