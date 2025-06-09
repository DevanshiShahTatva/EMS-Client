import React, { useState } from 'react'
import TicketBookingModal from './TicketBookingModal'
import { areAllTicketsBooked } from '@/app/events/event-helper';
import { EventTicket } from '@/app/events/types';
import CustomButton from '../common/CustomButton';
import { getAuthToken } from '@/utils/helper';
import { ROUTES } from '@/utils/constant';
import { useRouter } from 'next/navigation';
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isSoldOut = areAllTicketsBooked(tickets)
  const router = useRouter()

  const handleBookingClick = () => {

    // Check for login 
    const isUserLogged = getAuthToken()
    if (isUserLogged === "") {
      return router.push(ROUTES.LOGIN)
    }

    if (!isSoldOut) {
      setIsModalOpen(true)
    }
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
        eventTitle={eventTitle}
        tickets={tickets}
      />
    </>
  )
}
export default BookingButton
