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
            <div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
                {branches.map((branch) => (
                    <FolderCard key={branch.href} title={branch.title} href={branch.href} />
                ))}
            </div>
        </div>
    )
}
