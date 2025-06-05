"use client"

import React, { useState } from 'react'

// Custom components
import SearchInput from "@/components/common/CommonSearchBar";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";
import TitleSection from "@/components/common/TitleSection";

const PaymentHistoryPage = () => {

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className='min-h-[calc(100vh-76px)] flex flex-col'>
            <div className="p-3 md:p-10">
                <ChartCard>
                    <TitleSection title='Payment History' />
                    <div className="flex gap-4 justify-between items-start sm:items-center my-5">
                        <div className="flex  items-baseline sm:items-center sm:flex-row flex-col gap-2 space-x-2 w-full">
                            <SearchInput
                                value={searchQuery}
                                onChange={(val) => setSearchQuery(val)}
                                wrapperClassName="md:w-[50%]"
                                inputClassName="pl-10 pr-4 py-2 w-full"
                            />
                        </div>
                    </div>

                    {/* Data Table + Pagination */}

                </ChartCard>
            </div>
        </div>
    )
}

export default PaymentHistoryPage