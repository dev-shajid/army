import { FolderCard } from "@/components/folder-card"

const branches = [
  { title: "A Branch", href: "/sop-library/a-branch", description: "Administrative Branch SOPs" },
  { title: "Q Branch", href: "/sop-library/q-branch", description: "Quartermaster Branch SOPs" },
  { title: "G Branch", href: "/sop-library/g-branch", description: "General Staff Branch SOPs" },
  { title: "CO", href: "/sop-library/co", description: "Commanding Officer SOPs" },
  { title: "Staff Officer", href: "/sop-library/staff-officer", description: "Staff Officer SOPs" },
  { title: "Branch Clerk", href: "/sop-library/branch-clerk", description: "Branch Clerk SOPs" },
]

export default function SOPLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">SOP Library</h1>
        <p className="text-muted-foreground mt-2">Access Standard Operating Procedures organized by branch and role</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <FolderCard key={branch.href} title={branch.title} href={branch.href} description={branch.description} />
        ))}
      </div>
    </div>
  )
}
