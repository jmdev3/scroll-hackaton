"use client";

import { Carousel } from "antd";
import styles from "./EventSlider.module.css";
import EventSliderItem from "./EventSliderItem";
import type { Event } from "@/types";

interface EventSliderProps {
  events: Event[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export default function EventSlider({
  events,
  autoplay = false,
  autoplaySpeed = 5000,
  showDots = true,
  showArrows = true,
}: EventSliderProps) {
  if (!events || events.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No events available</p>
      </div>
    );
  }

  return (
    <div className={styles.sliderContainer}>
      <Carousel
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        dots={showDots}
        arrows={showArrows}
        infinite={true}
        slidesToShow={1}
        slidesToScroll={1}
        className={styles.carousel}
      >
        {events.map((event, index) => (
          <div key={event.id ?? `${event.collateral}-${index}`} className={styles.slide}>
            <EventSliderItem event={event} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
