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
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-4f408377f224?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-8f04813e11e8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-6d5c77a8e7b4?w=400&h=300&fit=crop",
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
