interface PageHeaderProps {
    title: string
    description?: string
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div>
            <h1 className="h1">{title}</h1>
            {description ? <p className="text-muted-foreground mt-2">{description}</p> : null}
        </div>
    )
}
