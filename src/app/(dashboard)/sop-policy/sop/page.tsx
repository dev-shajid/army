import { FolderCard } from "@/components/folder-card"
import PageHeader from "@/components/page-header"
import PDFViewer from "@/components/pdf-viewer"

const branches = [
  { title: "A Branch", href: "/sop-policy/sop/a-branch", description: "Administrative Branch SOPs" },
  { title: "Q Branch", href: "/sop-policy/sop/q-branch", description: "Quartermaster Branch SOPs" },
  { title: "G Branch", href: "/sop-policy/sop/g-branch", description: "General Staff Branch SOPs" },
  { title: "CO", href: "/sop-policy/sop/co", description: "Commanding Officer SOPs" },
  { title: "Staff Officer", href: "/sop-policy/sop/staff-officer", description: "Staff Officer SOPs" },
  { title: "Branch Clerk", href: "/sop-policy/sop/branch-clerk", description: "Branch Clerk SOPs" },
]

export default function SOPPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SOP Policy" description="Access Standard Operating Procedures organized by branch and role" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <FolderCard key={branch.href} title={branch.title} href={branch.href} description={branch.description} />
        ))}
      </div>

      <PDFViewer />
    </div>
  )
}
