import { FolderCard } from '@/components/folder-card'
import PageHeader from '@/components/page-header'
import React from 'react'

const branches = [
    { title: "SOP", href: "/sop-policy/sop" },
    { title: "POLICY", href: "/sop-policy/policy" },
]

export default function SOPPolicyPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title='SOP Policy'
            />
            <div className="flex items-center gap-8">
                {branches.map((branch) => (
                    <FolderCard key={branch.href} title={branch.title} href={branch.href} />
                ))}
            </div>
        </div>
    )
}
