import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import TicketBookingModal from './TicketBookingModal'
import { areAllTicketsBooked } from '@/app/events/event-helper';
import { EventTicket } from '@/app/events/types';
interface BookingButtonProps {
  tickets:EventTicket[];
  eventTitle: string;
  status:boolean;
}
const BookingButton: React.FC<BookingButtonProps> = ({
  tickets,
  eventTitle,
  status
}) => {
  const navigate = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isSoldOut = areAllTicketsBooked(tickets)
  const isLowAvailability = 0
  const handleBookingClick = () => {
    if (!true) {
      alert('Please log in to book this event')
    } else if (!isSoldOut) {
      setIsModalOpen(true)
    }
  }
  const handlePaymentSuccess = (ticketDetails: {
    type: string
    quantity: number
    totalPrice: number
  }) => {
    navigate.push('/payment-success')
  }
  if (isSoldOut) {
    return (
      <button
        disabled
        className="w-32 py-3 px-4 bg-gray-300 text-gray-500 font-medium rounded-md cursor-not-allowed"
      >
        Sold Out
      </button>
    )
  }
  return (
    <>
      <button
        disabled={status}
        onClick={handleBookingClick}
        className={`w-32 py-3 px-4 font-medium rounded-md transition-colors ${status ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'}`}
      >
        {status ? "Event Ended":"Book Tickets"}
      </button>
      <TicketBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        eventTitle={eventTitle}
        tickets={tickets}
      />
    </>
  )
}
export default BookingButton
