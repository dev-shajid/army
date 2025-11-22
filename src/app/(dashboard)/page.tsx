import ImageSlider from '@/components/image-slider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="container mx-auto gap-12 py-12 px-4 flex flex-col items-center justify-center">

      <div className="text-center">
        <div className="mt-2 text-3xl font-semibold">👋 Welcome to SOP & Duty Manuals</div>
        <div className="mt-1 text-muted-foreground">A simple place to manage SOPs, duty manuals, routine orders and training.</div>
      </div>
      <ImageSlider />
      {/* <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="text-6xl">👋</div>
          <CardTitle className="mt-2 text-3xl">Welcome to SOP & Duty Manuals</CardTitle>
          <CardDescription className="mt-1">A simple place to manage SOPs, duty manuals, routine orders and training.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="text-muted-foreground">This dashboard gives you a quick overview and access to your unit&apos;s operational documents.</CardDescription>
          <p className="mt-4 text-xs text-muted-foreground">Tip: Use the sidebar to navigate to SOP Library, Duty Roster, Routing Orders and Training.</p>
        </CardContent>
      </Card> */}
    </div>
  )
}