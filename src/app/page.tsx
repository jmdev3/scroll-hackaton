"use client";

import { Layout } from "antd";
import { EventCard } from "@/components";
import HeroSection from "@/components/HeroSection";
import type { Event } from "@/types";
import styles from "./landing.module.css";

// Sample events data
const sampleEvents: Event[] = [
  {
    id: "1",
    question: "Lakers vs. Grizzlies: Who wins?",
    image_url:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop",
    ends_at: Date.now() + 86400000, // 1 day from now
  },
  {
    id: "2",
    question: "Will Bitcoin reach $100k by end of year?",
    image_url:
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop",
    ends_at: Date.now() + 172800000, // 2 days from now
  },
  {
    id: "3",
    question: "Will it rain tomorrow in San Francisco?",
    image_url:
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&auto=format&fit=crop",
    ends_at: Date.now() + 43200000, // 12 hours from now
  },
  {
    id: "4",
    question: "Will the new iPhone be released in September?",
    outcome: true,
    image_url:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop",
    ends_at: Date.now() - 86400000, // Ended 1 day ago
  },
  {
    id: "5",
    question: "Golden State Warriors to win NBA Championship?",
    image_url:
      "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800&auto=format&fit=crop",
    ends_at: Date.now() + 259200000, // 3 days from now
  },
  {
    id: "6",
    question: "Will Tesla stock hit $300 this month?",
    outcome: false,
    image_url:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    ends_at: Date.now() - 172800000, // Ended 2 days ago
  },
];

export default function Home() {
  return (
    <Layout className={styles.layout}>
      <Layout className={styles.contentLayout}>
        <Layout.Content className={styles.content}>
          {/* Hero Section */}
          <HeroSection />

          {/* Event Cards Grid */}
          <div className={styles.eventsGrid}>
            {sampleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
