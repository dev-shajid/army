import { Loader2 } from 'lucide-react'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
        <Loader2 className="animate-spin mx-auto" />
    </div>
  )
}
