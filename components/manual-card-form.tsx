"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Save, X } from "lucide-react"

interface FlashCardData {
  question: string
  hint?: string
  answer: string
  details?: string
}

interface ManualCardFormProps {
  onAddCard: (card: FlashCardData) => void
  initialCard?: FlashCardData
  onCancel?: () => void
}

export default function ManualCardForm({ onAddCard, initialCard, onCancel }: ManualCardFormProps) {
  const [question, setQuestion] = useState("")
  const [hint, setHint] = useState("")
  const [answer, setAnswer] = useState("")
  const [details, setDetails] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Set initial values if editing an existing card
  useEffect(() => {
    if (initialCard) {
      setQuestion(initialCard.question)
      setHint(initialCard.hint || "")
      setAnswer(initialCard.answer)
      setDetails(initialCard.details || "")
    }
  }, [initialCard])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!question.trim()) {
      newErrors.question = "Question is required"
    }

    if (!answer.trim()) {
      newErrors.answer = "Answer is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onAddCard({
        question,
        hint: hint.trim() ? hint : undefined,
        answer,
        details: details.trim() ? details : undefined,
      })

      // Reset form if not editing
      if (!initialCard) {
        setQuestion("")
        setHint("")
        setAnswer("")
        setDetails("")
      }

      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question" className="flex items-center">
          Question <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="question"
          placeholder="Enter the question for your flash card"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={`min-h-[80px] ${errors.question ? "border-destructive" : ""}`}
        />
        {errors.question && <p className="text-xs text-destructive">{errors.question}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hint">Hint (Optional)</Label>
        <Input
          id="hint"
          placeholder="Enter a hint (will be shown on the front of the card)"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer" className="flex items-center">
          Answer <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="answer"
          placeholder="Enter the answer to your question"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className={errors.answer ? "border-destructive" : ""}
        />
        {errors.answer && <p className="text-xs text-destructive">{errors.answer}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Additional Details (Optional)</Label>
        <Textarea
          id="details"
          placeholder="Enter additional information about the answer"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {initialCard ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Card
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Card
            </>
          )}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
