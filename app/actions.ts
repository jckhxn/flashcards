"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface FlashCardData {
  question: string
  hint?: string
  answer: string
  details?: string
}

// Mock data for different topics
const mockFlashCards: Record<string, FlashCardData[]> = {
  default: [
    {
      question: "What is the capital of France?",
      hint: "This city is known as the 'City of Light'",
      answer: "Paris",
      details: "Paris is the capital and most populous city of France, located on the Seine River.",
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      hint: "He is considered the greatest English playwright",
      answer: "William Shakespeare",
      details: "William Shakespeare wrote this famous tragedy around 1595.",
    },
    {
      question: "What is the chemical symbol for gold?",
      hint: "It comes from the Latin word 'aurum'",
      answer: "Au",
      details: "Gold is a precious metal with atomic number 79 on the periodic table.",
    },
    {
      question: "What is photosynthesis?",
      hint: "It involves chlorophyll and sunlight",
      answer: "A process where plants make food",
      details: "Plants convert light energy into chemical energy to fuel their activities.",
    },
    {
      question: "What year did World War II end?",
      hint: "It ended in the mid-1940s",
      answer: "1945",
      details: "The war ended with the surrender of Japan after the atomic bombings of Hiroshima and Nagasaki.",
    },
  ],
  history: [
    {
      question: "Who was the first President of the United States?",
      hint: "He was a general during the Revolutionary War",
      answer: "George Washington",
      details: "George Washington served as president from 1789 to 1797.",
    },
    {
      question: "In what year did the Berlin Wall fall?",
      hint: "It happened near the end of the Cold War",
      answer: "1989",
      details: "The fall of the Berlin Wall symbolized the end of the division between East and West Germany.",
    },
    {
      question: "Which civilization built the Machu Picchu?",
      hint: "They were a pre-Columbian civilization in South America",
      answer: "Inca",
      details: "The Inca built this citadel in the 15th century in what is now Peru.",
    },
    {
      question: "What was the Renaissance?",
      hint: "The word means 'rebirth' in French",
      answer: "A cultural movement",
      details:
        "The Renaissance was a period of cultural, artistic, and intellectual revival in Europe from the 14th to 17th centuries.",
    },
    {
      question: "Who was Cleopatra?",
      hint: "She was the last active ruler of her dynasty",
      answer: "Egyptian queen",
      details: "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt.",
    },
  ],
  science: [
    {
      question: "What is Newton's First Law of Motion?",
      hint: "It's also known as the law of inertia",
      answer: "An object at rest stays at rest",
      details:
        "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
    },
    {
      question: "What is the closest planet to the Sun?",
      hint: "It's named after the Roman messenger god",
      answer: "Mercury",
      details: "Mercury has a very thin atmosphere and extreme temperature variations.",
    },
    {
      question: "What is the chemical formula for water?",
      hint: "It contains hydrogen and oxygen",
      answer: "H₂O",
      details: "Water consists of two hydrogen atoms bonded to one oxygen atom.",
    },
    {
      question: "What is the largest organ in the human body?",
      hint: "It covers the entire outside of your body",
      answer: "Skin",
      details: "The skin is the body's largest organ, with a surface area of about 2 square meters in adults.",
    },
    {
      question: "What is the theory of relativity?",
      hint: "It was proposed by Albert Einstein",
      answer: "E=mc²",
      details:
        "Einstein's theory describes how space and time are linked for objects moving at consistent speeds in a vacuum.",
    },
  ],
}

// Function to get mock flash cards based on topic
function getMockFlashCards(topic: string, count = 5): FlashCardData[] {
  const lowerTopic = topic.toLowerCase()
  let cards: FlashCardData[] = []

  if (lowerTopic.includes("history") || lowerTopic.includes("war") || lowerTopic.includes("president")) {
    cards = mockFlashCards.history
  } else if (
    lowerTopic.includes("science") ||
    lowerTopic.includes("physics") ||
    lowerTopic.includes("chemistry") ||
    lowerTopic.includes ||
    lowerTopic.includes("physics") ||
    lowerTopic.includes("chemistry") ||
    lowerTopic.includes("biology")
  ) {
    cards = mockFlashCards.science
  } else {
    cards = mockFlashCards.default
  }

  // Return only the requested number of cards
  return cards.slice(0, count)
}

export async function generateFlashCards(
  topic: string,
  count = 5,
): Promise<{ cards: FlashCardData[]; isAIGenerated: boolean }> {
  try {
    const prompt = `
      Create ${count} flash cards about "${topic}" for studying purposes.
      Each flash card should have:
      1. A question on a specific aspect of ${topic}
      2. A short hint that gives a clue without revealing the answer
      3. A concise answer (1-3 words if possible)
      4. Additional details that expand on the answer (1-2 sentences)

      Format your response as a valid JSON array with the following structure:
      [
        {
          "question": "Question text here?",
          "hint": "Hint text here",
          "answer": "Answer text here",
          "details": "Additional details here"
        },
        ...
      ]

      Make the questions challenging but fair, covering different aspects of the topic.
      Generate exactly ${count} cards, no more and no less.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    // Parse the JSON response
    const flashCards: FlashCardData[] = JSON.parse(text)
    return { cards: flashCards, isAIGenerated: true }
  } catch (error) {
    console.error("Error generating flash cards:", error)
    // Return mock flash cards as fallback
    return { cards: getMockFlashCards(topic, count), isAIGenerated: false }
  }
}
