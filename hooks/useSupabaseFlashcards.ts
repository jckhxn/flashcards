import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FlashCardData, FlashCardSet } from "@/types/flashcard";

export function useSupabaseFlashcards() {
  const [cardSets, setCardSets] = useState<FlashCardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCardSets();
  }, []);

  const loadCardSets = async () => {
    try {
      setLoading(true);
      console.log("Loading card sets...");

      const { data, error } = await supabase
        .from("card_sets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Loaded card sets:", data);
      setCardSets(data || []);
      setError(null);
    } catch (err) {
      console.error("Error loading card sets:", err);
      setError(err instanceof Error ? err.message : "Failed to load card sets");
    } finally {
      setLoading(false);
    }
  };

  const getCardSetsByTopic = (topic: string) => {
    return cardSets.filter(
      (set) => set.topic.toLowerCase() === topic.toLowerCase()
    );
  };

  const getTopics = () => {
    const topics = new Set(cardSets.map((set) => set.topic));
    return Array.from(topics).sort();
  };

  const saveCardSet = async (set: Omit<FlashCardSet, "id" | "created_at">) => {
    try {
      setLoading(true);
      console.log("Attempting to save card set:", set);

      const { data, error } = await supabase
        .from("card_sets")
        .insert([
          {
            name: set.name,
            topic: set.topic,
            cards: set.cards,
            is_ai_generated: set.isAIGenerated,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from Supabase");
      }

      console.log("Successfully saved card set:", data);
      // Immediately update the local state with the new set
      setCardSets((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Error saving card set:", err);
      setError(err instanceof Error ? err.message : "Failed to save card set");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCardSet = async (setId: string) => {
    try {
      const { error } = await supabase
        .from("card_sets")
        .delete()
        .eq("id", setId);

      if (error) throw error;
      await loadCardSets();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete card set"
      );
    }
  };

  return {
    cardSets,
    loading,
    error,
    saveCardSet,
    deleteCardSet,
    loadCardSets,
    getCardSetsByTopic,
    getTopics,
  };
}
