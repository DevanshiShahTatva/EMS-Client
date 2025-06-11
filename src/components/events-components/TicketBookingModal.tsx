'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus as PlusIcon,
  Minus as MinusIcon,
  CircleCheckIcon
} from 'lucide-react'
import { EventTicket } from "@/app/events/types";
import { getTicketStatus } from '@/app/events/event-helper';
import CommonModalLayout from '@/components/common/CommonModalLayout';
import CheckoutModal from '@/components/common/CheckoutModal';
import SeatBookingModal from '../common/seat/SeatBookingModal';

interface TicketBookingModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  tickets: EventTicket[]
  points: number;
  conversionRate: number;
  eventId: string;
}

const getAvailableSeats = (total: number, booked: number) => total - booked

const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  tickets,
  points,
  conversionRate,
  eventId
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(0)
  const [openTicket, setOpenTicket] = useState<string | null>(null);
  const [openSeatBookingModal, setSeatBookingModal] = useState<boolean>(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState<boolean>(false); // New state for checkout modal

  const selectedTicketType = tickets.find((t) => t.type?._id === selectedType)
  const totalPrice = selectedTicketType
    ? selectedTicketType.price * quantity
    : 0

  if (!isOpen) return null

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

  const handleProceedToConfirmSeats = () => {
    setSeatBookingModal(true);
  };

  const handleOpenCheckoutModal = () => {
    setOpenCheckoutModal(true);
  };

  const renderDynamicTickets = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const available = getAvailableSeats(ticket.totalSeats, ticket.totalBookedSeats);
            const isOpen = openTicket === ticket.type?._id;
            const isSelected = selectedType === ticket.type?._id;
            const { status, color } = getTicketStatus(ticket);
            return (
              <div
                key={ticket.type?._id}
                className={`rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                  }`}>
                {/* Accordion Header */}
                <div
                  className={`flex justify-between items-start px-4 py-3 cursor-pointer transition-colors ${isOpen ? "bg-white" : "hover:bg-gray-50"
                    }`}
                  onClick={() => setOpenTicket((prev) => (prev === ticket.type?._id ? null : ticket.type?._id))}>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{ticket.type.name}</h4>
                    <p className="text-xs text-gray-500">{ticket.description}</p>
                  </div>
                  <div className="flex flex-col items-end text-sm gap-1">
                    <span className="font-semibold text-gray-800">₹{ticket.price}</span>
                    <span className="text-xs text-gray-500">
                      {available} seat{available !== 1 ? "s" : ""} left
                    </span>
                    <span
                      className={`inline-block text-[11px] px-3 py-1 rounded-md font-medium tracking-wide shadow-sm transition-colors duration-300 ${color}`}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Accordion Body */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40 opacity-100 py-3 px-4 bg-blue-50" : "max-h-0 opacity-0 px-4 bg-white"
                    }`}>
                  {isSelected && quantity > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          disabled={quantity <= 0}>
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          disabled={quantity >= available}>
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {quantity === available && (
                        <p className="text-xs text-gray-400">Maximum available seats selected.</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTicketSelect(ticket.type?._id)}
                      disabled={available === 0}
                      className={`px-4 py-1.5 text-sm font-medium rounded border w-fit ${available === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}>
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <CommonModalLayout
        modalTitle={`Booking ${eventTitle}`}
        footerActions={[
          {
            label: "Cancel",
            onClick: onClose,
            variant: "outlined",
          },
          {
            label: "Select Seat",
            onClick: handleProceedToConfirmSeats,
            variant: "primary",
            disabled: (!selectedType || quantity === 0)
          },
        ]}
        onClose={onClose}
      >
        <div className='pt-6'>
          {renderDynamicTickets()}
          
          {/* <div className="flex justify-between items-center mt-6 mb-5">
            <span className="text-gray-900 font-medium">Total Amount</span>
            <span className="text-xl font-semibold text-gray-900">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div> */}
        </div>
      </CommonModalLayout>
      
      {openSeatBookingModal && (
        <SeatBookingModal
          onClose={() => setSeatBookingModal(false)}
          onConfirmSeat={() => handleOpenCheckoutModal()}
          eventId={eventId}
          ticketType={selectedType}
          selectedQty={quantity}
        />
      )}
      
      {openCheckoutModal && selectedTicketType && (
        <CheckoutModal
          isOpen={openCheckoutModal}
          onClose={() => setOpenCheckoutModal(false)}
          eventTitle={eventTitle}
          ticket={{
            type: selectedTicketType.type,
            price: selectedTicketType.price,
            quantity,
            id: selectedTicketType._id
          }}
          points={points}
          conversionRate={conversionRate}
        />
      )}
    </>
  )
}

export default TicketBookingModal