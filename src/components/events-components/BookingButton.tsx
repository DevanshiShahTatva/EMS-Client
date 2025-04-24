import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import TicketBookingModal from './TicketBookingModal'
import { areAllTicketsBooked } from '@/app/events/event-helper';
import { EventTicket } from '@/types/events';
interface BookingButtonProps {
  tickets:EventTicket[];
  eventTitle: string;
}
const BookingButton: React.FC<BookingButtonProps> = ({
  tickets,
  eventTitle,
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
        className="w-full py-3 px-4 bg-gray-300 text-gray-500 font-medium rounded-md cursor-not-allowed"
      >
        Sold Out
      </button>
    )
  }
  return (
    <>
      <button
        onClick={handleBookingClick}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
      >
        Book Tickets
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
