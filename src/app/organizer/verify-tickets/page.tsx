"use client"

import React, { useState } from 'react'
import Link from 'next/link'

// Custom Components
import QRCodeScanner from '@/components/organizer-components/QRCodeScanner'
import Loader from '@/components/common/Loader'
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import Breadcrumbs from '@/components/common/BreadCrumbs'
import CustomButton from '@/components/common/CustomButton'

// Library
import { toast } from 'react-toastify'

// Service
import { apiCall } from '@/utils/services/request'

// Conststans
import { API_ROUTES, BREAD_CRUMBS_ITEMS, ROUTES } from '@/utils/constant'

// Icons
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'

// types
import { ITicketQRData } from '@/utils/types'

const VerifyTicketPage = () => {

  const INITIAL_TICKETS_DATA = {
    id: "", eventName: "", eventTicketCount: 0, eventTicketPrice: 0,
  }

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [verifyStatus, setVerifyStatus] = useState<"success" | "pending" | "failed">("pending")
  const [ticketData, setTicketData] = useState<ITicketQRData>(INITIAL_TICKETS_DATA)


  const verifyTicket = async (values: ITicketQRData) => {
    setTicketData(values)
    setLoading(true)
    try {

      const body = {
        "ticketId": values.id
      }
      const response = await apiCall({
        endPoint: API_ROUTES.STAFF.VALIDATE_TICKETS,
        method: 'POST',
        body: body
      });

      if (response && response.success) {
        toast.success("Ticket Verified Successully")
        setVerifyStatus("success")
        setTicketData(values)
      }
    } catch (err: any) {
      console.error('Error in validating', err);
      let errorMessage = err.response?.data?.message || "Something went wrong, Please Try again after sometime.";
      setVerifyStatus("failed")
      setErrorMsg(errorMessage)
    } finally {
      setLoading(false);
    }
  }

  const handleCloseModal = () => {
    setErrorMsg("")
    setTicketData(INITIAL_TICKETS_DATA)
    setVerifyStatus("pending")
  }

  const renderTicketsData = () => {
    return (
      <div className="border-t border-b border-gray-200 py-4 my-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Event</span>
            <span className="font-medium text-gray-900">{ticketData.eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">No of tickets</span>
            <span className="font-medium text-gray-900">{ticketData.eventTicketCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-medium text-gray-900">
              ₹{ticketData.eventTicketPrice}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='px-8 py-5'>
      {loading && <Loader />}

      <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.ORGANIZER.SCAN_TICKET_ITEMS} />

      <ChartCard>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 p-5 items-start">
          {/* Updated Instructions */}
          <div className="col-span-1 hidden md:col-span-6 lg:col-span-3 md:flex flex-col justify-center py-8">
            <h2 className="text-4xl text-center lg:text-start font-semibold text-gray-800 mb-5">Verify Tickets</h2>
            <ol className="text-gray-700 text-left text-lg  list-decimal list-inside space-y-2 my-3">
              <li>Click on scan button to scan the user’s tickets</li>
              <li>If the ticket is valid, then user will <strong>Allowed</strong> to attend event</li>
            </ol>
          </div>

          {/* QR Image Card */}
          <div className="col-span-1 md:col-span-6 lg:col-span-3 flex flex-col items-center justify-center text-center">
            <h2 className="md:hidden text-4xl text-center lg:text-start font-semibold text-gray-800 mb-3 md:mb-5">Verify Tickets</h2>
            <p className="text-gray-700 text-left text-lg list-decimal list-inside space-y-2 my-3 block md:hidden">
              Click on scan to verify user’s tickets.
            </p>
            <div className='mt-5 md:mt-0 w-full h-full'>
              <QRCodeScanner getScannedQRValues={(values) => verifyTicket(values)} />
            </div>
          </div>
        </div>
      </ChartCard>

      {/* success modal */}
      {verifyStatus === "success" &&
        <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ticket Verified Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Your ticket has been successfully verified. Thank you for choosing us— Enjoy the event!
              </p>
            </div>

            {renderTicketsData()}

            <div className="text-center">
              <CustomButton
                onClick={handleCloseModal}
                variant='primary'
                className="w-full py-3 px-4"
              >
                Complete
              </CustomButton>
            </div>
          </div>
        </div>
      }

       {/* failed modal */}
      {verifyStatus === "failed" &&
        <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <XCircleIcon className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification failed
              </h1>
              <p className="text-gray-600 mb-6">
                {errorMsg}
              </p>
            </div>

            {renderTicketsData()}

            <div className="text-center">
              <CustomButton
                onClick={handleCloseModal}
                variant='delete'
                className="w-full py-3 px-4"
              >
                Try Again
              </CustomButton>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default VerifyTicketPage