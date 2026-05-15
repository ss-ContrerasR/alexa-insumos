export interface Product {
  id: number;

  name: string;

  description: string;

  price: number;

  category: string;

  emoji: string;

  colors: string[];

  // ADD THIS
  image?: string;

  badge?: string;

  badgeColor?: string;
}

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  gradient: string;
  emoji: string;
  accent: string;
}
