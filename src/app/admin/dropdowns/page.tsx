import React from 'react'
import Breadcrumbs from '@/components/common/BreadCrumbs';
import { BREAD_CRUMBS_ITEMS } from '@/utils/constant';
import TicketTypeDropdown from '@/components/admin-components/TicketTypeDropdown';

function DropdownPage() {

    return (
        <div className='p-8'>
            <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.DROPDOWN.MAIN_PAGE} />
            <TicketTypeDropdown />
        </div>
    )
}

export default DropdownPage