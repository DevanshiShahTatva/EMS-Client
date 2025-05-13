"use client";
import React from 'react';
import moment from 'moment';
import { usePDF } from "react-to-pdf";
import { QRCodeCanvas } from "qrcode.react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { IBooking } from '@/app/user/my-events/types';

interface ITicketProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: IBooking | null;
}

const DownloadTicketModal: React.FC<ITicketProps> = ({ eventData, isOpen, onClose }) => {

  if (!isOpen) return null;

  if (eventData === null) return null

  const ticketData = {
    id:  eventData._id,
    eventName: eventData.event.title || "",
    eventTicketCount: eventData.seats,
    eventTicketPrice: eventData.totalAmount,
  };

  const { toPDF, targetRef } = usePDF({
    filename: `${eventData.event.title}-${new Date().getTime()}-ticket.pdf`,
  });

  const downloadTicket = () => {
    toPDF();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm relative w-[300px] md:w-full">
        <div className='absolute top-4 right-3'>
          <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
        </div>
        <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-center text-lg font-semibold">Overview</h2>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md py-4 space-y-4 flex flex-col justify-center border" ref={targetRef}>
              <div className="flex flex-col gap-1 px-6 text-sm space-y-1  text-center">
                <div><span className='text-black font-bold text-[22px]'>{eventData.event.title}</span></div>
                <div><span className='text-black font-bold'>{eventData.event.location.address}</span></div>
                <div><span className='text-black font-bold'>{moment(eventData.event.startDateTime).local().format("DD MMM YYYY")} - {moment(eventData.event.endDateTime).local().format("DD MMM YYYY")}</span></div>
                <div><span className='text-black font-bold'>{moment(eventData.event.startDateTime).local().format('hh:mm A')} - {moment(eventData.event.endDateTime).local().format('hh:mm A')}</span></div>
                <div><span className='text-black font-bold'>Rs. ₹{eventData.totalAmount}</span></div>
              </div>
              <div className="relative my-4">
                <div className="absolute left-[-21px] top-1/2 -translate-y-1/2 w-10 h-[40px] bg-[#685757] rounded-full shadow-md"></div>
                <div className="absolute right-[-21px] top-1/2 -translate-y-1/2 w-10 h-[40px] bg-[#685757] rounded-full shadow-md"></div>
                <div className="border-t-[1.5px] border-dashed mx-4"></div>
              </div>
              <div className="px-6 flex flex-col items-center space-y-2">
                <QRCodeCanvas
                  value={JSON.stringify(ticketData)}
                  size={150}
                />
                <div className="text-sm">Ticket ID <span className="font-medium">{Math.floor(100000 + Math.random() * 900000)}</span></div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <button onClick={() => downloadTicket()} className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 rounded-xl font-medium cursor-pointer">
              Download ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadTicketModal;