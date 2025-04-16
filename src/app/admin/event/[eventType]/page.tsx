import React from 'react'
import { NextPage } from 'next';

// custom compoents
import EventForm from '../../../../components/admin-components/EventForm'

// types 
import { IEventPageProps } from '../types';



const EventPage : NextPage<IEventPageProps> = async ( { params }) => {
  const eventMode = (await params).eventType;
  return (
    <div>
      <EventForm eventType={eventMode} />
    </div>
  )
}

export default EventPage