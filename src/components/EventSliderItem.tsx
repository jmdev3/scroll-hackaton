"use client";

import { useMemo } from "react";
import type { Event } from "@/types";
import { getRandomPlaceholderImage } from "@/types";
import { Outcome } from "@/hooks/useMarketContract";
import styles from "./EventSlider.module.css";
import PredictionButton from "./PredictionButton/PredictionButton";

export default function EventSliderItem({ event }: { event: Event }) {
  const handleYesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement Yes button logic
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement No button logic
  };

  // Assign image based on collateral address for consistency
  const imageUrl = useMemo(() => {
    return getRandomPlaceholderImage(event.collateral);
  }, [event.collateral]);

  // Determine if resolved and get result
  const isResolved = event.resolved;
  const resultText = event.result === Outcome.YES ? "Yes" : "No";

  // Calculate total shares for display
  const totalShares = Number(event.totalYesShares) + Number(event.totalNoShares);

  return (
    <div className={styles.sliderItem}>
      <div className={styles.imageContainer}>
        {/** biome-ignore lint/performance/noImgElement: testing */}
        <img
          src={imageUrl}
          alt={event.question}
          className={styles.image}
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop";
          }}
        />

        <div className={styles.overlay}>
          <div className={styles.questionContainer}>
            <h3 className={styles.question}>{event.question}</h3>
            {totalShares > 0 && (
              <div className={styles.countdown}>
                Yes: {Number(event.totalYesShares).toLocaleString()} | No: {Number(event.totalNoShares).toLocaleString()}
              </div>
            )}
          </div>

          {isResolved ? (
            <div className={styles.resolvedBadge}>Resolved: {resultText}</div>
          ) : (
            <div className={styles.buttonsContainer}>
              <PredictionButton variant="yes" onClick={handleYesClick}>
                Yes
              </PredictionButton>
              <PredictionButton variant="no" onClick={handleNoClick}>
                No
              </PredictionButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
