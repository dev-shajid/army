import PageHeader from "@/components/page-header"
import PDFCard from "@/components/pdf-card"
import AddDriveFileDialog from "@/components/add-drive-file-dialog"
import DriveFileAdminMenu from "@/components/drive-file-admin-menu"
import EmptyState from "@/components/empty-state"
import { listDriveFiles, addDriveFile, updateDriveFile, deleteDriveFile } from "@/services/drive-file.service"
import { isAdmin } from "@/services/auth.service"
import type { DriveCategory } from "@/types/drive"

interface DriveFileListProps {
    title: string
    description?: string
    category: DriveCategory
}

export default async function DriveFileList({ title, description, category }: DriveFileListProps) {
    const admin = await isAdmin()
    const res = await listDriveFiles(category)
    const documents = res.success && res.data ? res.data : []

    async function addAction(form: { title: string; fileId: string }) {
        "use server"
        const added = await addDriveFile({ title: form.title, fileId: form.fileId, category })
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
                <PageHeader title={title} description={description} />
                {admin && (
                    <AddDriveFileDialog category={category} onAdd={addAction} />
                )}
            </div>

            {!res.success && (
                <div className="text-sm text-muted-foreground">Failed to load: {res.error}</div>
            )}

            <div className="grid gap-4">
                {documents.length > 0 ? (
                    documents.map((doc) => (
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
                    ))
                ) : (
                    <EmptyState
                        title="No documents available"
                        description={admin ? "Click 'Add File' to upload the first document." : "No documents have been added yet."}
                    />
                )}
            </div>
        </div>
    )
}
