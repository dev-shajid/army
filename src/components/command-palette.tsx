"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BookOpen, ClipboardList, Calendar, FileText, Folder, Search, File } from "lucide-react"

import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { searchDriveFiles } from "@/services/drive-file.service"
import type { DriveFile } from "@/types/drive"

// Category mapping for database values (snake_case) to display names
const categoryMapping: Record<string, string> = {
  sop: "SOP",
  sop_policy: "SOP Policy",
  a_branch: "A Branch",
  a_officer: "A Branch - Officer",
  a_jco: "A Branch - JCO",
  a_or: "A Branch - OR",
  q_branch: "Q Branch",
  q_officer: "Q Branch - Officer",
  q_jco: "Q Branch - JCO",
  q_or: "Q Branch - OR",
  g_branch: "G Branch",
  g_officer: "G Branch - Officer",
  g_jco: "G Branch - JCO",
  g_or: "G Branch - OR",
  co: "Commanding Officer",
  co_officer: "Commanding Officer",
  staff_officer: "Staff Officer",
  branch_clerk: "Branch Clerk",
  policy: "Policy",
  duty_roster: "Duty Roster",
  routine_orders: "Routine Orders",
  preci: "Preci",
  profile: "Profile",
}

function getCategoryLabel(category: string): string {
  return categoryMapping[category.toLowerCase()] || category
}

type CommandItemDef = {
  title: string
  href: string
  icon: any
  category: "SOP Policy" | "Duty Roster" | "Routine Orders" | "Preci" | "Profile"
}

const commandItems: CommandItemDef[] = [
  // SOP Policy
  { title: "SOP Policy - Overview", href: "/sop-policy", icon: BookOpen, category: "SOP Policy" },
  { title: "SOP - All Branches", href: "/sop-policy/sop", icon: Folder, category: "SOP Policy" },
  { title: "Policy Documents", href: "/sop-policy/policy", icon: FileText, category: "SOP Policy" },

  // A Branch
  { title: "A Branch - Overview", href: "/sop-policy/sop/a-branch", icon: Folder, category: "SOP Policy" },
  { title: "A Branch - Officer", href: "/sop-policy/sop/a-branch/officer", icon: FileText, category: "SOP Policy" },
  { title: "A Branch - JCO", href: "/sop-policy/sop/a-branch/jco", icon: FileText, category: "SOP Policy" },
  { title: "A Branch - OR", href: "/sop-policy/sop/a-branch/or", icon: FileText, category: "SOP Policy" },

  // Q Branch
  { title: "Q Branch - Overview", href: "/sop-policy/sop/q-branch", icon: Folder, category: "SOP Policy" },
  { title: "Q Branch - Officer", href: "/sop-policy/sop/q-branch/officer", icon: FileText, category: "SOP Policy" },
  { title: "Q Branch - JCO", href: "/sop-policy/sop/q-branch/jco", icon: FileText, category: "SOP Policy" },
  { title: "Q Branch - OR", href: "/sop-policy/sop/q-branch/or", icon: FileText, category: "SOP Policy" },

  // G Branch
  { title: "G Branch - Overview", href: "/sop-policy/sop/g-branch", icon: Folder, category: "SOP Policy" },
  { title: "G Branch - Officer", href: "/sop-policy/sop/g-branch/officer", icon: FileText, category: "SOP Policy" },
  { title: "G Branch - JCO", href: "/sop-policy/sop/g-branch/jco", icon: FileText, category: "SOP Policy" },
  { title: "G Branch - OR", href: "/sop-policy/sop/g-branch/or", icon: FileText, category: "SOP Policy" },

  // Other SOPs
  { title: "CO - Commanding Officer", href: "/sop-policy/sop/co", icon: FileText, category: "SOP Policy" },
  { title: "Staff Officer", href: "/sop-policy/sop/staff-officer", icon: FileText, category: "SOP Policy" },
  { title: "Branch Clerk", href: "/sop-policy/sop/branch-clerk", icon: FileText, category: "SOP Policy" },

  // Duty Roster
  { title: "Duty Roster - View", href: "/duty-roster", icon: Calendar, category: "Duty Roster" },
  { title: "Duty Roster - Manage", href: "/duty-roster/manage", icon: Calendar, category: "Duty Roster" },

  // Routine Orders
  { title: "Routine Orders - Part 1 & 2", href: "/parts", icon: FileText, category: "Routine Orders" },

  // Preci
  { title: "Preci - Department SOPs", href: "/preci", icon: FileText, category: "Preci" },

  // Profile
  { title: "Profile - My Account", href: "/profile", icon: ClipboardList, category: "Profile" },
]

// Memoized file item component to prevent unnecessary re-renders
const FileResultItem = React.memo(({ file, onSelect }: { file: DriveFile; onSelect: () => void }) => (
  <CommandItem
    key={file.id}
    value={String(file.id)}
    onSelect={onSelect}
    className="flex items-center gap-2 cursor-pointer"
  >
    <File className="h-4 w-4 flex-shrink-0" />
    <div className="flex flex-col flex-1 min-w-0">
      <span className="font-medium truncate">{file.title}</span>
      <span className="text-xs text-muted-foreground">
        {getCategoryLabel(file.category)}
      </span>
    </div>
  </CommandItem>
))

FileResultItem.displayName = "FileResultItem"

// Memoized navigation item component
const NavItem = React.memo(({ item, onSelect }: { item: CommandItemDef; onSelect: () => void }) => (
  <CommandItem
    key={item.href}
    value={item.href}
    onSelect={onSelect}
    className="flex items-center gap-2 cursor-pointer"
  >
    <item.icon className="h-4 w-4 flex-shrink-0" />
    <span>{item.title}</span>
  </CommandItem>
))

NavItem.displayName = "NavItem"

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<DriveFile[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const router = useRouter()

  // Debounced search for drive files
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const result = await searchDriveFiles(searchQuery.trim())
        if (result.success && result.data && Array.isArray(result.data)) {
          setSearchResults(result.data as DriveFile[])
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Keyboard shortcut - only set up once
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

  // Memoize handlers to prevent unnecessary re-renders of child components
  const handleSelect = React.useCallback((href: string) => {
    setOpen(false)
    setSearchQuery("")
    setSearchResults([])
    router.push(href)
  }, [router])

  const handleFileSelect = React.useCallback((fileId: string) => {
    setOpen(false)
    setSearchQuery("")
    setSearchResults([])
    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`
    window.open(previewUrl, "_blank", "noopener")
  }, [])

  // Memoize search results check
  const hasSearchResults = searchResults.length > 0
  const hasPageResults = searchQuery ? commandItems.some(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) : true
  const showNoResults = searchQuery && !isSearching && !hasSearchResults && !hasPageResults

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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search pages and files..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {isSearching && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching files...
            </div>
          )}

          {showNoResults && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No documents found.
            </div>
          )}

          {/* Search Results Section */}
          {hasSearchResults && (
            <>
              <CommandGroup heading={`Search Results (${searchResults.length})`}>
                {searchResults.map((file) => (
                  <FileResultItem
                    key={file.id}
                    file={file}
                    onSelect={() => handleFileSelect(file.fileId)}
                  />
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Navigation Menu - always shown, filtered by cmdk */}
          {["SOP Policy", "Duty Roster", "Routine Orders", "Preci", "Profile"].map(
            (category) => {
              const filteredItems = commandItems
                .filter((item: CommandItemDef) => item.category === category)
                .filter((item: CommandItemDef) =>
                  !searchQuery ||
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase())
                )

              if (filteredItems.length === 0) return null

              return (
                <CommandGroup key={category} heading={category}>
                  {filteredItems.map((item: CommandItemDef) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      onSelect={() => handleSelect(item.href)}
                    />
                  ))}
                </CommandGroup>
              )
            }
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}