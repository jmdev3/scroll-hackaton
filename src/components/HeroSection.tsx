"use client";

import EventSlider from "./EventSlider";
import styles from "./HeroSection.module.css";

// Mock data for demonstration
const mockEvents = [
  {
    id: "1",
    question: "Will Bitcoin reach $100,000 by end of 2024?",
    image_url: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop",
    ends_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  },
  {
    id: "2",
    question: "Will the Lakers win the NBA championship this season?",
    image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
    ends_at: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
  },
  {
    id: "3",
    question: "Will AI achieve human-level reasoning by 2025?",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    ends_at: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
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
