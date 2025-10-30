import type { Address } from "viem";
import { Outcome } from "@/hooks/useMarketContract";

export interface Event {
  collateral: Address;
  owner: Address;
  question: string;
  resolved: boolean;
  result: Outcome;
  totalBalance: bigint;
  totalNoShares: bigint;
  totalYesShares: bigint;
  // Optional: index for display purposes
  id?: string | number;
}

export const PLACEHOLDER_IMAGES = [
  // Sports & Competition
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop", // Basketball
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=300&fit=crop", // Football
  "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=300&fit=crop", // Racing

  // Technology & Innovation
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", // AI/Robotics
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop", // Coding
  "https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=400&h=300&fit=crop", // Technology

  // Finance & Business
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop", // Stock market
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", // Trading
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", // Economy

  // Politics & Current Events
  "https://images.unsplash.com/photo-1586962434213-cee7e4fe3b56?w=400&h=300&fit=crop", // Voting
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", // Government
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", // Politics

  // Entertainment & Culture
  "https://images.unsplash.com/photo-1489599807961-c79686cb15c2?w=400&h=300&fit=crop", // Movies
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop", // Music
  "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop", // Gaming

  // Science & Research
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", // Laboratory
  "https://images.unsplash.com/photo-1446776811953-b23d579212c5?w=400&h=300&fit=crop", // Space
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop", // Research
];

/**
 * Get a random placeholder image, optionally seeded by a value for consistent assignment
 */
export const getRandomPlaceholderImage = (seed?: string | number): string => {
  if (seed !== undefined) {
    // Use seed to consistently assign image for the same market
    const index = typeof seed === "number" ? seed : hashString(seed);
    return PLACEHOLDER_IMAGES[Math.abs(index) % PLACEHOLDER_IMAGES.length];
  }
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
};

/**
 * Simple hash function to convert string to number for consistent image assignment
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}
