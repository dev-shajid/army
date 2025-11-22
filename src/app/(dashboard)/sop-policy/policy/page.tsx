import PageHeader from "@/components/page-header"
import PDFCard from "@/components/pdf-card"
import AddDriveFileDialog from "@/components/add-drive-file-dialog"
import DriveFileAdminMenu from "@/components/drive-file-admin-menu"
import { listDriveFiles, addDriveFile, updateDriveFile, deleteDriveFile } from "@/services/drive-file.service"
import { isAdmin } from "@/services/auth.service"
import type { DriveCategory } from "@/types/drive"

const CATEGORY: DriveCategory = 'policy'

export default async function PolicyPage() {
  const admin = await isAdmin()
  const res = await listDriveFiles(CATEGORY)
  const documents = res.success && res.data ? res.data : []

  async function addAction(form: { title: string; fileId: string }) {
    "use server"
    const added = await addDriveFile({ title: form.title, fileId: form.fileId, category: CATEGORY })
    return { ok: !!added.success, error: added.error }
  }

  async function editAction(form: { id: string; title: string; fileId: string }) {
    "use server"
    const updated = await updateDriveFile({ id: form.id, title: form.title, fileId: form.fileId })
    return { ok: !!updated.success, error: updated.error }
  }

  async function deleteAction(id: string) {
    "use server"
    const res = await deleteDriveFile(id)
    return { ok: !!res.success, error: res.error }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Policy"
          description="Access Policy "
        />
        {admin && (
          <AddDriveFileDialog category={CATEGORY} onAdd={addAction} />
        )}
      </div>

      {!res.success && (
        <div className="text-sm text-muted-foreground">Failed to load: {res.error}</div>
      )}

      <div className="grid gap-4">
        {documents.map((doc) => (
          <PDFCard
            key={doc.id || `${doc.title}-${doc.fileId}`}
            doc={{ title: doc.title, fileId: doc.fileId }}
            rightSlot={
              admin ? (
                <DriveFileAdminMenu
                  file={{ id: String(doc.id), title: doc.title, fileId: doc.fileId }}
                  onEdit={editAction}
                  onDelete={deleteAction}
                />
              ) : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
