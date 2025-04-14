import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Play,
  Pause,
  Settings2,
  List,
  ArrowLeft,
  Save,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import FlashCard from "@/components/flash-card";
import { FlashCardData, ViewMode } from "@/types/flashcard";

interface StudyViewProps {
  flashCards: FlashCardData[];
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  isAIGenerated: boolean;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  autoPlaySpeed: number;
  setAutoPlaySpeed: (speed: number) => void;
  progress: number;
  showHints: boolean;
  setShowHints: (show: boolean) => void;
  currentTopic: string;
  currentSetId: string | null;
  handleSaveCardSet: () => void;
  setCurrentView: (view: ViewMode) => void;
}

export function StudyView({
  flashCards,
  currentCardIndex,
  setCurrentCardIndex,
  isAIGenerated,
  isAutoPlaying,
  setIsAutoPlaying,
  autoPlaySpeed,
  setAutoPlaySpeed,
  progress,
  showHints,
  setShowHints,
  currentTopic,
  currentSetId,
  handleSaveCardSet,
  setCurrentView,
}: StudyViewProps) {
  const handleNextCard = () => {
    if (currentCardIndex < flashCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (isAutoPlaying) {
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <motion.div
      key="flash-cards-display"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("generation")}
              className="h-8 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-sm">Back</span>
            </Button>
            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {currentTopic}
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView("list")}
              className="h-8 px-2 sm:px-3"
            >
              <List className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-sm">View All</span>
            </Button>
            {!currentSetId && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveCardSet}
                className="h-8 px-2 sm:px-3"
              >
                <Save className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-sm">Save</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {flashCards.length}
            </p>
            <div className="flex items-center space-x-2">
              {flashCards.length > 0 && !isAIGenerated && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md cursor-help">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Mock Data</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                          API Connection Failed
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          We're showing sample cards because we couldn't connect
                          to the AI service. Try again later for AI-generated
                          content.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
                      <h3 className="text-sm font-medium">Auto-play speed</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {autoPlaySpeed} seconds per card
                      </p>
                      <Slider
                        value={[autoPlaySpeed]}
                        min={3}
                        max={20}
                        step={1}
                        onValueChange={(value) => setAutoPlaySpeed(value[0])}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-hints" className="text-sm">
                          Show Hints
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
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

          <div className="w-full h-2 bg-muted rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${((currentCardIndex + 1) / flashCards.length) * 100}%`,
              }}
            />
          </div>

          {isAutoPlaying && (
            <div className="w-full h-1.5 bg-muted rounded-full">
              <div
                className="h-full bg-primary/50 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
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
            showHintButton={showHints}
            className="transition-transform duration-300 ease-in-out transform hover:scale-105 w-full max-w-md"
          />
        )}
        {flashCards.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>
              No flashcards available. Start by generating or creating your own!
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevCard}
          disabled={currentCardIndex === 0}
          className="h-10 w-24"
        >
          <span className="text-sm">Previous</span>
        </Button>

        <Button
          variant={isAutoPlaying ? "default" : "outline"}
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="h-10 w-24"
        >
          {isAutoPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-sm">Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-sm">Auto</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextCard}
          disabled={
            currentCardIndex === flashCards.length - 1 && !isAutoPlaying
          }
          className="h-10 w-24"
        >
          <span className="text-sm">Next</span>
        </Button>
      </div>
    </motion.div>
  );
}
