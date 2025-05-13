"use client"

import React, { useState } from 'react'

// Custom Components
import QRCodeScanner from '@/components/organizer-components/QRCodeScanner'
import Loader from '@/components/common/Loader'

// Library
import { toast } from 'react-toastify'

// Service
import { apiCall } from '@/utils/services/request'

// Conststans
import { API_ROUTES } from '@/utils/constant'

// Icons
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'

// types
import { ITicketQRData } from '@/utils/types'
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import TitleSection from '@/components/common/TitleSection'

const VerifyTicketPage = () => {

  const [loading, setLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<"verified" | "pending" | "failed">("pending")
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
      }
    } catch (err) {
      console.error('Error in validating', err);
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = true


  return (
    <div className='p-8'>
      { loading && <Loader />}

<QRCodeScanner getScannedQRValues={(id) => verifyTicket(id)} />
      <ChartCard>

        <TitleSection title='Scan QR Tickets' />

        {/* {verifyStatus === "pending" && <QRCodeScanner getScannedQRValues={(id) => verifyTicket(id)} />} */}

        {/* <div className=" bg-gray-50 flex items-center justify-center p-4">
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
                {isSuccess ? 'Your Ticket Has Been Verified!' : 'Verification failed'}
              </h1>
              <p className="text-gray-600 mb-6">
                {isSuccess
                  ? 'Your ticket has been successfully verified. Thank you for choosing us— Enjoy the event!'
                  : 'Unfortunately, your payment could not be processed. Please try again or contact support.'}
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
                className={`w-full py-3 px-4 rounded-md font-medium ${isSuccess
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                  }`}
              >
                {isSuccess ? 'Back' : 'Try Again / View Events'}
              </button>
            </div>
          </div>
        </div> */}


      </ChartCard>
        
    </div>
  )
}

export default VerifyTicketPage