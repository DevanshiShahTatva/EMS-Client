import React from 'react'
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import TicketTypeDropdown from '@/components/admin-components/TicketTypeDropdown'

function DropdownPage() {
    return (
        <div className='p-8'>
            <ChartCard>
                <TicketTypeDropdown />
            </ChartCard>
        </div>
    )
}

export default DropdownPage