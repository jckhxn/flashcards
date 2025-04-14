export interface FlashCardData {
  question: string;
  hint?: string;
  answer: string;
  details?: string;
}

export type GenerationTab = "ai" | "manual";
export type ViewMode = "generation" | "study" | "list" | "sets";

export interface FlashCardSet {
  id: string;
  created_at: string;
  name: string;
  topic: string;
  cards: FlashCardData[];
  isAIGenerated: boolean;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      card_sets: {
        Row: FlashCardSet;
        Insert: Omit<FlashCardSet, "id" | "created_at">;
        Update: Partial<Omit<FlashCardSet, "id" | "created_at">>;
      };
    };
  };
}
