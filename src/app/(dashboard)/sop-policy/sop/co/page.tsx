import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, FileText, Download } from "lucide-react"
import Link from "next/link"

const documents = [
  { title: "Command Responsibilities", date: "Updated: Jan 18, 2025", size: "3.5 MB" },
  { title: "Unit Management Protocols", date: "Updated: Jan 12, 2025", size: "2.9 MB" },
  { title: "Disciplinary Procedures", date: "Updated: Jan 05, 2025", size: "2.2 MB" },
  { title: "Strategic Planning Guidelines", date: "Updated: Dec 30, 2024", size: "4.1 MB" },
]

export default function COPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sop-policy">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to SOP Policy
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="h1">Commanding Officer</h1>
        <p className="text-muted-foreground mt-2">Standard Operating Procedures for Commanding Officers</p>
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
