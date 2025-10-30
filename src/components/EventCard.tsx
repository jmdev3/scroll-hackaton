import { Image } from "antd";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import type { Event } from "@/types";
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

  const getCountdown = () => {
    const now = Date.now();
    if (event.ends_at < now) {
      return "Ended";
    }
    return `Ends ${formatDistanceToNow(event.ends_at, { addSuffix: true })}`;
  };

  const isResolved = event.outcome !== undefined && event.outcome !== null;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          preview={false}
          src={event.image_url}
          alt={event.question}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.question}>{event.question}</h3>

        <div className={styles.countdown}>{getCountdown()}</div>

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
  );
}
