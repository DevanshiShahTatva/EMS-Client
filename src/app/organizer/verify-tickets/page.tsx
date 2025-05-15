"use client"

import React, { useState } from 'react'
import Link from 'next/link'

// Custom Components
import QRCodeScanner from '@/components/organizer-components/QRCodeScanner'
import Loader from '@/components/common/Loader'
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import Breadcrumbs from '@/components/common/BreadCrumbs'

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

  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<"success" | "pending" | "failed">("pending")
  const [ticketData, setTicketData] = useState<ITicketQRData>({
    id : "", eventName : "",eventTicketCount : 0, eventTicketPrice: 0,
  })


  const verifyTicket = async (values : ITicketQRData) => {
    setLoading(true)
    try {

      const body = {
        "ticketId":  values.id
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
        setIsSuccess(true)
      }
    } catch (err) {
      console.error('Error in validating', err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='px-8 py-5'>
      { loading && <Loader />}


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

            <p className="hidden md:block md:mt-10 lg:mt-50 text-lg text-gray-600">
              Need support?{" "}
              <Link href={ROUTES.CONTACT_US} className="text-blue-600 hover:underline font-medium">
                Contact Us
              </Link>
            </p>
          </div>

          {/* QR Image Card */}
          <div className="col-span-1 md:col-span-6 lg:col-span-3 flex flex-col items-center justify-center text-center">
            <h2 className="block md:hidden text-4xl text-center lg:text-start font-semibold text-gray-800 mb-3 md:mb-5">Verify Tickets</h2>
            <p className="text-gray-700 text-left text-lg list-decimal list-inside space-y-2 my-3 block md:hidden">
                Click on scan to verify user’s tickets.
                Need support? <Link href={ROUTES.CONTACT_US} className="text-blue-600 hover:underline font-medium">
                Contact Us
              </Link>
            </p>
            <div className='w-full h-full'>
              <QRCodeScanner getScannedQRValues={(values) => verifyTicket(values)} />
            </div>
          </div>
        </div>


      </ChartCard>

      {verifyStatus === "success" &&
        <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {isSuccess ? (
                  <CheckCircleIcon className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircleIcon className="h-16 w-16 text-red-500" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isSuccess ? 'Ticket Verified Successfully!' : 'Verification failed'}
              </h1>
              <p className="text-gray-600 mb-6">
                {isSuccess
                  ? 'Your ticket has been successfully verified. Thank you for choosing us— Enjoy the event!'
                  : 'Something went wrong, Please Try again after sometime.'}
              </p>
            </div>

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

            <div className="text-center">
              <button
                onClick={() => setVerifyStatus("pending")}
                className={`w-full py-3 px-4 rounded-md font-medium ${isSuccess
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                  }`}
              >
                {isSuccess ? 'Complete' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default VerifyTicketPage