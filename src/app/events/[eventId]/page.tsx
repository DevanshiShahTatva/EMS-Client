import React from 'react'

// Next Support 
import { NextPage } from 'next';

// Custom components
import EventDetails from '@/components/events-components/EventDetails'

// types 
import { IEventDetailPageProps } from '../types';

const EventDetailsPage:NextPage<IEventDetailPageProps>  = async ({ params }) => {
  const eventId = (await params).eventId;
  return (
    <EventDetails eventId={eventId}/>
  )
}

export default EventDetailsPage

