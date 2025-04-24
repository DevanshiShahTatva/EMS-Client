import PaymentSuccessPage from '@/components/events-components/PaymentsPage';
import React from 'react'

interface Props {
    params:{
        eventId:string;
    }
}

export default function EventDetailsPage({params}:Props) {
    const { eventId } = params;
  return (
    <PaymentSuccessPage tickets={{
          totalPrice: 0,
          quantity: 0,
          type: ''
      }} eventTitles={''} />
  )
}

