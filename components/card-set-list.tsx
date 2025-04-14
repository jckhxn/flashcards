"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FlashCardSet } from "@/types/flashcard";

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

interface CardSetListProps {
  cardSets: FlashCardSet[];
  onSelect: (setId: string) => void;
  onDelete: (setId: string) => void;
  currentSetId: string | null;
  onReturn?: () => void;
}

export function CardSetList({
  cardSets,
  onSelect,
  onDelete,
  currentSetId,
  onReturn,
}: CardSetListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Saved Card Sets
        </h2>
        {onReturn && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReturn}
            className="h-8 px-2 sm:px-3"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-sm">Return</span>
          </Button>
        )}
      </div>

      {cardSets.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>No saved card sets yet. Create some flashcards to get started!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {cardSets.map((set) => (
            <Card
              key={set.id}
              className={`p-4 cursor-pointer transition-colors ${
                currentSetId === set.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => onSelect(set.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{set.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    {set.cards.length} cards
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(set.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
