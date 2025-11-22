import Link from "next/link"
import { Folder, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FolderCardProps {
    title: string
    href: string
}

export function FolderCard({ title, href }: FolderCardProps) {
    return (
        <Link href={href}>
            <Card className="group hover:bg-accent hover:border-primary transition-all cursor-pointer max-w-xs">
                <CardContent className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Folder className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-base flex-1">{title}</h3>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </CardContent>
            </Card>
        </Link>
    )
}
