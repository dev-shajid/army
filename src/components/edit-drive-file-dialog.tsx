"use client"

import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
    file: { id: string; title: string; fileId: string }
    onEdit: (data: { id: string; title: string; fileId: string }) => Promise<{ ok: boolean; error?: string }>
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export default function EditDriveFileDialog({ file, onEdit, open: controlledOpen, onOpenChange, trigger }: Props) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
    const [title, setTitle] = useState(file.title)
    const [fileId, setFileId] = useState(file.fileId)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleOpenChange = (next: boolean) => {
        if (controlledOpen !== undefined) {
            onOpenChange?.(next)
        } else {
            setUncontrolledOpen(next)
        }
        if (!next) {
            setTitle(file.title)
            setFileId(file.fileId)
        }
    }

    const submit = () => {
        if (!title.trim() || !fileId.trim()) {
            toast.error('Please provide title and fileId')
            return
        }
        startTransition(async () => {
            const res = await onEdit({ id: file.id, title: title.trim(), fileId: fileId.trim() })
            if (res.ok) {
                toast.success('File updated')
                handleOpenChange(false)
                router.refresh()
            } else {
                toast.error(res.error || 'Failed to update file')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit File</DialogTitle>
                    <DialogDescription>Update the title or Google Drive file ID.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm">Title</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Daily Routine Orders" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm">File ID</label>
                        <Input value={fileId} onChange={(e) => setFileId(e.target.value)} placeholder="Google Drive file ID" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={submit} disabled={isPending}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
