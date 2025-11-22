'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus, UserMinus, Save, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getDutyRoster, getAllPersonnel, assignPersonnel, removePersonnelFromPosition, createPersonnel } from "@/services/duty-roster.service"
import { DutyLocationWithPersonnel, Personnel } from "@/types/duty-roster"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { isAdmin } from "@/services/auth.service"

export default function ManageDutyRosterPage() {
  const [roster, setRoster] = useState<DutyLocationWithPersonnel[]>([])
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [newPersonnelName, setNewPersonnelName] = useState("")
  const [newPersonnelRank, setNewPersonnelRank] = useState("")

  useEffect(() => {
    checkAdminAndLoadData()
  }, [])

  async function checkAdminAndLoadData() {
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      toast.error("Unauthorized access")
      redirect('/routing-orders')
      return
    }

    setIsAdminUser(true)
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

    const personnelResponse = await getAllPersonnel()
    if (personnelResponse.success && personnelResponse.data) {
      setAllPersonnel(personnelResponse.data)
    } else {
      toast.error(personnelResponse.error || "Failed to load personnel")
    }

    setLoading(false)
  }

  async function handleAssignPersonnel(locationId: string, personnelId: string, position: number) {
    const response = await assignPersonnel(locationId, personnelId, position)
    if (response.success) {
      toast.success("Personnel assigned successfully")
      await loadData()
      setSelectedLocation(null)
      setSelectedPosition(null)
    } else {
      toast.error(response.error || "Failed to assign personnel")
    }
  }

  async function handleRemovePersonnel(locationId: string, position: number) {
    const response = await removePersonnelFromPosition(locationId, position)
    if (response.success) {
      toast.success("Personnel removed successfully")
      await loadData()
    } else {
      toast.error(response.error || "Failed to remove personnel")
    }
  }

  async function handleCreatePersonnel() {
    if (!newPersonnelName.trim()) {
      toast.error("Please enter a name")
      return
    }

    const response = await createPersonnel({
      name: newPersonnelName,
      rank: newPersonnelRank || undefined
    })

    if (response.success) {
      toast.success("Personnel created successfully")
      setNewPersonnelName("")
      setNewPersonnelRank("")
      await loadData()
    } else {
      toast.error(response.error || "Failed to create personnel")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading duty roster...</p>
        </div>
      </div>
    )
  }

  if (!isAdminUser) {
    return null
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Duty Roster</h1>
          <p className="text-muted-foreground mt-2">Assign and manage personnel for duty locations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Personnel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Personnel</DialogTitle>
              <DialogDescription>Create a new personnel record to assign to duty locations.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newPersonnelName}
                  onChange={(e) => setNewPersonnelName(e.target.value)}
                  placeholder="Enter personnel name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">Rank (Optional)</Label>
                <Input
                  id="rank"
                  value={newPersonnelRank}
                  onChange={(e) => setNewPersonnelRank(e.target.value)}
                  placeholder="Enter rank"
                />
              </div>
              <Button onClick={handleCreatePersonnel} className="w-full">
                Create Personnel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              {roster.map((location) => (
                <th
                  key={location.id}
                  className="border border-slate-200 dark:border-slate-700 px-6 py-4 text-left font-semibold text-sm"
                >
                  <p>{location.name}</p>
                  <p className="text-xs text-muted-foreground">{location.time}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {roster.map((location) => (
                  <td
                    key={`${location.id}-row-${rowIndex}`}
                    className="border border-slate-200 dark:border-slate-700 px-6 py-4 text-sm"
                  >
                    {location.personnel[rowIndex] ? (
                      <div className="flex items-center justify-between gap-2">
                        <span>{location.personnel[rowIndex].name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePersonnel(location.id, rowIndex)}
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedLocation(location.id)
                              setSelectedPosition(rowIndex)
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Personnel</DialogTitle>
                            <DialogDescription>
                              Select a personnel to assign to {location.name} - Position {rowIndex + 1}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto mt-4">
                            {allPersonnel.map((person) => (
                              <Button
                                key={person.id}
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleAssignPersonnel(location.id, person.id, rowIndex)}
                              >
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{person.name}</span>
                                  {person.rank && (
                                    <span className="text-xs text-muted-foreground">{person.rank}</span>
                                  )}
                                </div>
                              </Button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Personnel</CardTitle>
          <CardDescription>All personnel that can be assigned to duty locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allPersonnel.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{person.name}</span>
                    {person.rank && (
                      <span className="text-xs text-muted-foreground">{person.rank}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
