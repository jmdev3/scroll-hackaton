"use client";

import { formatDistanceToNow } from "date-fns";
import type { Event } from "@/types";
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

  const getCountdown = () => {
    const now = Date.now();
    if (event.ends_at < now) {
      return "Ended";
    }
    return `Ends ${formatDistanceToNow(event.ends_at, { addSuffix: true })}`;
  };

  const isResolved = event.outcome !== undefined && event.outcome !== null;

  return (
    <div className={styles.sliderItem}>
      <div className={styles.imageContainer}>
        {/** biome-ignore lint/performance/noImgElement: testing */}
        <img
          src={event.image_url}
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
            <div className={styles.countdown}>{getCountdown()}</div>
          </div>

          {isResolved ? (
            <div className={styles.resolvedBadge}>Resolved: {event.outcome ? "Yes" : "No"}</div>
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
