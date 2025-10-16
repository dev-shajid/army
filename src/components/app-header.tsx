'use client'

import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import CommandPalette from './command-palette'

export default function AppHeader() {
    const { setTheme, theme } = useTheme()

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4 flex-1"
            />
            <CommandPalette />
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            >
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
            </Button>

        </header>
    )
}
