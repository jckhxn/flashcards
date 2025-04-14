import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import ManualCardForm from "@/components/manual-card-form";
import { FlashCardData, GenerationTab, ViewMode } from "@/types/flashcard";

interface GenerationViewProps {
  topic: string;
  setTopic: (topic: string) => void;
  isGenerating: boolean;
  generationTab: GenerationTab;
  setGenerationTab: (tab: GenerationTab) => void;
  cardCount: number;
  setCardCount: (count: number) => void;
  flashCards: FlashCardData[];
  editingCardIndex: number | null;
  setEditingCardIndex: (index: number | null) => void;
  handleGenerateCards: () => Promise<void>;
  handleAddManualCard: (card: FlashCardData) => void;
  setCurrentView: (view: ViewMode) => void;
}

export function GenerationView({
  topic,
  setTopic,
  isGenerating,
  generationTab,
  setGenerationTab,
  cardCount,
  setCardCount,
  flashCards,
  editingCardIndex,
  setEditingCardIndex,
  handleGenerateCards,
  handleAddManualCard,
  setCurrentView,
}: GenerationViewProps) {
  return (
    <motion.div
      key="generation-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        StudyBuddy Flash Cards
      </h1>

      <Card className="w-full max-w-md mx-auto p-4 sm:p-6 mb-4 sm:mb-8 border-primary/20">
        <Tabs
          defaultValue="ai"
          value={generationTab}
          onValueChange={(value) => setGenerationTab(value as GenerationTab)}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ai" className="text-sm sm:text-base">
              AI Generated
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-sm sm:text-base">
              Create Manually
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Generate Flash Cards with AI
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter a topic and the AI will create flash cards to help you
                study.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Input
                  placeholder="Enter a topic (e.g., Ancient Rome, Quantum Physics)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isGenerating && topic.trim()) {
                      handleGenerateCards();
                    }
                  }}
                  className="border-primary/20 focus-visible:ring-primary/70"
                />
                <Button
                  onClick={handleGenerateCards}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full sm:w-auto"
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
                <div className="flex justify-between items-center gap-4">
                  <Label htmlFor="card-count" className="text-sm sm:text-base">
                    Number of cards to generate
                  </Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="card-count-input"
                    min={1}
                    max={10}
                    value={cardCount}
                    onChange={(e) => {
                      const num = parseInt(e.target.value);
                      if (!isNaN(num)) {
                        setCardCount(num);
                      }
                    }}
                    onBlur={(e) => {
                      const num = parseInt(e.target.value);
                      if (isNaN(num) || num < 1) {
                        setCardCount(1);
                      } else if (num > 10) {
                        setCardCount(10);
                      }
                    }}
                    className="w-16 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {flashCards.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-sm sm:text-base">
                      Current Cards ({flashCards.length})
                    </h3>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentView("list")}
                      >
                        View All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentView("study")}
                      >
                        Study
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                {editingCardIndex !== null
                  ? "Edit Flash Card"
                  : "Create Your Own Flash Cards"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {editingCardIndex !== null
                  ? "Update this flash card with new information."
                  : "Manually create custom flash cards for your study sessions."}
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="topic-name" className="text-sm sm:text-base">
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-sm sm:text-base">
                    Your Cards ({flashCards.length})
                  </h3>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("list")}
                    >
                      View All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("study")}
                    >
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
  );
}
