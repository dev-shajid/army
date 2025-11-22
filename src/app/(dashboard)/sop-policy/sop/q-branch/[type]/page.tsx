import DriveFileList from "@/components/drive-file-list"
import type { DriveCategory } from "@/types/drive"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return [
    { type: 'officer' },
    { type: 'jco' },
    { type: 'or' },
  ]
}

export default async function ABranchTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params

  const typeConfig: Record<string, { title: string; category: DriveCategory }> = {
    officer: { title: 'Q Branch - Officer', category: 'q_officer' },
    jco: { title: 'Q Branch - JCO', category: 'q_jco' },
    or: { title: 'Q Branch - OR', category: 'q_or' },
  }

  const config = typeConfig[type]

  if (!config) {
    notFound()
  }

  return (
    <DriveFileList
      title={config.title}
      category={config.category}
    />
  )
}
