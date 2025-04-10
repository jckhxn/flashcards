"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

interface FlashCardData {
  question: string
  hint?: string
  answer: string
  details?: string
}

interface CardSet {
  id: string
  name: string
  cards: FlashCardData[]
  isAIGenerated: boolean
  createdAt: string
}

interface CardSetListProps {
  cardSets: CardSet[]
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  currentSetId: string | null
}

export default function CardSetList({ cardSets, onSelect, onDelete, currentSetId }: CardSetListProps) {
  if (cardSets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No saved card sets. Create and save a set to see it here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cardSets.map((set, index) => (
        <motion.div
          key={set.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card
            className={`border-primary/20 hover:border-primary/40 transition-colors ${
              currentSetId === set.id ? "border-primary" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <h3 className="font-medium">{set.name}</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{set.cards.length} cards</div>
                    <div className="bg-muted px-2 py-1 rounded text-xs">
                      {set.isAIGenerated ? "AI Generated" : "Manually Created"}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(set.createdAt))} ago
                  </p>
                </div>
                <div className="flex space-x-1 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => onSelect(set.id)}>
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(set.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
