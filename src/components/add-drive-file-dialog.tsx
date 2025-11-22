"use client"

import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { DriveCategory } from '@/types/drive'
import { useRouter } from 'next/navigation'

type Props = {
    category: DriveCategory
    onAdd: (data: { title: string; fileId: string }) => Promise<{ ok: boolean; error?: string }>
}

export default function AddDriveFileDialog({ category, onAdd }: Props) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [fileId, setFileId] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const submit = () => {
        if (!title.trim() || !fileId.trim()) {
            toast.error('Please provide title and fileId')
            return
        }
        startTransition(async () => {
            const res = await onAdd({ title: title.trim(), fileId: fileId.trim() })
            if (res.ok) {
                toast.success('File added')
                setOpen(false)
                setTitle('')
                setFileId('')
                router.refresh()
            } else {
                toast.error(res.error || 'Failed to add file')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add File to {category}</DialogTitle>
                    <DialogDescription>Provide a title and Google Drive file ID.</DialogDescription>
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
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={submit} disabled={isPending}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
