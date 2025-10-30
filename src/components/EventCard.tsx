"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import styles from "./EventCard.module.css";

export interface Event {
  id: string;
  question: string;
  outcome?: boolean;
  image_url: string;
  ends_at: number;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
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
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img src={event.image_url} alt={event.question} className={styles.image} />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.question}>{event.question}</h3>
        
        <div className={styles.countdown}>{getCountdown()}</div>
        
        {isResolved ? (
          <div className={styles.resolvedBadge}>
            Resolved: {event.outcome ? "Yes" : "No"}
          </div>
        ) : (
          <div className={styles.buttonsContainer}>
            <button
              className={`${styles.button} ${styles.yesButton}`}
              onClick={handleYesClick}
            >
              Yes
            </button>
            <button
              className={`${styles.button} ${styles.noButton}`}
              onClick={handleNoClick}
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

