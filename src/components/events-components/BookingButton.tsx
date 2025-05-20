import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import TicketBookingModal from './TicketBookingModal'
import { areAllTicketsBooked } from '@/app/events/event-helper';
import { EventTicket } from '@/app/events/types';
import CustomButton from '../common/CustomButton';
interface BookingButtonProps {
  tickets:EventTicket[];
  eventTitle: string;
  status:boolean;
  points: number;
  conversionRate: number;
}
const BookingButton: React.FC<BookingButtonProps> = ({
  tickets,
  eventTitle,
  status,
  points,
  conversionRate
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
      <CustomButton
        disabled
        variant='disabled'
        className="w-32 py-3 px-4 font-medium"
      >
        Sold Out
      </CustomButton>
    )
  }
  return (
    <>
      {status ?
        <CustomButton
          variant='disabled'
          disabled
          className='w-32 py-3 px-4 font-medium'
        >
          Event Ended
        </CustomButton>
        :
        <CustomButton
          variant='primary'
          className='w-32 py-3 px-4 font-medium'
          onClick={handleBookingClick}
        >
          Book Tickets
        </CustomButton>
      }
      <TicketBookingModal
        isOpen={isModalOpen}
        points={points}
        conversionRate={conversionRate}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        eventTitle={eventTitle}
        tickets={tickets}
      />
    </>
  )
}
export default BookingButton
