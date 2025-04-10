"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlashCard from "@/components/flash-card";
import { generateFlashCards } from "@/app/actions";
import {
  Loader2,
  AlertTriangle,
  Play,
  Pause,
  Settings2,
  Moon,
  Sun,
  Plus,
  Save,
  List,
  ArrowLeft,
  Database,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import ManualCardForm from "@/components/manual-card-form";
import CardList from "@/components/card-list";
import CardSetList from "@/components/card-set-list";
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

interface FlashCardData {
  question: string;
  hint?: string;
  answer: string;
  details?: string;
}

interface CardSet {
  id: string;
  name: string;
  cards: FlashCardData[];
  isAIGenerated: boolean;
  createdAt: string;
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAIGenerated, setIsAIGenerated] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(10); // seconds
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [showHints, setShowHints] = useState(true);
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState<
    "generation" | "study" | "list" | "sets"
  >("generation");
  const [currentTopic, setCurrentTopic] = useState("");
  const [generationTab, setGenerationTab] = useState("ai");
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [currentSetId, setCurrentSetId] = useState<string | null>(null);
  const [cardCount, setCardCount] = useState<number>(5);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Load saved card sets from localStorage on initial render
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

  // Save card sets to localStorage whenever they change
  useEffect(() => {
    if (cardSets.length > 0) {
      localStorage.setItem("flashCardSets", JSON.stringify(cardSets));
    }
  }, [cardSets]);

  // Handle auto-play progress
  useEffect(() => {
    if (isAutoPlaying && flashCards.length > 0) {
      setProgress(0);

      const intervalTime = 50; // Update progress every 50ms for smooth animation
      const steps = (autoPlaySpeed * 1000) / intervalTime;

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / steps;

          // Move to next card when progress reaches 100%
          if (newProgress >= 100) {
            handleNextCard();
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
      setShowSuccessToast(true); // Show success toast
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
      // Update existing card
      setFlashCards((prev) => {
        const newCards = [...prev];
        newCards[editingCardIndex] = card;
        return newCards;
      });
      setEditingCardIndex(null);
    } else {
      // Add new card
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

      // If we deleted the last card, go back to the previous card
      if (currentCardIndex >= newCards.length) {
        setCurrentCardIndex(Math.max(0, newCards.length - 1));
      }

      // If no cards left, go back to generation form
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

  const handleNextCard = () => {
    if (currentCardIndex < flashCards.length - 1) {
      setDirection("left");
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (isAutoPlaying) {
      // Loop back to the first card when auto-playing
      setDirection("left");
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setDirection("right");
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setProgress(0);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ToastProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background transition-colors duration-300">
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("sets")}
            aria-label="Saved Sets"
          >
            <Database className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === "generation" && (
              <motion.div
                key="generation-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  StudyBuddy Flash Cards
                </h1>

                <Card className="w-full max-w-md mx-auto p-6 mb-8 border-primary/20">
                  <Tabs
                    defaultValue="ai"
                    value={generationTab}
                    onValueChange={setGenerationTab}
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="ai">AI Generated</TabsTrigger>
                      <TabsTrigger value="manual">Create Manually</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ai" className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold">
                          Generate Flash Cards with AI
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter a topic and the AI will create flash cards to
                          help you study.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter a topic (e.g., Ancient Rome, Quantum Physics)"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={isGenerating}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                !isGenerating &&
                                topic.trim()
                              ) {
                                handleGenerateCards();
                              }
                            }}
                            className="border-primary/20 focus-visible:ring-primary/70"
                          />
                          <Button
                            onClick={handleGenerateCards}
                            disabled={isGenerating || !topic.trim()}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              "Generate"
                            )}
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="card-count">
                              Number of cards to generate
                            </Label>
                            <span className="text-sm font-medium">
                              {cardCount}
                            </span>
                          </div>
                          <Slider
                            id="card-count"
                            value={[cardCount]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={(value) => setCardCount(value[0])}
                          />
                        </div>

                        {flashCards.length > 0 && (
                          <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">
                                Current Cards ({flashCards.length})
                              </h3>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentView("list")}
                                >
                                  <List className="h-4 w-4 mr-2" />
                                  View All
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentView("study")}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Study
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="manual">
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold">
                          {editingCardIndex !== null
                            ? "Edit Flash Card"
                            : "Create Your Own Flash Cards"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {editingCardIndex !== null
                            ? "Update this flash card with new information."
                            : "Manually create custom flash cards for your study sessions."}
                        </p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label htmlFor="topic-name">
                          Topic Name (Optional)
                        </Label>
                        <Input
                          id="topic-name"
                          placeholder="Enter a name for your flash card set"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="border-primary/20 focus-visible:ring-primary/70"
                        />
                      </div>

                      <ManualCardForm
                        onAddCard={handleAddManualCard}
                        initialCard={
                          editingCardIndex !== null
                            ? flashCards[editingCardIndex]
                            : undefined
                        }
                        onCancel={
                          editingCardIndex !== null
                            ? () => setEditingCardIndex(null)
                            : undefined
                        }
                      />

                      {flashCards.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">
                              Your Cards ({flashCards.length})
                            </h3>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentView("list")}
                              >
                                <List className="h-4 w-4 mr-2" />
                                View All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentView("study")}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Study
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </Card>

                {isGenerating && (
                  <div className="mt-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p>
                      Generating {cardCount} flash cards on {topic}...
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This may take a few moments
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {currentView === "study" && (
              <motion.div
                key="flash-cards-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="relative w-full h-2 bg-muted rounded-full mb-4">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${
                        ((currentCardIndex + 1) / flashCards.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentView("generation")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Generation
                    </Button>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {currentTopic}
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("list")}
                    >
                      <List className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                    {!currentSetId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveCardSet}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Set
                      </Button>
                    )}
                  </div>
                </div>

                {flashCards.length > 0 &&
                  !isAIGenerated &&
                  generationTab === "ai" && (
                    <Alert variant="warning" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Using mock data</AlertTitle>
                      <AlertDescription>
                        We couldn't connect to the AI service, so we're showing
                        you sample flash cards instead. Try again later for
                        AI-generated content.
                      </AlertDescription>
                    </Alert>
                  )}

                <div className="w-full">
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Card {currentCardIndex + 1} of {flashCards.length}
                    </p>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevCard}
                        disabled={currentCardIndex === 0}
                      >
                        Previous
                      </Button>

                      <Button
                        variant={isAutoPlaying ? "default" : "outline"}
                        size="sm"
                        onClick={toggleAutoPlay}
                        className="w-24"
                      >
                        {isAutoPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Auto
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextCard}
                        disabled={
                          currentCardIndex === flashCards.length - 1 &&
                          !isAutoPlaying
                        }
                      >
                        Next
                      </Button>

                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Settings</SheetTitle>
                            <SheetDescription>
                              Customize your flash card experience
                            </SheetDescription>
                          </SheetHeader>
                          <div className="py-4 space-y-6">
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">
                                Auto-play speed
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {autoPlaySpeed} seconds per card
                              </p>
                              <Slider
                                value={[autoPlaySpeed]}
                                min={3}
                                max={20}
                                step={1}
                                onValueChange={(value) =>
                                  setAutoPlaySpeed(value[0])
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="show-hints">Show Hints</Label>
                                <p className="text-sm text-muted-foreground">
                                  Display hint buttons on flash cards
                                </p>
                              </div>
                              <Switch
                                id="show-hints"
                                checked={showHints}
                                onCheckedChange={setShowHints}
                              />
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>

                  {/* Progress bar for auto-play */}
                  {isAutoPlaying && (
                    <div className="w-full h-1 bg-muted rounded-full mb-4">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <div className="relative overflow-hidden">
                    {flashCards.length > 0 && (
                      <FlashCard
                        key={currentCardIndex}
                        frontContent={{
                          title: flashCards[currentCardIndex].question,
                          hint: flashCards[currentCardIndex].hint,
                        }}
                        backContent={{
                          answer: flashCards[currentCardIndex].answer,
                          details: flashCards[currentCardIndex].details,
                        }}
                        direction={direction}
                        showHintButton={showHints}
                        className="transition-transform duration-300 ease-in-out transform hover:scale-105"
                      />
                    )}
                    {flashCards.length === 0 && (
                      <div className="text-center text-muted-foreground">
                        <p>
                          No flashcards available. Start by generating or
                          creating your own!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentCardIndex(0)}
                  >
                    Restart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView("list")}
                  >
                    View All
                  </Button>
                </div>
              </motion.div>
            )}

            {currentView === "list" && (
              <motion.div
                key="card-list-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentView("study")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Study
                    </Button>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      All Cards
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("generation")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                    {!currentSetId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveCardSet}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Set
                      </Button>
                    )}
                  </div>
                </div>

                <CardList
                  cards={flashCards}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  onSelect={(index) => {
                    setCurrentCardIndex(index);
                    setCurrentView("study");
                  }}
                />
              </motion.div>
            )}

            {currentView === "sets" && (
              <motion.div
                key="card-sets-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentView(
                          flashCards.length > 0 ? "study" : "generation"
                        )
                      }
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Saved Card Sets
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView("generation")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Set
                  </Button>
                </div>

                <CardSetList
                  cardSets={cardSets}
                  onSelect={handleLoadCardSet}
                  onDelete={handleDeleteCardSet}
                  currentSetId={currentSetId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showSuccessToast && (
          <Toast onOpenChange={setShowSuccessToast}>
            <ToastTitle>Flashcards Generated</ToastTitle>
            <ToastDescription>
              {cardCount} flashcards on "{topic}" have been created
              successfully.
            </ToastDescription>
          </Toast>
        )}
      </main>
    </ToastProvider>
  );
}
