"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle2, Clock } from "lucide-react"

const orders = [
  {
    id: "RO-2025-001",
    title: "Quarterly Training Schedule Update",
    date: "Jan 18, 2025",
    priority: "High",
    acknowledged: false,
  },
  {
    id: "RO-2025-002",
    title: "Equipment Maintenance Protocol",
    date: "Jan 15, 2025",
    priority: "Medium",
    acknowledged: true,
  },
  {
    id: "RO-2025-003",
    title: "Security Clearance Renewal Notice",
    date: "Jan 12, 2025",
    priority: "High",
    acknowledged: false,
  },
  {
    id: "RO-2025-004",
    title: "Leave Policy Amendment",
    date: "Jan 10, 2025",
    priority: "Low",
    acknowledged: true,
  },
]

export default function RoutingOrdersPage() {
  const [ordersList, setOrdersList] = useState(orders)

  const handleAcknowledge = (id: string) => {
    setOrdersList(ordersList.map((order) => (order.id === id ? { ...order, acknowledged: true } : order)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Routing Orders</h1>
          <p className="text-muted-foreground mt-2">Read and acknowledge routing orders</p>
        </div>
        <Button variant="outline">View Archive</Button>
      </div>

      <div className="grid gap-4">
        {ordersList.map((order) => (
          <Card key={order.id} className={!order.acknowledged ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{order.title}</CardTitle>
                      {order.acknowledged ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span>{order.id}</span>
                        <span>•</span>
                        <span>{order.date}</span>
                        <Badge
                          variant={
                            order.priority === "High"
                              ? "destructive"
                              : order.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                          className="ml-2"
                        >
                          {order.priority}
                        </Badge>
                      </div>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  {!order.acknowledged && (
                    <Button size="sm" onClick={() => handleAcknowledge(order.id)}>
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
