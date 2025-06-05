"use client"

import React, { useCallback, useEffect, useState } from 'react'

// Custom components
import SearchInput from "@/components/common/CommonSearchBar";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";
import TitleSection from "@/components/common/TitleSection";
import DataTable from '@/components/common/DataTable';

// Types
import { IPaymentHistory, ITicketBooking, ITicketBookingResponse } from './types';
import { Column } from '@/utils/types';

// Services
import { apiCall } from '@/utils/services/request';

// Constants
import { API_ROUTES } from '@/utils/constant';

// Helper
import { getAmountInfo, getChipLabel, getSearchResults } from './helper';

// Library
import moment from 'moment';
import { IndianRupee } from 'lucide-react';

const PaymentHistoryPage = () => {

    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [allBookingData, setAllBookingData] = useState<IPaymentHistory[]>([])
    const [bookingData, setBookingData] = useState<IPaymentHistory[]>([])

    const handleSearch = (val : string) => {
        const searchedResult = getSearchResults(allBookingData,val)
        setBookingData(searchedResult)
        setSearchQuery(val)
    }

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
                        totalAmount: getAmountInfo(item).totalAmountPaid,
                        refundedAmount: getAmountInfo(item).refundedAmount,
                        bookingDate: moment(item.bookingDate).format("DD MMM YYYY [at] hh:mm A"),
                        cancelledDate: item.cancelledAt !== null ? moment(item.bookingDate).format("DD MMM YYYY [at] hh:mm A") : "-",
                        staus: getChipLabel(item),
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

    const tableHeaders: Column<IPaymentHistory>[] = [
      { header: "Title", key: "title" },
      { header: "Seats", key: "noSeats" },
      { header: "Booking Date", key: "bookingDate" },
      { header: "Cancelled Date", key: "cancelledDate" },
      {
        header: "Refunded Amount",
        key: "refundedAmount",
        render: (row) => {
          return (
            <div className="flex items-center">
              <IndianRupee className="h-4 w-4" />
              {row.refundedAmount}
            </div>
          );
        },
      },
      {
        header: "Amount Paid",
        key: "totalAmount",
        render: (row) => {
          return (
            <div className="flex items-center">
              <IndianRupee className="h-4 w-4" />
              {row.totalAmount}
            </div>
          );
        },
      },
      {
        header: "Status",
        key: "staus",
        render: (row) => {
          const chipStyles = {
            booked: "bg-blue-100 text-blue-700",
            attended: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
          };

          return (
            <span
              className={`px-4 py-2 rounded-full text-sm capitalize font-semibold ${
                chipStyles[row.staus as keyof typeof chipStyles]
              }`}
            >
              {row.staus}
            </span>
          );
        },
      },
    ];


    return (
        <div className='min-h-[calc(100vh-76px)] flex flex-col'>
            <div className="p-3 md:p-10">
                <ChartCard>
                    <TitleSection title='Payment History' />
                    <div className="flex gap-4 justify-between items-start sm:items-center my-5">
                        <div className="flex  items-baseline sm:items-center sm:flex-row flex-col gap-2 space-x-2 w-full">
                            <SearchInput
                                value={searchQuery}
                                onChange={(val) => handleSearch(val)}
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