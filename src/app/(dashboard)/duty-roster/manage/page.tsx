"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, X, Loader2, Trash2, Pencil, Save } from "lucide-react"
import { useEffect, useState } from "react"
import {
    getDutyRoster,
    addPersonToDuty,
    removePersonFromDuty,
    updatePersonName,
    type DutyPerson,
} from "@/services/duty.service"
import { isAdmin } from "@/services/auth.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog"

export default function ManageDutyRosterPage() {
    const router = useRouter()
    const [roster, setRoster] = useState({
        rp: [] as DutyPerson[],
        first: [] as DutyPerson[],
        second: [] as DutyPerson[],
        third: [] as DutyPerson[],
    })
    const [loading, setLoading] = useState(true)
    const [editingPerson, setEditingPerson] = useState<{ name: string; column: string } | null>(null)
    const [tempName, setTempName] = useState("")
    const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
    const [newPersonName, setNewPersonName] = useState("")

    const [savingName, setSavingName] = useState(false)
    const [addingPerson, setAddingPerson] = useState(false)
    const [removingPerson, setRemovingPerson] = useState<string | null>(null)

    const [deleteConfirmation, setDeleteConfirmation] = useState<{ name: string; column: string } | null>(null)

    const columns = [
        { id: "rp", name: "RP Duty", time: "" },
        { id: "first", name: "First Duty", time: "2100-0000" },
        { id: "second", name: "Second Duty", time: "0000-0300" },
        { id: "third", name: "Third Duty", time: "0300-0600" },
    ]

    useEffect(() => {
        checkAdminAndLoadData()
    }, [])

    async function checkAdminAndLoadData() {
        const adminStatus = await isAdmin()
        if (!adminStatus) {
            toast.error("Unauthorized access - Admin only")
            router.push("/duty-roster")
            return
        }

        await loadData()
    }

    async function loadData() {
        setLoading(true)

        const rosterResponse = await getDutyRoster()
        if (rosterResponse.success && rosterResponse.data) {
            setRoster(rosterResponse.data)
        } else {
            toast.error(rosterResponse.error || "Failed to load roster")
        }

        setLoading(false)
    }

    async function handleSaveName(oldName: string, column: string) {
        if (!tempName.trim()) {
            toast.error("Please enter a name")
            return
        }

        setSavingName(true)

        const response = await updatePersonName(oldName, column, tempName)
        if (response.success) {
            toast.success("Person updated successfully")
            await loadData()
            setEditingPerson(null)
            setTempName("")
        } else {
            toast.error(response.error || "Failed to update person")
        }

        setSavingName(false)
    }

    function confirmRemove(name: string, column: string) {
        setDeleteConfirmation({ name, column })
    }

    async function handleRemove() {
        if (!deleteConfirmation) return

        const { name, column } = deleteConfirmation

        setRemovingPerson(`${name}-${column}`)

        const response = await removePersonFromDuty(name, column)
        if (response.success) {
            toast.success("Person removed successfully")
            await loadData()
        } else {
            toast.error(response.error || "Failed to remove person")
        }

        setRemovingPerson(null)
        setDeleteConfirmation(null)
    }

    function startEditing(name: string, column: string) {
        setEditingPerson({ name, column })
        setTempName(name)
    }

    function cancelEditing() {
        setEditingPerson(null)
        setTempName("")
    }

    async function handleAddPerson(column: "rp" | "first" | "second" | "third") {
        if (!newPersonName.trim()) {
            toast.error("Please enter a name")
            return
        }

        setAddingPerson(true)

        const response = await addPersonToDuty(newPersonName, column)
        if (response.success) {
            toast.success("Person added successfully")
            await loadData()
            setAddingToColumn(null)
            setNewPersonName("")
        } else {
            toast.error(response.error || "Failed to add person")
        }

        setAddingPerson(false)
    }

    function cancelAdding() {
        setAddingToColumn(null)
        setNewPersonName("")
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <div>
                        <p className="text-lg font-semibold">Loading duty roster</p>
                        <p className="text-sm text-muted-foreground">Please wait...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/duty-roster">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Manage Duty Roster</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click on names to edit, or use the add button to add new people
                        </p>
                    </div>
                </div>

                {/* Duty Roster Table */}
                <div className="border rounded-lg shadow-sm bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    {columns.map((col) => (
                                        <TableHead key={col.id} className="w-[250px] min-w-[200px]">
                                            <div className="flex flex-col py-2">
                                                <span className="font-bold text-foreground text-base">{col.name}</span>
                                                {col.time && <span className="text-xs font-normal text-muted-foreground">{col.time}</span>}
                                                <span className="text-xs font-normal text-muted-foreground mt-0.5">
                                                    {roster[col.id as keyof typeof roster].length}{" "}
                                                    {roster[col.id as keyof typeof roster].length === 1 ? "person" : "people"}
                                                </span>
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Render rows for existing people */}
                                {Array.from({
                                    length: Math.max(roster.rp.length, roster.first.length, roster.second.length, roster.third.length),
                                }).map((_, rowIndex) => (
                                    <TableRow key={rowIndex} className="hover:bg-muted/5">
                                        {columns.map((col) => {
                                            const person = roster[col.id as keyof typeof roster][rowIndex]
                                            const isEditing =
                                                editingPerson?.name === person?.name && editingPerson?.column === person?.duty_column
                                            const isRemoving = removingPerson === `${person?.name}-${person?.duty_column}`

                                            return (
                                                <TableCell key={`${col.id}-${rowIndex}`} className="align-top py-2">
                                                    {person ? (
                                                        <div className="relative group">
                                                            {isEditing ? (
                                                                <div className="flex gap-2 items-center bg-background p-1 rounded border shadow-sm z-10">
                                                                    <Input
                                                                        value={tempName}
                                                                        onChange={(e) => setTempName(e.target.value)}
                                                                        placeholder="Enter name"
                                                                        autoFocus
                                                                        disabled={savingName}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === "Enter" && !savingName) {
                                                                                handleSaveName(person.name, person.duty_column)
                                                                            } else if (e.key === "Escape" && !savingName) {
                                                                                cancelEditing()
                                                                            }
                                                                        }}
                                                                        className="h-8 text-sm ring-0 border-0 !bg-transparent focus-visible:ring-0"
                                                                    />
                                                                    <Button
                                                                        size="icon"
                                                                        className="h-8 w-8 shrink-0"
                                                                        onClick={() => handleSaveName(person.name, person.duty_column)}
                                                                        disabled={savingName}
                                                                    >
                                                                        {savingName ? (
                                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                                        ) : (
                                                                            <Save className="size-3" />
                                                                        )}
                                                                        <span className="sr-only">Save</span>
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 shrink-0"
                                                                        onClick={cancelEditing}
                                                                        disabled={savingName}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                        <span className="sr-only">Cancel</span>
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={`
                                    flex items-center justify-between gap-2 
                                    p-2 rounded-md border bg-card
                                    transition-all duration-200
                                    ${isRemoving ? "opacity-50 bg-destructive/10 border-destructive/20" : "hover:border-primary/50 hover:shadow-sm"}
                                  `}
                                                                >
                                                                    <span className="font-medium text-sm truncate select-all">{person.name}</span>
                                                                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                                            onClick={() => startEditing(person.name, person.duty_column)}
                                                                            disabled={isRemoving}
                                                                            title="Edit name"
                                                                        >
                                                                            <Pencil className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                                            onClick={() => confirmRemove(person.name, person.duty_column)}
                                                                            disabled={isRemoving}
                                                                            title="Remove person"
                                                                        >
                                                                            {isRemoving ? (
                                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                            ) : (
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="h-9"></div> // Empty slot placeholder
                                                    )}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}

                                {/* Add Person Row */}
                                <TableRow className="bg-muted/20 hover:bg-muted/20 border-t-2">
                                    {columns.map((col) => (
                                        <TableCell key={`add-${col.id}`} className="p-2 align-top">
                                            {addingToColumn === col.id ? (
                                                <div className="space-y-2 bg-background p-2 rounded-md border shadow-sm">
                                                    <Input
                                                        value={newPersonName}
                                                        onChange={(e) => setNewPersonName(e.target.value)}
                                                        placeholder="Name..."
                                                        autoFocus
                                                        disabled={addingPerson}
                                                        className="h-8 text-sm"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && !addingPerson) {
                                                                handleAddPerson(col.id as "rp" | "first" | "second" | "third")
                                                            } else if (e.key === "Escape" && !addingPerson) {
                                                                cancelAdding()
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 h-7 text-xs"
                                                            onClick={() => handleAddPerson(col.id as "rp" | "first" | "second" | "third")}
                                                            disabled={addingPerson}
                                                        >
                                                            {addingPerson ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 w-7 px-0"
                                                            onClick={cancelAdding}
                                                            disabled={addingPerson}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 h-8"
                                                    onClick={() => setAddingToColumn(col.id)}
                                                >
                                                    <Plus className="h-3.5 w-3.5 mr-2" />
                                                    <span className="text-xs">Add Person</span>
                                                </Button>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>


            <DeleteConfirmDialog
                open={!!deleteConfirmation}
                onOpenChange={(open) => !open && setDeleteConfirmation(null)}
                title="Remove Person"
                description={`This will remove '${deleteConfirmation?.name}' from the duty roster.
              This action cannot be undone.`}
                loading={!!removingPerson}
                onConfirm={handleRemove}
            />
        </div>
    )
}
