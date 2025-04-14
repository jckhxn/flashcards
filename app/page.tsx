"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Sun, Moon, Loader2, AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useFlashcards } from "@/hooks/useFlashcards";
import { GenerationView } from "@/components/generation-view";
import { StudyView } from "@/components/study-view";
import { CardList } from "@/components/card-list";
import { CardSetList } from "@/components/card-set-list";
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { ViewMode } from "@/types/flashcard";

// Dynamically import the icons with ssr disabled
const SunIcon = dynamic(() => import("lucide-react").then((mod) => mod.Sun), {
  ssr: false,
});
const MoonIcon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), {
  ssr: false,
});

// Dynamically import the views with ssr disabled
const DynamicGenerationView = dynamic(
  () =>
    import("@/components/generation-view").then((mod) => mod.GenerationView),
  {
    ssr: false,
  }
);
const DynamicStudyView = dynamic(
  () => import("@/components/study-view").then((mod) => mod.StudyView),
  {
    ssr: false,
  }
);
const DynamicCardList = dynamic(
  () => import("@/components/card-list").then((mod) => mod.CardList),
  {
    ssr: false,
  }
);
const DynamicCardSetList = dynamic(
  () => import("@/components/card-set-list").then((mod) => mod.CardSetList),
  {
    ssr: false,
  }
);

export default function Home() {
  const {
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
  } = useFlashcards();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle auto-play progress
  useEffect(() => {
    if (isAutoPlaying && flashCards.length > 0) {
      setProgress(0);

      const intervalTime = 50; // Update progress every 50ms for smooth animation
      const steps = (autoPlaySpeed * 1000) / intervalTime;

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / steps;

          if (newProgress >= 100) {
            if (currentCardIndex < flashCards.length - 1) {
              setCurrentCardIndex(currentCardIndex + 1);
            } else {
              setCurrentCardIndex(0);
            }
            return 0;
          }
          return newProgress;
        });
      }, intervalTime);

      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  }, [isAutoPlaying, autoPlaySpeed, flashCards.length, currentCardIndex]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading your flash cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <ToastProvider>
      <main
        className="flex min-h-screen flex-col items-center justify-start p-2 sm:p-4 bg-background transition-colors duration-300"
        onClick={() => {
          if (currentView === "sets" && cardSets.length === 0) {
            setCurrentView("generation");
          }
        }}
      >
        <div className="absolute top-4 right-4 sm:top-4 sm:right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("sets")}
            aria-label="Saved Sets"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Database className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            {resolvedTheme === "dark" ? (
              <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>

        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 mt-16 sm:mt-8">
          <AnimatePresence mode="wait">
            {currentView === "generation" && (
              <DynamicGenerationView
                topic={topic}
                setTopic={setTopic}
                isGenerating={isGenerating}
                generationTab={generationTab}
                setGenerationTab={setGenerationTab}
                cardCount={cardCount}
                setCardCount={setCardCount}
                flashCards={flashCards}
                editingCardIndex={editingCardIndex}
                setEditingCardIndex={setEditingCardIndex}
                handleGenerateCards={handleGenerateCards}
                handleAddManualCard={handleAddManualCard}
                handleSaveCardSet={handleSaveCardSet}
                setCurrentView={(view: ViewMode) => setCurrentView(view)}
              />
            )}

            {currentView === "study" && (
              <DynamicStudyView
                flashCards={flashCards}
                currentCardIndex={currentCardIndex}
                setCurrentCardIndex={setCurrentCardIndex}
                isAIGenerated={isAIGenerated}
                isAutoPlaying={isAutoPlaying}
                setIsAutoPlaying={setIsAutoPlaying}
                autoPlaySpeed={autoPlaySpeed}
                setAutoPlaySpeed={setAutoPlaySpeed}
                progress={progress}
                showHints={showHints}
                setShowHints={setShowHints}
                currentTopic={currentTopic}
                currentSetId={currentSetId}
                handleSaveCardSet={handleSaveCardSet}
                setCurrentView={(view: ViewMode) => setCurrentView(view)}
              />
            )}

            {currentView === "list" && (
              <DynamicCardList
                cards={flashCards}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
                onSelect={(index: number) => {
                  setCurrentCardIndex(index);
                  setCurrentView("study");
                }}
              />
            )}

            {currentView === "sets" && (
              <DynamicCardSetList
                cardSets={cardSets}
                onSelect={handleLoadCardSet}
                onDelete={handleDeleteCardSet}
                currentSetId={currentSetId}
                onReturn={() => setCurrentView("generation")}
                loading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </ToastProvider>
  );
}
