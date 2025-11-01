import PDFCard from "@/components/pdf-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const documents = [
  { title: "Daily Routine Orders", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
  { title: "Leave Application Procedures", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
  { title: "Personnel Management Guidelines", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
  { title: "Administrative Reporting Standards", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
]

export default function ABranchOfficerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sop-policy/a-branch">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to A Branch
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="h1">A Branch - Officer</h1>
        <p className="text-muted-foreground mt-2">
          Standard Operating Procedures for Officers in Administrative Branch
        </p>
      </div>

      <div className="grid gap-4">
        {documents.map((doc, index) => (
          <PDFCard doc={doc} key={index} />
        ))}
      </div>
    </div>
  )
}
