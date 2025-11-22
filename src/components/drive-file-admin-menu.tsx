"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import EditDriveFileDialog from '@/components/edit-drive-file-dialog'
import { MoreHorizontal, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export type DriveFileLite = { id: string; title: string; fileId: string }

type Props = {
    file: DriveFileLite
    onEdit: (data: { id: string; title: string; fileId: string }) => Promise<{ ok: boolean; error?: string }>
    onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>
}

export default function DriveFileAdminMenu({ file, onEdit, onDelete }: Props) {
    const router = useRouter()
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleDelete = async () => {
        const res = await onDelete(file.id)
        if (res.ok) {
            toast.success('File deleted')
            router.refresh()
        } else {
            toast.error(res.error || 'Failed to delete file')
        }
    }

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={(e) => {
                            e.preventDefault()
                            setDropdownOpen(false)
                            setEditOpen(true)
                        }}
                    >
                        <Pencil className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive flex items-center gap-2"
                        onSelect={(e) => {
                            e.preventDefault()
                            setDropdownOpen(false)
                            setDeleteOpen(true)
                        }}
                    >
                        <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditDriveFileDialog
                file={file}
                onEdit={onEdit}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <ConfirmDialog
                variant="delete"
                title="Delete file?"
                description={`This will remove "${file.title}".`}
                confirmLabel="Delete"
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
            />
        </>
    )
}
