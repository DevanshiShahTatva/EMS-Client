"use client";
import React from 'react'

// library support
import { usePDF } from "react-to-pdf";
import { QRCodeCanvas } from "qrcode.react";

// Types support
import { IBooking } from '@/app/user/my-events/types'

// Custom css
import "../../app/viewTicket.css"

// Helpers
import { formatDateTime } from '@/app/user/my-events/helper';

// icons
import { XMarkIcon } from "@heroicons/react/24/solid";


interface ITicketProps {
    isOpen: boolean;
  onClose: () => void;
    eventData : IBooking | null
}

const DownloadTicketModal : React.FC<ITicketProps> = ({ eventData, isOpen, onClose }) => {

  if (!isOpen) return null;

  if(eventData === null) return null

    const ticketData = {
        id: "TICKET-123456",
    };

    // Use the usePdf hook
    const { toPDF, targetRef } = usePDF({
        filename: `${eventData.event.title}-${new Date().getTime()}-ticket.pdf`,
    });

    const downoadTicket = () => {
       toPDF()
       onClose()
    }

  return (
    <>

      <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40">
        <div className="bg-white w-full max-w-full sm:max-w-xl rounded-lg shadow-xl relative">

        <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
          <p className="font-bold text-xl">Ticket Details</p>
          <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
        </div>

          
            <div className="ticket-summary-container" ref={targetRef}>
              <h2 className="ticket-summary-title">Ticket Summary</h2>

              <p className='event-name'>Name:  <span className="event-time-text">{eventData.event.title}</span> </p>
              <p className='event-name'>Timing: <span className="event-time-text">{formatDateTime(eventData.event.startDateTime)} - {formatDateTime(eventData.event.endDateTime)}</span> </p>
              <p className='event-name last-child'>Location:  <span className="event-time-text"> {eventData.event.location.address}</span> </p>

              <p className="scan-text">Scan below QR code at entrace of venue: </p>
              <hr />

              <div className='qr-box'>
                <br />
                <QRCodeCanvas
                  value={JSON.stringify(ticketData)}
                  size={150}
                />
              </div>

            </div>

          <div className='text-end border-t-1 border-t-gray-300'>
            <button onClick={() => downoadTicket()} className='px-4 py-2 mr-5 my-5 font-bold bg-blue-500 text-white cursor-pointer rounded-[8px] text-center hover:bg-blue-600'>
              Download Ticket
            </button>
          </div>

        </div>
      </div>
          
    </>
  )
}

export default DownloadTicketModal