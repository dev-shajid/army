import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User } from "lucide-react"

const duties = [
  {
    title: "Guard Duty",
    location: "Main Gate",
    time: "0600 - 1800",
    personnel: "Cpl. Johnson",
    status: "Active",
  },
  {
    title: "Patrol Duty",
    location: "Perimeter",
    time: "1800 - 0600",
    personnel: "Sgt. Williams",
    status: "Active",
  },
  {
    title: "Admin Duty",
    location: "HQ Building",
    time: "0800 - 1700",
    personnel: "Lt. Anderson",
    status: "Scheduled",
  },
  {
    title: "Equipment Check",
    location: "Armory",
    time: "0900 - 1200",
    personnel: "Pvt. Martinez",
    status: "Scheduled",
  },
]

export default function DutyManualPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Duty Manual</h1>
        <p className="text-muted-foreground mt-2">Check current and scheduled duties</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {duties.map((duty, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{duty.title}</CardTitle>
                  <CardDescription className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{duty.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{duty.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{duty.personnel}</span>
                    </div>
                  </CardDescription>
                </div>
                <Badge variant={duty.status === "Active" ? "default" : "secondary"}>{duty.status}</Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
