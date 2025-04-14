"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface FlashCardData {
  question: string;
  hint?: string;
  answer: string;
  details?: string;
}

interface CardListProps {
  cards: FlashCardData[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onSelect: (index: number) => void;
}

export function CardList({ cards, onEdit, onDelete, onSelect }: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No cards available. Create some cards to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <h3 className="font-medium line-clamp-2">{card.question}</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {card.hint && (
                      <div className="bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded text-xs">
                        Hint: {card.hint}
                      </div>
                    )}
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      Answer: {card.answer}
                    </div>
                  </div>
                  {card.details && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {card.details}
                    </p>
                  )}
                </div>
                <div className="flex space-x-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSelect(index)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(index)}
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
  );
}
