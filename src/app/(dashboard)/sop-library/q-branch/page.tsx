import { FolderCard } from "@/components/folder-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const subFolders = [
  { title: "Officer", href: "/sop-library/q-branch/officer", description: "Officer-level SOPs" },
  { title: "JSO", href: "/sop-library/q-branch/jso", description: "Junior Staff Officer SOPs" },
  { title: "OR", href: "/sop-library/q-branch/or", description: "Other Ranks SOPs" },
]

export default function QBranchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sop-library">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to SOP Library
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="h1">Q Branch</h1>
        <p className="text-muted-foreground mt-2">Quartermaster Branch Standard Operating Procedures</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subFolders.map((folder) => (
          <FolderCard key={folder.href} title={folder.title} href={folder.href} description={folder.description} />
        ))}
      </div>
    </div>
  )
}
