'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircleIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiCall } from '@/utils/services/request'
import { API_ROUTES } from '@/utils/constant'
import { CheckoutTicket } from '@/types/events'

const PaymentSuccessPage = () => {
  const router = useRouter()

  const [ticketDetails, setTicketDetails] = useState<CheckoutTicket | null>(null)
    const [eventTitle, setEventTitle] = useState<string>('')
    const [hasSubmitted, setHasSubmitted] = useState(false)
   const searchParams = useSearchParams();
    useEffect(() => {
      const storedTickets = sessionStorage.getItem('tickets')
      const storedEventTitle = sessionStorage.getItem('eventTitle')
      const storedEventId = sessionStorage.getItem('eventId')
  
      const paymentId = searchParams.get('session_id')
  
      if (!storedTickets || !storedEventTitle || !storedEventId || !paymentId) {
        router.push('/events')
        return
      }
  
      try {
        const parsedTickets: CheckoutTicket = JSON.parse(storedTickets)
        setTicketDetails(parsedTickets)
        setEventTitle(storedEventTitle)
  
        const creationDate = new Date().toString().split(' (')[0]
  
        if (!hasSubmitted) {
          const formData = new FormData()
          formData.append('eventId', storedEventId)
          formData.append('ticketId', parsedTickets.ticketId)
          formData.append('seats', parsedTickets.quantity.toString())
          formData.append('totalAmount', parsedTickets.totalPrice.toString())
          formData.append('paymentId', paymentId)
          formData.append('bookingDate', creationDate)
  
          apiCall({
            endPoint: API_ROUTES.EVENT.PAYMENT,
            method: 'POST',
            body: formData,
            isFormData: true,
            headers: {
              'Content-Type':'application/json'
            },
          }).then(() => {
            setHasSubmitted(true)
          })
        }
  
        sessionStorage.removeItem('tickets')
        sessionStorage.removeItem('eventTitle')
        sessionStorage.removeItem('eventId')
      } catch (err) {
        console.error('Error parsing session data:', err)
        router.push('/')
      }
    }, [router, searchParams, hasSubmitted])
  
  if (!ticketDetails) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your tickets have been confirmed.
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
              <span className="font-medium text-gray-900">{ticketDetails.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium text-gray-900">
                {ticketDetails.quantity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium text-gray-900">
                ${ticketDetails.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            A confirmation email has been sent to your registered email address.
          </p>
          <button
            onClick={() => router.push('/events')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
