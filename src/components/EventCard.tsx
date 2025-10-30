import { Image } from "antd";
import { useMemo } from "react";
import type { Event } from "@/types";
import { getRandomPlaceholderImage } from "@/types";
import { Outcome } from "@/hooks/useMarketContract";
import styles from "./EventCard.module.css";
import PredictionButton from "./PredictionButton/PredictionButton";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
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
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          preview={false}
          src={imageUrl}
          alt={event.question}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.question}>{event.question}</h3>

        {totalShares > 0 && (
          <div className={styles.stats}>
            <span>Yes: {Number(event.totalYesShares).toLocaleString()}</span>
            <span>No: {Number(event.totalNoShares).toLocaleString()}</span>
          </div>
        )}

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
  );
}
