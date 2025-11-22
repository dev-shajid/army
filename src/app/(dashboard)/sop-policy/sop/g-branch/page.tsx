import { FolderCard } from "@/components/folder-card"
import PageHeader from "@/components/page-header"

const subFolders = [
  { title: "Officer", href: "/sop-policy/sop/g-branch/officer" },
  { title: "JCO", href: "/sop-policy/sop/g-branch/jco" },
  { title: "OR", href: "/sop-policy/sop/g-branch/or" },
]

export default function GBranchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="G Branch"
        description="General Staff Branch Standard Operating Procedures"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subFolders.map((folder) => (
          <FolderCard key={folder.href} title={folder.title} href={folder.href} />
        ))}
      </div>
    </div>
  )
}
