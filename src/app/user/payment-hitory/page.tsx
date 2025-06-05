"use client"

import React, { useCallback, useEffect, useState } from 'react'

// Custom components
import SearchInput from "@/components/common/CommonSearchBar";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";
import TitleSection from "@/components/common/TitleSection";
import DataTable from '@/components/common/DataTable';

// Types
import { IPaymentHistory, ITicketBooking, ITicketBookingResponse } from './types';

// Services
import { apiCall } from '@/utils/services/request';

// Constants
import { API_ROUTES } from '@/utils/constant';
import { Column } from '@/utils/types';

const PaymentHistoryPage = () => {

    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [allBookingData, setAllBookingData] = useState<IPaymentHistory[]>([])
    const [bookingData, setBookingData] = useState<IPaymentHistory[]>([])

    // Fetch Booking Data
    const fetchBookingData = useCallback( async () => {
        setLoading(true)

        try {
            
            const response : ITicketBookingResponse = await apiCall({
                method: "GET",
                endPoint: API_ROUTES.EVENT.MY_EVENTS,
                withToken: true,
            })

            if(response && response.success) {
                const receivedArray = response.data as ITicketBooking[]

                const modifiedArray = receivedArray.map(item => {
                    return {
                        id: item._id,
                        title: item.event.title,
                        noSeats: item.seats,
                        totalAmount: item.totalAmount,
                        refundedAmount: 0,
                        bookingDate: "",
                        cancelledDate: "",
                        staus: item.bookingStatus,
                    }
                })

                setAllBookingData(modifiedArray)
                setBookingData(modifiedArray)

            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBookingData()
    },[fetchBookingData])

    const tableHeaders : Column<IPaymentHistory>[] = [
        { header : "Title", key: "title"},
        { header : "Seats Booked", key: "noSeats"},
        { header : "Booking Date", key: "bookingDate"},
        { header : "Cancelled Date", key: "cancelledDate"},
        { header : "Refunded Amount", key: "refundedAmount"},
        { header : "Status", key: "staus"},
    ]


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
                    <DataTable
                        loading={loading}
                        columns={tableHeaders}
                        data={bookingData}
                        showSerialNumber
                    />

                </ChartCard>
            </div>
        </div>
    )
}

export default PaymentHistoryPage