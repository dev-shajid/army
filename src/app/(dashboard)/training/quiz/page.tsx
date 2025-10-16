"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

const quizQuestions = [
  {
    question: "What is the primary responsibility of a guard on duty?",
    options: ["Maintain security and vigilance", "Complete paperwork", "Train new recruits", "Conduct inspections"],
    correct: 0,
  },
  {
    question: "How often should equipment checks be performed?",
    options: ["Monthly", "Weekly", "Daily", "Annually"],
    correct: 2,
  },
  {
    question: "What is the correct chain of command protocol?",
    options: [
      "Report directly to CO",
      "Follow established hierarchy",
      "Contact any available officer",
      "Handle issues independently",
    ],
    correct: 1,
  },
]

export default function TrainingQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const router = useRouter()

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        // Quiz completed, navigate to results
        const score = newAnswers.reduce((acc, answer, index) => {
          return acc + (answer === quizQuestions[index].correct ? 1 : 0)
        }, 0)
        router.push(`/training/results?score=${score}&total=${quizQuestions.length}`)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="h1">Training Quiz</h1>
        <p className="text-muted-foreground mt-2">Test your knowledge of military procedures</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentQuestion / quizQuestions.length) * 100)}% Complete
            </span>
          </div>
          <CardDescription className="text-base mt-4">{quizQuestions[currentQuestion].question}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
          >
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button onClick={handleNext} disabled={selectedAnswer === null} className="w-full">
            {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Submit Quiz"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
