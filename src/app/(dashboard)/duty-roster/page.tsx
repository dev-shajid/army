"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"

const rosterData = [
  { date: "Jan 20, 2025", duty: "Guard Duty", personnel: "Cpl. Johnson", shift: "Day", status: "Assigned" },
  { date: "Jan 20, 2025", duty: "Patrol", personnel: "Sgt. Williams", shift: "Night", status: "Assigned" },
  { date: "Jan 21, 2025", duty: "Admin Duty", personnel: "Lt. Anderson", shift: "Day", status: "Assigned" },
  { date: "Jan 21, 2025", duty: "Equipment Check", personnel: "Pvt. Martinez", shift: "Day", status: "Pending" },
  { date: "Jan 22, 2025", duty: "Guard Duty", personnel: "Unassigned", shift: "Day", status: "Open" },
]

export default function DutyRosterPage() {
  const [filter, setFilter] = useState<string>("all")

  const filteredRoster =
    filter === "all" ? rosterData : rosterData.filter((item) => item.status.toLowerCase() === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Duty Roster</h1>
          <p className="text-muted-foreground mt-2">Assign and view duty schedules</p>
        </div>
        <Button>Assign New Duty</Button>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "assigned" ? "default" : "outline"} size="sm" onClick={() => setFilter("assigned")}>
          Assigned
        </Button>
        <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
          Pending
        </Button>
        <Button variant={filter === "open" ? "default" : "outline"} size="sm" onClick={() => setFilter("open")}>
          Open
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredRoster.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.duty}</CardTitle>
                    <Badge
                      variant={
                        item.status === "Assigned" ? "default" : item.status === "Pending" ? "secondary" : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{item.shift} Shift</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{item.personnel}</span>
                    </div>
                  </CardDescription>
                </div>
                {item.status === "Open" && (
                  <Button size="sm" className="ml-4">
                    Assign
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
