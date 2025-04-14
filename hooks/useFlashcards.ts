import { useState, useEffect } from "react";
import {
  FlashCardData,
  CardSet,
  ViewMode,
  GenerationTab,
  FlashCardSet,
} from "@/types/flashcard";
import { useSupabaseFlashcards } from "./useSupabaseFlashcards";

export function useFlashcards() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3);
  const [progress, setProgress] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>("generation");
  const [currentTopic, setCurrentTopic] = useState("");
  const [generationTab, setGenerationTab] = useState<GenerationTab>("ai");
  const [cardCount, setCardCount] = useState(5);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    cardSets,
    loading: cardSetsLoading,
    error: cardSetsError,
    saveCardSet,
    deleteCardSet,
    loadCardSets,
  } = useSupabaseFlashcards();

  const [currentSetId, setCurrentSetId] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await loadCardSets();
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load card sets"
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleGenerateCards = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          count: cardCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cards");
      }

      const data = await response.json();
      setFlashCards(data.cards);
      setIsAIGenerated(true);
      setCurrentTopic(topic);
      setCurrentView("study");
    } catch (error) {
      console.error("Error generating cards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddManualCard = (card: FlashCardData) => {
    try {
      setFlashCards((prev) => [...prev, card]);
      if (editingCardIndex !== null) {
        setEditingCardIndex(null);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add card");
    }
  };

  const handleEditCard = (index: number) => {
    setEditingCardIndex(index);
    setGenerationTab("manual");
    setCurrentView("generation");
  };

  const handleDeleteCard = (index: number) => {
    setFlashCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCardSet = async () => {
    if (flashCards.length === 0) {
      setError("Cannot save an empty card set");
      return;
    }

    if (!topic.trim()) {
      setError("Please enter a topic name before saving");
      return;
    }

    try {
      console.log("Preparing to save card set with:", {
        topic,
        currentTopic,
        cardCount: flashCards.length,
        isAIGenerated,
      });

      const newSet: Omit<FlashCardSet, "id" | "created_at"> = {
        name: currentTopic || topic || "Untitled Set",
        topic: topic.trim(),
        cards: flashCards,
        isAIGenerated,
      };

      console.log("Saving card set:", newSet);
      const savedSet = await saveCardSet(newSet);

      if (savedSet) {
        console.log("Successfully saved set:", savedSet);
        setCurrentSetId(savedSet.id);
        setFlashCards([]);
        setTopic("");
        setCurrentTopic("");
        setError(null);
        setCurrentView("sets");
      } else {
        console.error("Failed to save set - no data returned");
        setError("Failed to save card set - please try again");
      }
    } catch (err) {
      console.error("Error in handleSaveCardSet:", err);
      setError(err instanceof Error ? err.message : "Failed to save card set");
    }
  };

  const handleLoadCardSet = (setId: string) => {
    try {
      const set = cardSets.find((s) => s.id === setId);
      if (!set) {
        throw new Error("Card set not found");
      }
      setFlashCards(set.cards);
      setCurrentTopic(set.name);
      setIsAIGenerated(set.isAIGenerated);
      setCurrentSetId(setId);
      setCurrentView("study");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load card set");
    }
  };

  const handleDeleteCardSet = async (setId: string) => {
    await deleteCardSet(setId);
    if (currentSetId === setId) {
      setCurrentSetId(null);
      setFlashCards([]);
      setCurrentTopic("");
    }
  };

  return {
    topic,
    setTopic,
    isGenerating,
    flashCards,
    currentCardIndex,
    setCurrentCardIndex,
    isAIGenerated,
    isAutoPlaying,
    setIsAutoPlaying,
    autoPlaySpeed,
    setAutoPlaySpeed,
    progress,
    setProgress,
    showHints,
    setShowHints,
    currentView,
    setCurrentView,
    currentTopic,
    generationTab,
    setGenerationTab,
    cardSets,
    currentSetId,
    cardCount,
    setCardCount,
    editingCardIndex,
    setEditingCardIndex,
    isLoading,
    error,
    handleGenerateCards,
    handleAddManualCard,
    handleEditCard,
    handleDeleteCard,
    handleSaveCardSet,
    handleLoadCardSet,
    handleDeleteCardSet,
  };
}
