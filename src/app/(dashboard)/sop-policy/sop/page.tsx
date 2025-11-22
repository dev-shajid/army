import { FolderCard } from "@/components/folder-card"
import PageHeader from "@/components/page-header"

const branches = [
  { title: "A Branch", href: "/sop-policy/sop/a-branch" },
  { title: "Q Branch", href: "/sop-policy/sop/q-branch" },
  { title: "G Branch", href: "/sop-policy/sop/g-branch" },
  { title: "CO", href: "/sop-policy/sop/co" },
  { title: "Staff Officer", href: "/sop-policy/sop/staff-officer" },
  { title: "Branch Appointment Holders", href: "/sop-policy/sop/appointment-holders" },
  { title: "Other SOPs", href: "/sop-policy/sop/other" },
]

export default function SOPPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SOP Policy" description="Access Standard Operating Procedures organized by branch and role" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <FolderCard key={branch.href} title={branch.title} href={branch.href} />
        ))}
      </div>
    </div>
  )
}
