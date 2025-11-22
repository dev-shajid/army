import { FolderCard } from "@/components/folder-card"
import PageHeader from "@/components/page-header"

const subFolders = [
  { title: "Officer", href: "/sop-policy/sop/a-branch/officer", description: "Officer-level SOPs" },
  { title: "JCO", href: "/sop-policy/sop/a-branch/jco", description: "Junior Staff Officer SOPs" },
  { title: "OR", href: "/sop-policy/sop/a-branch/or", description: "Other Ranks SOPs" },
]

export default function ABranchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="A Branch"
        description="Administrative Branch Standard Operating Procedures"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subFolders.map((folder) => (
          <FolderCard key={folder.href} title={folder.title} href={folder.href} description={folder.description} />
        ))}
      </div>
    </div>
  )
}
