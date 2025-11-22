'use client'

import { Card, CardHeader, CardTitle } from './ui/card'
import { FileText, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

interface PDFCardDoc {
    title: string
    fileId: string
}

export default function PDFCard({ doc, rightSlot }: { doc: PDFCardDoc; rightSlot?: React.ReactNode }) {
    // Google Drive URLs
    const previewUrl = `https://drive.google.com/file/d/${doc.fileId}/preview`
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${doc.fileId}`
    const [isDownloading, setIsDownloading] = useState(false)
    const [mounted, setMounted] = useState(false);

    async function handleDownload(e?: React.MouseEvent) {
        e?.preventDefault()
        e?.stopPropagation()
        try {
            setIsDownloading(true)

            const res = await fetch(downloadUrl, {
                // Make sure we don't send any cookies that might cause redirect
                credentials: 'omit',
            })

            if (!res.ok) {
                throw new Error(`Failed to download file (${res.status})`)
            }

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            // Provide a sensible default filename
            a.download = 'document.pdf'
            document.body.appendChild(a)
            a.click()
            a.remove()
            // Revoke the object URL after a short delay to ensure download started
            setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch (err) {
            // Fallback: open the download URL in a new tab if fetch fails
            window.open(downloadUrl, '_blank', 'noopener')
        } finally {
            setIsDownloading(false)
        }
    }

    async function handleOpenPreview() {
        const a = document.createElement('a')
        a.href = previewUrl
        a.target = '_blank'
        a.rel = 'noopener'
        document.body.appendChild(a)
        a.click()
    }

    useEffect(() => setMounted(true), [])

    if (!mounted) return null;
    return (
        <Card className="hover:bg-accent transition-colors cursor-pointer hover:border-primary" onClick={handleOpenPreview}>
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                    </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => { /* prevent bubbling from action buttons */ e.stopPropagation() }}>
                    <Button
                        size='sm'
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            'Download'
                        )}
                    </Button>
                    {rightSlot}
                </div>
            </CardHeader>
        </Card>
    )
}
