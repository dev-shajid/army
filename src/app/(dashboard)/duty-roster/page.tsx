import PageHeader from "@/components/page-header"
import { getDutyRoster } from "@/services/duty.service"
import { isAdmin } from "@/services/auth.service"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export default async function DutyRosterPage() {
  const rosterResponse = await getDutyRoster()
  const isAdminUser = await isAdmin()

  const roster = rosterResponse.success && rosterResponse.data
    ? rosterResponse.data
    : { rp: [], first: [], second: [], third: [] }

  const columns = [
    { id: 'rp', name: 'RP Duty', time: '', data: roster.rp },
    { id: 'first', name: 'First Duty', time: '2100-0000', data: roster.first },
    { id: 'second', name: 'Second Duty', time: '0000-0300', data: roster.second },
    { id: 'third', name: 'Third Duty', time: '0300-0600', data: roster.third },
  ]

  // Find max rows needed
  const maxRows = Math.max(
    roster.rp.length,
    roster.first.length,
    roster.second.length,
    roster.third.length,
    1 // At least 1 row
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Duty Roster" description="View and manage your duty roster." />
        {isAdminUser && (
          <Link href="/duty-roster/manage">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage Roster
            </Button>
          </Link>
        )}
      </div>

      {!rosterResponse.success && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Failed to load duty roster: {rosterResponse.error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="border border-slate-200 dark:border-slate-700 px-6 py-4 text-left font-semibold text-sm"
                >
                  <p>{col.name}</p>
                  {col.time && <p className="text-xs text-muted-foreground mt-1">{col.time}</p>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {maxRows === 0 ? (
              <tr>
                <td colSpan={4} className="border border-slate-200 dark:border-slate-700 px-6 py-8 text-center text-muted-foreground">
                  No duty assignments yet. {isAdminUser && 'Click "Manage Roster" to add people.'}
                </td>
              </tr>
            ) : (
              Array.from({ length: maxRows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td
                      key={`${col.id}-row-${rowIndex}`}
                      className="border border-slate-200 dark:border-slate-700 px-6 py-4 text-sm"
                    >
                      {col.data[rowIndex] ? (
                        <span className="font-medium">{col.data[rowIndex].name}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}