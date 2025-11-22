import DriveFileList from "@/components/drive-file-list"
import type { DriveCategory } from "@/types/drive"
import { notFound } from "next/navigation"

type SOPConfig = {
    title: string
    description?: string
    category: DriveCategory
}

const sopConfig: Record<string, SOPConfig> = {
    'a-branch': {
        title: 'A Branch',
        // description: 'Administrative Branch Standard Operating Procedures',
        category: 'a_or'
    },
    'q-branch': {
        title: 'Q Branch',
        // description: 'Quartermaster Branch Standard Operating Procedures',
        category: 'q_or'
    },
    'g-branch': {
        title: 'G Branch',
        // description: 'General Staff Branch Standard Operating Procedures',
        category: 'g_or'
    },
    'co': {
        title: 'Commanding Officer',
        // description: 'Standard Operating Procedures for Commanding Officers',
        category: 'co_officer'
    },
    'staff-officer': {
        title: 'Staff Officer',
        // description: 'Standard Operating Procedures for Staff Officers',
        category: 'staff_officer'
    },
    'appointment-holders': {
        title: 'Appointment Holders',
        // description: 'Standard Operating Procedures for Appointment Holders',
        category: 'appointment_holders'
    },
    'other': {
        title: 'Other SOPs',
        category: 'other_sop'
    }
}

export async function generateStaticParams() {
    return Object.keys(sopConfig).map(slug => ({ slug }))
}

export default async function SOPPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const config = sopConfig[slug]

    if (!config) {
        notFound()
    }

    return (
        <DriveFileList
            title={config.title}
            description={config.description}
            category={config.category}
            back
        />
    )
}
