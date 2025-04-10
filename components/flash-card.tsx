"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, RotateCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FlashCardProps {
  frontContent: {
    title: string
    hint?: string
  }
  backContent: {
    answer: string
    details?: string
  }
  direction?: "left" | "right" | null
  showHintButton?: boolean
}

export default function FlashCard({
  frontContent,
  backContent,
  direction = null,
  showHintButton = true,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false)
    setShowHint(false)
  }, [frontContent.title])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (isFlipped) {
      setShowHint(false)
    }
  }

  const handleShowHint = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowHint(true)
  }

  // Card animation variants
  const cardVariants = {
    initial: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? 300 : direction === "right" ? -300 : 0,
      opacity: direction ? 0 : 1,
      scale: direction ? 0.8 : 1,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={frontContent.title}
        custom={direction}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="perspective-1000 w-full h-[350px] cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <Card className={`absolute w-full h-full backface-hidden border-primary/20 ${isFlipped ? "invisible" : ""}`}>
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <motion.h3
                className="text-xl font-semibold text-center mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {frontContent.title}
              </motion.h3>

              {frontContent.hint && showHintButton && !showHint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleShowHint}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Show Hint
                  </Button>
                </motion.div>
              )}

              {showHint && frontContent.hint && (
                <motion.div
                  className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-md text-sm w-full max-w-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>
                    <span className="font-medium">Hint:</span> {frontContent.hint}
                  </p>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground absolute bottom-0 left-0 right-0 pb-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="w-full text-center"
              >
                Click to reveal answer
              </motion.span>
            </CardFooter>
          </Card>

          {/* Back of card */}
          <Card
            className={`absolute w-full h-full backface-hidden rotate-y-180 border-primary/20 ${
              !isFlipped ? "invisible" : ""
            }`}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isFlipped ? 1 : 0, scale: isFlipped ? 1 : 0.8 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-primary">{backContent.answer}</h3>
              </motion.div>

              {backContent.details && (
                <motion.p
                  className="text-center text-muted-foreground mt-4 max-w-md leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {backContent.details}
                </motion.p>
              )}
            </CardContent>
            <CardFooter className="flex justify-center absolute bottom-0 left-0 right-0 pb-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isFlipped ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button variant="ghost" size="sm" className="text-sm" onClick={handleFlip}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Flip Back
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
