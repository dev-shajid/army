import PageHeader from "@/components/page-header"

const rosterData = [
  {
    id: "location-1",
    name: "RP Duty",
    personnel: [
      { id: "p1", name: "Md. Karim Khan" },
      { id: "p2", name: "Faisal Ahmed" },
      { id: "p3", name: "Jahangir Alam" },
      { id: "p4", name: "Belal Hossain" },
      { id: "p5", name: "Rafiq Miah" },
      { id: "p6", name: "Noor Islam" },
    ],
  },
  {
    id: "location-2",
    name: "First Duty",
    time: "2100-0000",
    personnel: [
      { id: "p7", name: "Abdul Mannan" },
      { id: "p8", name: "Habib Rahman" },
      { id: "p9", name: "Muhammad Hasan" },
      { id: "p10", name: "Shafiq Ahmed" },
      { id: "p11", name: "Jalal Uddin" },
      { id: "p12", name: "Nasir Ali" },
    ],
  },
  {
    id: "location-3",
    name: "Second Duty",
    time: "0000-0300",
    personnel: [
      { id: "p13", name: "Sardar Aziz" },
      { id: "p14", name: "Imtiaz Hussain" },
      { id: "p15", name: "Harun Ar Rashid" },
      { id: "p16", name: "Milon Kumar" },
      { id: "p17", name: "Sujon Roy" },
      { id: "p18", name: "Rony Chakma" },
    ],
  },
  {
    id: "location-4",
    name: "Third Duty ",
    time: "0300-0600",
    personnel: [
      { id: "p19", name: "Anwar Hossain" },
      { id: "p20", name: "Fazlul Haque" },
      { id: "p21", name: "Md. Ismail" },
      { id: "p22", name: "Saiful Islam" },
      { id: "p23", name: "Rifat Ahmed" },
      { id: "p24", name: "Tipu Sultan" },
    ],
  },
]

export default function SimpleLocationRoster() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Duty Roster" description="View and manage your duty roster." />

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              {rosterData.map((location) => (
                <th
                  key={location.id}
                  className="border border-slate-200 dark:border-slate-700 px-6 py-4 text-left font-semibold text-sm"
                >
                  <p>{location.name}</p>
                  <p>{location.time}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {rosterData.map((location) => (
                  <td
                    key={`${location.id}-row-${rowIndex}`}
                    className="border border-slate-200 dark:border-slate-700 px-6 py-4 text-sm"
                  >
                    {location.personnel[rowIndex] ? location.personnel[rowIndex].name : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}