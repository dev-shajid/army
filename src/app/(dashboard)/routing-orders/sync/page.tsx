import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react"

const syncReports = [
  {
    id: "SYNC-001",
    title: "Daily Operations Report",
    lastSync: "2 hours ago",
    status: "Synced",
    records: 45,
  },
  {
    id: "SYNC-002",
    title: "Personnel Status Update",
    lastSync: "5 hours ago",
    status: "Synced",
    records: 128,
  },
  {
    id: "SYNC-003",
    title: "Equipment Inventory",
    lastSync: "1 day ago",
    status: "Pending",
    records: 89,
  },
  {
    id: "SYNC-004",
    title: "Training Records",
    lastSync: "3 days ago",
    status: "Failed",
    records: 0,
  },
]

export default function SyncReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Sync Reports</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage data synchronization</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {syncReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    {report.status === "Synced" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {report.status === "Pending" && <Clock className="h-4 w-4 text-orange-600" />}
                    {report.status === "Failed" && <AlertCircle className="h-4 w-4 text-red-600" />}
                  </div>
                  <CardDescription className="space-y-1">
                    <div>{report.id}</div>
                    <div className="flex items-center gap-2">
                      <span>Last sync: {report.lastSync}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          report.status === "Synced"
                            ? "default"
                            : report.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {report.status}
                      </Badge>
                      <span className="text-xs">{report.records} records</span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <RefreshCw className="h-3 w-3 mr-2" />
                Sync Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
