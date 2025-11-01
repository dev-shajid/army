import { FolderCard } from '@/components/folder-card'
import React from 'react'

const branches = [
  { title: "SOP", href: "/sop-policy/sop", description: "Standard Operating Procedures" },
  { title: "POLICY", href: "/sop-policy/policy", description: "Administrative Branch Policies" },
]

export default function SOPPolicyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="h1">SOP Policy</h1>
                <p className="text-muted-foreground mt-2">Access Standard Operating Procedures organized by branch and role</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 place-items-center">
                {branches.map((branch) => (
                    <FolderCard key={branch.href} title={branch.title} href={branch.href} description={branch.description} />
                ))}
            </div>
        </div>
    )
}
