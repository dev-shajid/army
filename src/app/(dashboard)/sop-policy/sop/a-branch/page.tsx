import { FolderCard } from "@/components/folder-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const subFolders = [
  { title: "Officer", href: "/sop-policy/sop/a-branch/officer", description: "Officer-level SOPs" },
  { title: "JSO", href: "/sop-policy/sop/a-branch/jso", description: "Junior Staff Officer SOPs" },
  { title: "OR", href: "/sop-policy/sop/a-branch/or", description: "Other Ranks SOPs" },
]

export default function ABranchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sop-policy/sop">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to SOP Policy
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="h1">A Branch</h1>
        <p className="text-muted-foreground mt-2">Administrative Branch Standard Operating Procedures</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subFolders.map((folder) => (
          <FolderCard key={folder.href} title={folder.title} href={folder.href} description={folder.description} />
        ))}
      </div>
    </div>
  )
}
