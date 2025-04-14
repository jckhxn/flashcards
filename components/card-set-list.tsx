"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FlashCardSet } from "@/types/flashcard";
import { useState } from "react";

interface CardSetListProps {
  cardSets: FlashCardSet[];
  onSelect: (setId: string) => void;
  onDelete: (setId: string) => void;
  currentSetId: string | null;
  onReturn?: () => void;
  loading?: boolean;
}

export function CardSetList({
  cardSets,
  onSelect,
  onDelete,
  currentSetId,
  onReturn,
  loading = false,
}: CardSetListProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Get unique topics
  const topics = Array.from(new Set(cardSets.map((set) => set.topic))).sort();

  // Filter card sets by selected topic
  const filteredCardSets = selectedTopic
    ? cardSets.filter((set) => set.topic === selectedTopic)
    : cardSets;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading card sets...</p>
      </div>
    );
  }

  if (cardSets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No saved card sets yet.</p>
        {onReturn && (
          <Button variant="outline" className="mt-4" onClick={onReturn}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Generation
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTopic === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTopic(null)}
        >
          All Topics
        </Button>
        {topics.map((topic) => (
          <Button
            key={topic}
            variant={selectedTopic === topic ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </Button>
        ))}
      </div>

      {/* Card Sets */}
      <div className="grid gap-4">
        {filteredCardSets.map((set) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{set.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {set.topic} • {set.cards.length} cards •{" "}
                      {formatDistanceToNow(new Date(set.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelect(set.id)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Study
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(set.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {onReturn && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={onReturn}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Generation
          </Button>
        </div>
      )}
    </div>
  );
}
