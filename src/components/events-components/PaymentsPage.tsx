'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiCall } from '@/utils/services/request'
import { API_ROUTES } from '@/utils/constant'
import { CheckoutTicket } from '@/app/events/types'
import { SelectSeat } from '@/utils/types'

const PaymentResultPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [ticketDetails, setTicketDetails] = useState<CheckoutTicket | null>(null)
  const [eventTitle, setEventTitle] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  useEffect(() => {
    const storedTickets = sessionStorage.getItem('tickets')
    const storedEventTitle = sessionStorage.getItem('eventTitle')
    const storedEventId = sessionStorage.getItem('eventId')
    const selectedSeats = sessionStorage.getItem('selectedSeats')
    const paymentId = searchParams.get('session_id')
    if (!storedTickets || !storedEventTitle || !storedEventId || !paymentId || !selectedSeats) {
      setIsSuccess(false)
      return
    }

    try {
      const parsedTickets: CheckoutTicket = JSON.parse(storedTickets);
      setTicketDetails(parsedTickets)
      setEventTitle(storedEventTitle)

      const creationDate = new Date().toString().split(' (')[0]

      const formData = new FormData()
      formData.append('eventId', storedEventId)
      formData.append('ticketId', parsedTickets.ticketId)
      formData.append('seats', parsedTickets.quantity.toString())
      formData.append('totalAmount', parsedTickets.totalPrice.toString())
      formData.append('paymentId', paymentId)
      formData.append('bookingDate', creationDate)
      formData.append('selectedSeats', selectedSeats)
      parsedTickets.voucherId && formData.append('voucherId', parsedTickets.voucherId);
      parsedTickets?.usedPoints > 0 && formData.append('usedPoints', parsedTickets.usedPoints.toString())
      parsedTickets?.discount > 0 && formData.append('discount', parsedTickets.discount.toString())
      apiCall({
        endPoint: API_ROUTES.EVENT.PAYMENT,
        method: 'POST',
        body: formData,
        isFormData: true,
      }).then(res => {
        if (res.success) {
          setIsSuccess(true)
        } else {
          setIsSuccess(false)
      }  }).catch(() => {
        setIsSuccess(false)
      })

      sessionStorage.removeItem('tickets')
      sessionStorage.removeItem('eventTitle')
      sessionStorage.removeItem('eventId')
    } catch (err) {
      console.error('Error parsing session data:', err)
      setIsSuccess(false)
    }
    }, [searchParams])
  if (isSuccess === null || !ticketDetails) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isSuccess
              ? 'Thank you for your purchase. Your tickets have been confirmed.'
              : 'Unfortunately, your payment could not be processed. Please try again or contact support.'}
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 my-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Event</span>
              <span className="font-medium text-gray-900">{eventTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ticket Type</span>
              <span className="font-medium text-gray-900">{ticketDetails.type.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium text-gray-900">
                {ticketDetails.quantity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-medium text-gray-900">
              ₹{ticketDetails.totalPrice.toFixed(2)}
              </span>
            </div>
            {ticketDetails.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Total Discount</span>
                <span className="font-medium text-gray-900">
                ₹{ticketDetails.discount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            {isSuccess
              ? 'A confirmation email has been sent to your registered email address.'
              : 'If you were charged, your money will be refunded automatically.'}
          </p>
          <button
            onClick={() => router.push('/events')}
            className={`w-full py-3 px-4 rounded-md font-medium ${
              isSuccess
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer' 
            }`}
          >
            {isSuccess ? 'Back to Events' : 'Try Again / View Events'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentResultPage
