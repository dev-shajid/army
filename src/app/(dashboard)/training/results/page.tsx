"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle, Trophy } from "lucide-react"

export default function TrainingResultsPage() {
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "3")
  const percentage = Math.round((score / total) * 100)

  const getResultMessage = () => {
    if (percentage >= 80) return { message: "Excellent!", icon: Trophy, color: "text-green-600" }
    if (percentage >= 60) return { message: "Good Job!", icon: CheckCircle2, color: "text-blue-600" }
    return { message: "Needs Improvement", icon: XCircle, color: "text-orange-600" }
  }

  const result = getResultMessage()
  const ResultIcon = result.icon

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="h1">Quiz Results</h1>
        <p className="text-muted-foreground mt-2">Your performance summary</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ResultIcon className={`h-16 w-16 ${result.color}`} />
          </div>
          <CardTitle className="text-2xl">{result.message}</CardTitle>
          <CardDescription className="text-lg mt-2">
            You scored {score} out of {total} questions correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span className="font-semibold">{percentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{total - score}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/training/quiz" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Retake Quiz
              </Button>
            </Link>
            <Link href="/sop-library" className="flex-1">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
