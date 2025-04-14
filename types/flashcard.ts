export interface FlashCardData {
  question: string;
  hint?: string;
  answer: string;
  details?: string;
}

export interface CardSet {
  id: string;
  name: string;
  cards: FlashCardData[];
  isAIGenerated: boolean;
  createdAt: string;
}

export type ViewMode = "generation" | "study" | "list" | "sets";
export type GenerationTab = "ai" | "manual";
