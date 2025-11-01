import PageHeader from "@/components/page-header"
import PDFCard from "@/components/pdf-card"

const documents = [
  { title: "Daily Routine Orders", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
  { title: "Leave Application Procedures", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
  { title: "Personnel Management Guidelines", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
  { title: "Administrative Reporting Standards", fileId: '1SGDJHWHvHg5rcxuVFNCeQejKzV2sZI1d' },
]

export default function PreciPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Preci"
        description="Standard Operating Procedures for Preci Department"
      />

      <div className="grid gap-4">
        {documents.map((doc, index) => (
          <PDFCard doc={doc} key={index} />
        ))}
      </div>
    </div>
  )
}
