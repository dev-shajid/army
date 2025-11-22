import { FileQuestion } from 'lucide-react'

interface EmptyStateProps {
    title?: string
    description?: string
    icon?: React.ReactNode
}

export default function EmptyState({
    title = "No documents found",
    description = "There are no documents available at the moment.",
    icon
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                {icon || <FileQuestion className="h-10 w-10 text-muted-foreground" />}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
    )
}
