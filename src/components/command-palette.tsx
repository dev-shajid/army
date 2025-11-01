"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BookOpen, ClipboardList, GraduationCap, Calendar, FileText, Folder, Search } from "lucide-react"

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const commandItems = [
  // SOP Policy
  { title: "SOP Policy - View SOPs", href: "/sop-policy", icon: BookOpen, category: "SOP Policy" },
  { title: "A Branch", href: "/sop-policy/a-branch", icon: Folder, category: "SOP Policy" },
  { title: "Q Branch", href: "/sop-policy/q-branch", icon: Folder, category: "SOP Policy" },
  { title: "G Branch", href: "/sop-policy/g-branch", icon: Folder, category: "SOP Policy" },
  { title: "CO", href: "/sop-policy/co", icon: Folder, category: "SOP Policy" },
  { title: "Staff Officer", href: "/sop-policy/staff-officer", icon: Folder, category: "SOP Policy" },
  { title: "Branch Clerk", href: "/sop-policy/branch-clerk", icon: Folder, category: "SOP Policy" },

  // Duty Manual
  { title: "Duty Manual - Check Duties", href: "/duty-manual", icon: ClipboardList, category: "Duty Manual" },

  // Training
  { title: "Training - Take Quiz", href: "/training/quiz", icon: GraduationCap, category: "Training" },
  { title: "Training - Show Result", href: "/training/results", icon: GraduationCap, category: "Training" },

  // Duty Roster
  { title: "Duty Roster - Assign/View Duty", href: "/duty-roster", icon: Calendar, category: "Duty Roster" },

  // Routine Orders
  { title: "Routine Orders - Read & Ack", href: "/routine-orders", icon: FileText, category: "Routine Orders" },
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
          {["SOP Policy", "Duty Manual", "Training", "Duty Roster", "Routine Orders"].map((category) => (
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
