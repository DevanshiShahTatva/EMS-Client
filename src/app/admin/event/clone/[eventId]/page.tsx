import React from 'react'
import { NextPage } from 'next';

// custom compoents
import EventForm from '../../../../../components/admin-components/EventForm'

// types 
import { IEventClonePageProps } from '../../types';



const EventPage : NextPage<IEventClonePageProps> = async ( { params }) => {
  const eventMode = (await params).eventId;
  return (
    <div>
      <EventForm isCloneEvent eventType={eventMode} />
    </div>
  )
}

export default EventPage