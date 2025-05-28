import React from 'react'

// Custom components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import TitleSection from '@/components/common/TitleSection'

const OrganizerDashboardPage = () => {
  return (
    <div className='px-8 py-5'>
      <ChartCard>
        <div className='min-h-[315px]'>
          <TitleSection title='Welcome to Organizer Dashboard' />
        </div>
      </ChartCard>
    </div>
  )
}

export default OrganizerDashboardPage