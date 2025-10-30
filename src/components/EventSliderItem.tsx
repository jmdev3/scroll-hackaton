"use client";

import { Image } from "antd";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import type { Event } from "@/types";
import styles from "./EventSlider.module.css";
import PredictionButton from "./PredictionButton/PredictionButton";

export default function EventSliderItem({ event }: { event: Event }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/event/${event.id}`);
  };

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
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    <div className={styles.sliderItem} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <Image
          preview={false}
          src={event.image_url}
          alt={event.question}
          className={styles.image}
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
