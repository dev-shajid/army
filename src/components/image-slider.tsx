"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageSliderProps {
    intervalMs?: number
    className?: string
    imgClassName?: string
    rounded?: string // e.g. "rounded-lg"
}

export default function ImageSlider({
    intervalMs = 6000,
    className,
    imgClassName,
    rounded = "rounded-lg",
}: ImageSliderProps) {
    const [active, setActive] = React.useState(0)
    const images = [
        '/slide-1.png',
        '/slide-2.png',
    ]
    const enabled = images && images.length > 1

    React.useEffect(() => {
        if (!enabled) return
        const id = setInterval(() => {
            setActive((i) => (i + 1) % images.length)
        }, intervalMs)
        return () => clearInterval(id)
    }, [enabled, images.length, intervalMs])

    if (!images || images.length === 0) return null

    return (
        <div className={cn("relative max-w-3xl w-full overflow-hidden aspect-video", rounded, className)}>
            {/* Render all images stacked; transition opacity + blur on active */}
            {images.map((img, i) => {
                const isActive = i === active
                return (
                    <div
                        key={img + i}
                        className={cn(
                            "absolute inset-0 transition-all duration-700 ease-in-out will-change-transform",
                            isActive
                                ? "opacity-100 blur-0 scale-100"
                                : "opacity-0 blur-sm scale-105"
                        )}
                    >
                        <Image
                            src={img}
                            alt={'Slides'}
                            fill
                            priority={i === 0}
                            sizes="100vw"
                            className={cn("object-cover", imgClassName)}
                        />
                    </div>
                )
            })}
            {/* Maintain aspect ratio by reserving height with a spacer if caller doesn't constrain height */}
            <div className="invisible pointer-events-none select-none">
                {/* If consumers don't constrain parent height, they can set it via className (e.g., h-64) */}
                {/* This spacer keeps layout stable without content flash */}
            </div>
        </div>
    )
}
