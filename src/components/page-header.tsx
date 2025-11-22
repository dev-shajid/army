'use client'

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
    title: string
    description?: string
    back?: boolean
}

export default function PageHeader({ title, description, back = false }: PageHeaderProps) {
    const router = useRouter()
    return (
        <div>
            {back ? <div className="inline-flex gap-2 items-center mb-2 text-xs cursor-pointer" onClick={() => router.back()}>
                <ChevronLeft size={16} />
                Back
            </div> : null}
            <h1 className="h1">{title}</h1>
            {description ? <p className="text-muted-foreground mt-2">{description}</p> : null}
        </div>
    )
}
