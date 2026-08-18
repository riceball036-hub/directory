export type Pricing = "Free" | "Freemium" | "Premium";

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  intro: string;
  icon: string;
  order: number;
}

export interface DirectorySite {
  slug: string;
  name: string;
  url: string;
  description: string;
  review: string;
  categories: string[];
  tags: string[];
  pricing: Pricing;
  rank: number;
  featured: boolean;
  verifiedAt: string;
  linkRel: string;
  demo?: boolean;
}

