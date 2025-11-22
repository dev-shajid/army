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

export default async function GBranchTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params

  const typeConfig: Record<string, { title: string; category: DriveCategory }> = {
    officer: { title: 'G Branch - Officer', category: 'g_officer' },
    jco: { title: 'G Branch - JCO', category: 'g_jco' },
    or: { title: 'G Branch - OR', category: 'g_or' },
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
