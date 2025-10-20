"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BookOpen, ClipboardList, GraduationCap, Calendar, FileText, Folder, Search } from "lucide-react"

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const commandItems = [
  // SOP Library
  { title: "SOP Library - View SOPs", href: "/sop-library", icon: BookOpen, category: "SOP Library" },
  { title: "A Branch", href: "/sop-library/a-branch", icon: Folder, category: "SOP Library" },
  { title: "Q Branch", href: "/sop-library/q-branch", icon: Folder, category: "SOP Library" },
  { title: "G Branch", href: "/sop-library/g-branch", icon: Folder, category: "SOP Library" },
  { title: "CO", href: "/sop-library/co", icon: Folder, category: "SOP Library" },
  { title: "Staff Officer", href: "/sop-library/staff-officer", icon: Folder, category: "SOP Library" },
  { title: "Branch Clerk", href: "/sop-library/branch-clerk", icon: Folder, category: "SOP Library" },

  // Duty Manual
  { title: "Duty Manual - Check Duties", href: "/duty-manual", icon: ClipboardList, category: "Duty Manual" },

  // Training
  { title: "Training - Take Quiz", href: "/training/quiz", icon: GraduationCap, category: "Training" },
  { title: "Training - Show Result", href: "/training/results", icon: GraduationCap, category: "Training" },

  // Duty Roster
  { title: "Duty Roster - Assign/View Duty", href: "/duty-roster", icon: Calendar, category: "Duty Roster" },

  // Routing Orders
  { title: "Routing Orders - Read & Ack", href: "/routing-orders", icon: FileText, category: "Routing Orders" },
  { title: "Routing Orders - Sync Reports", href: "/routing-orders/sync", icon: FileText, category: "Routing Orders" },
]

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-full max-w-sm"
      >
        <Search className="h-4 w-4" />
        <span>Search pages...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} className="">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {["SOP Library", "Duty Manual", "Training", "Duty Roster", "Routing Orders"].map((category) => (
            <CommandGroup key={category} heading={category}>
              {commandItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <CommandItem
                    key={item.href}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}

        </CommandList>
      </CommandDialog>
    </>
  )
}
