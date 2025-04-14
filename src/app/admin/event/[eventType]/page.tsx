import React from 'react'
import EventForm from './EventForm'
import { NextPage } from 'next';

interface EventPageProps { 
  params: { eventType: string };
}

const EventPage : NextPage<EventPageProps> = async ( { params }) => {
  const eventMode = (await params).eventType;
  return (
    <div>
      <EventForm eventType={eventMode} />
    </div>
  )
}

export default EventPage