import type { Address } from "viem";
import type { Outcome } from "@/hooks/useMarketContract";

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
	"https://cdn.nba.com/manage/2021/08/michael-jordan-looks.jpg",
	"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
	"https://images.unsplash.com/photo-1752119769630-81c074181749?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=686",
	"https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1623",
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
	return PLACEHOLDER_IMAGES[
		Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)
	];
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
