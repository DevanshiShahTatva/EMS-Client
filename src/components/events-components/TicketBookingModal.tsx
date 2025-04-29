'use client'

import React, { useState } from 'react'
import {
  X as CloseIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
} from 'lucide-react'
import { EventTicket } from "@/app/events/types";
import axios from 'axios'
import { getTicketStatus } from '@/app/events/event-helper';

interface TicketBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (ticketDetails: {
    type: string
    quantity: number
    totalPrice: number
  }) => void
  eventTitle: string
  tickets: EventTicket[]
}

const getAvailableSeats = (total: number, booked: number) => total - booked

const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  eventTitle,
  tickets,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(0)

  if (!isOpen) return null

  const selectedTicketType = tickets.find((t) => t.type === selectedType)
  const totalPrice = selectedTicketType
    ? selectedTicketType.price * quantity
    : 0

  const handleTicketSelect = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null)
      setQuantity(0)
    } else {
      setSelectedType(type)
      setQuantity(1)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (
      newQuantity >= 0 &&
      selectedTicketType &&
      newQuantity <=
        getAvailableSeats(
          selectedTicketType.totalSeats,
          selectedTicketType.totalBookedSeats
        )
    ) {
      setQuantity(newQuantity)
    }
  }
  const handleProceedToPayment = async () => {
    try {
      const res = await axios.post('/api/create-payment-intent', {
        tickets: {
          type: selectedType,
          quantity,
          totalPrice,
          ticketId:selectedTicketType?._id
        },
        eventTitle,
      })
      sessionStorage.setItem("tickets",JSON.stringify({type:selectedType,quantity:quantity,totalPrice:totalPrice,ticketId:selectedTicketType?._id}));
      sessionStorage.setItem("eventTitle",eventTitle);
      window.location.href = res.data.url
    } catch (err) {
      console.error('Error initiating payment:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-999 overflow-y-auto no-scrollbar">
  <div className="bg-white rounded-lg w-full max-w-lg max-h-full overflow-y-auto no-scrollbar">
    <div className="flex justify-between items-center p-6 border-b">
      <h2 className="text-xl font-semibold text-gray-900">Book Tickets</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500"
        aria-label="Close"
      >
        <CloseIcon className="h-6 w-6" />
      </button>
    </div>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {eventTitle}
          </h3>
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const available = getAvailableSeats(
                ticket.totalSeats,
                ticket.totalBookedSeats
              )
              const isSelected = selectedType === ticket.type
              const { status,color } = getTicketStatus(ticket);
              return (
                <div
                  key={ticket.type}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {ticket.type}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {ticket.description}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${ticket.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {isSelected ? (
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            disabled={quantity <= 0}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            disabled={quantity >= available}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        {quantity === available && (
                          <p className="text-xs text-gray-400">
                            Maximum available seats selected.
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTicketSelect(ticket.type)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          available === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        disabled={available === 0}
                      >
                        Add
                      </button>
                    )}
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span>
                        Status: <span style={{ color }}>{status}</span>
                      </span>
                      <span>
                        {available} seat{available !== 1 ? 's' : ''} left
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-900 font-medium">Total Amount:</span>
              <span className="text-xl font-semibold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <form action={handleProceedToPayment} className="max-w-md mx-auto">
            <input type="hidden" name="ticket" value={JSON.stringify({type:selectedTicketType?.type,totalPrice:totalPrice,quantity:quantity,ticketId:selectedTicketType?._id})}/>
            <input type="hidden" name="eventTitle" value={eventTitle}/>
            <button
              type="submit"
              disabled={!selectedType || quantity === 0}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                selectedType && quantity > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Proceed to Payment
            </button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketBookingModal
