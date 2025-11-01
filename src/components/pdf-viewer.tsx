'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'

export default function PDFViewer() {
    // your Google Drive file ID
    const fileId = '18O0Cx36JyOShPFFhQMr47R3awKeO2hfF'

    // Google Drive URLs
    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

    const [isDownloading, setIsDownloading] = useState(false)

    async function handleDownload(e?: React.MouseEvent) {
        e?.preventDefault()
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

    return (
        <div className="flex flex-col items-center mt-8 space-y-4">
            {/* Embedded PDF Viewer */}
            <iframe
                src={previewUrl}
                width="800"
                height="600"
                allow="autoplay"
                className="rounded-xl shadow-lg border"
                title="PDF preview"
            />

            {/* Download Button (client-side fetch) */}
            <Button
                onClick={handleDownload}
                type="button"
                disabled={isDownloading}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed`}
            >
                {isDownloading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Downloading...
                    </>
                ) : (
                    '⬇️ Download PDF'
                )}
            </Button>
        </div>
    )
}
