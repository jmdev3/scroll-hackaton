export interface Event {
  id: string;
  question: string;
  outcome?: boolean;
  image_url: string;
  ends_at: number;
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

export const getRandomPlaceholderImage = (): string => {
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
};
