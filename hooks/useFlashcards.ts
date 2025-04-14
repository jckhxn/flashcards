import { useState, useEffect } from "react";
import {
  FlashCardData,
  CardSet,
  ViewMode,
  GenerationTab,
} from "@/types/flashcard";
import { generateFlashCards } from "@/app/actions";

export function useFlashcards() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAIGenerated, setIsAIGenerated] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(10);
  const [progress, setProgress] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>("generation");
  const [currentTopic, setCurrentTopic] = useState("");
  const [generationTab, setGenerationTab] = useState<GenerationTab>("ai");
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [currentSetId, setCurrentSetId] = useState<string | null>(null);
  const [cardCount, setCardCount] = useState<number>(5);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  // Load saved card sets from localStorage
  useEffect(() => {
    const savedSets = localStorage.getItem("flashCardSets");
    if (savedSets) {
      try {
        setCardSets(JSON.parse(savedSets));
      } catch (e) {
        console.error("Failed to parse saved card sets:", e);
      }
    }
  }, []);

  // Save card sets to localStorage
  useEffect(() => {
    if (cardSets.length > 0) {
      localStorage.setItem("flashCardSets", JSON.stringify(cardSets));
    }
  }, [cardSets]);

  const handleGenerateCards = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateFlashCards(topic, cardCount);
      setFlashCards(result.cards);
      setIsAIGenerated(result.isAIGenerated);
      setCurrentCardIndex(0);
      setProgress(0);
      setCurrentTopic(topic);
      setCurrentView("study");
    } catch (error) {
      console.error("Failed to generate flash cards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddManualCard = (card: FlashCardData) => {
    if (!currentTopic && topic.trim()) {
      setCurrentTopic(topic);
    } else if (!currentTopic) {
      setCurrentTopic("My Flash Cards");
    }

    if (editingCardIndex !== null) {
      setFlashCards((prev) => {
        const newCards = [...prev];
        newCards[editingCardIndex] = card;
        return newCards;
      });
      setEditingCardIndex(null);
    } else {
      setFlashCards((prev) => [...prev, card]);
    }

    setIsAIGenerated(false);
  };

  const handleEditCard = (index: number) => {
    setEditingCardIndex(index);
    setGenerationTab("manual");
    if (currentView !== "generation") {
      setCurrentView("generation");
    }
  };

  const handleDeleteCard = (index: number) => {
    setFlashCards((prev) => {
      const newCards = [...prev];
      newCards.splice(index, 1);

      if (currentCardIndex >= newCards.length) {
        setCurrentCardIndex(Math.max(0, newCards.length - 1));
      }

      if (newCards.length === 0) {
        setCurrentView("generation");
      }

      return newCards;
    });
  };

  const handleSaveCardSet = () => {
    if (flashCards.length === 0) return;

    const newSet: CardSet = {
      id: Date.now().toString(),
      name: currentTopic || "Untitled Set",
      cards: [...flashCards],
      isAIGenerated,
      createdAt: new Date().toISOString(),
    };

    setCardSets((prev) => [...prev, newSet]);
    setCurrentSetId(newSet.id);
  };

  const handleLoadCardSet = (setId: string) => {
    const set = cardSets.find((s) => s.id === setId);
    if (set) {
      setFlashCards(set.cards);
      setCurrentTopic(set.name);
      setIsAIGenerated(set.isAIGenerated);
      setCurrentCardIndex(0);
      setCurrentSetId(set.id);
      setCurrentView("study");
    }
  };

  const handleDeleteCardSet = (setId: string) => {
    setCardSets((prev) => prev.filter((s) => s.id !== setId));
    if (currentSetId === setId) {
      setCurrentSetId(null);
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
    handleGenerateCards,
    handleAddManualCard,
    handleEditCard,
    handleDeleteCard,
    handleSaveCardSet,
    handleLoadCardSet,
    handleDeleteCardSet,
  };
}
