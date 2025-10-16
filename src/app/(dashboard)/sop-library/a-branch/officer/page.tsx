import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, FileText, Download } from "lucide-react"
import Link from "next/link"

const documents = [
  { title: "Daily Routine Orders", date: "Updated: Jan 15, 2025", size: "2.4 MB" },
  { title: "Leave Application Procedures", date: "Updated: Jan 10, 2025", size: "1.8 MB" },
  { title: "Personnel Management Guidelines", date: "Updated: Dec 28, 2024", size: "3.2 MB" },
  { title: "Administrative Reporting Standards", date: "Updated: Dec 20, 2024", size: "2.1 MB" },
]

export default function ABranchOfficerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sop-library/a-branch">
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
          <Card key={index} className="hover:bg-accent transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {doc.date} • {doc.size}
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
