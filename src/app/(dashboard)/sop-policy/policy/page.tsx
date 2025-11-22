import { FolderCard } from '@/components/folder-card'
import PageHeader from '@/components/page-header'
import PDFCard from '@/components/pdf-card'

export default function PolicyPage() {
  return (
    <>
      <PageHeader
        title="SOP Policy"
        description="Access Standard Operating Procedures organized by branch and role"
      />
      <div className='mt-12'>
        {/* <FolderCard
          href={"/sop-policy/sop/ipft"}
          title={"IPFT"}
          description=""
        /> */}
        <PDFCard
          doc={{ title: "IPFT", fileId: "1pmNPgsw3BM8FiSHUXX2Qa33q5yg_KeAj" }}
        />
      </div>
    </>
  )
}
