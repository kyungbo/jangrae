export interface ChecklistStep {
  id: number;
  title: string;
  description: string;
  tip?: string;
  warning?: string;
  phone?: string;
  phoneName?: string;
}

export interface ChecklistData {
  situation: string;
  title: string;
  description: string;
  steps: ChecklistStep[];
}

export type Situation = "hospital" | "home" | "accident";

export interface CalculatorInputs {
  guestCount: number;
  region: string;
  funeralType: string;
  hasSangjo: boolean;
}

export interface CostBreakdown {
  facilityRental: { min: number; max: number; label: string };
  food: { min: number; max: number; label: string };
  sangjo: { min: number; max: number; label: string };
  cremation: { min: number; max: number; label: string };
  misc: { min: number; max: number; label: string };
  total: { min: number; max: number };
}

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  tags: string[];
  sections: GuideSection[];
}

export interface GuideSection {
  heading: string;
  content: string;
}

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  region: string;
  bio: string;
  rating: number;
  reviewCount: number;
  available: boolean;
}
