'use client'

import React, { useState } from 'react'
import {
  Plus as PlusIcon,
  Minus as MinusIcon,
  CircleCheckIcon
} from 'lucide-react'
import { EventTicket } from "@/app/events/types";
import axios from 'axios'
import { getTicketStatus } from '@/app/events/event-helper';
import CommonModalLayout from '@/components/common/CommonModalLayout';
import CoinRedeemCard from './CoinReedem';
import { apiCall } from '@/utils/services/request';

interface TicketBookingModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  tickets: EventTicket[]
  points: number;
  conversionRate: number;
}

const getAvailableSeats = (total: number, booked: number) => total - booked

const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  tickets,
  points,
  conversionRate
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(0)
  const [usedPoints, setUsedPoints] = useState(0);
  const [openTicket, setOpenTicket] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [voucherId, setVoucherId] = useState<string | null>(null);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [promoCodeMessage, setPromoCodeMessage] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<'coins' | 'promo' | null>(null);

  if (!isOpen) return null

  const selectedTicketType = tickets.find((t) => t.type?._id === selectedType)
  const totalPrice = selectedTicketType
    ? selectedTicketType.price * quantity
    : 0
  const discount = promoCodeDiscount > 0 ? promoCodeDiscount * 100 : Math.round((usedPoints / conversionRate) * 100);
  const finalAmount = Math.max(totalPrice * 100 - discount, 0);

  const handleTicketSelect = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null)
      setQuantity(0)
    } else {
      setSelectedType(type)
      setQuantity(1)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (
      newQuantity >= 0 &&
      selectedTicketType &&
      newQuantity <=
      getAvailableSeats(
        selectedTicketType.totalSeats,
        selectedTicketType.totalBookedSeats
      )
    ) {
      setQuantity(newQuantity)
    }
  }

  const handleProceedToPayment = async () => {
    try {
      const res = await axios.post('/api/create-payment-intent', {
        eventTitle,
        tickets: {
          quantity,
          discount,
          usedPoints,
          finalAmount,
          conversionRate,
          type: selectedTicketType?.type,
          ticketId: selectedTicketType?._id,
          totalPrice: selectedTicketType?.price,
        },
      })
      sessionStorage.setItem("tickets", JSON.stringify({ type: selectedTicketType?.type, quantity: quantity, totalPrice: finalAmount / 100, ticketId: selectedTicketType?._id, voucherId, usedPoints, discount: discount / 100 }));
      sessionStorage.setItem("eventTitle", eventTitle);
      window.location.href = res.data.url
    } catch (err) {
      console.error('Error initiating payment:', err)
    }
  }

  const updatePoints = (points: number) => {
    setUsedPoints(points);
    setPromoCodeDiscount(0);
    setVoucherId(null);
  }

  const handleRemove = () => {
    setVoucherId(null);
    setPromoCode('');
    setPromoCodeDiscount(0);
    setPromoCodeMessage(null);
  };

  const appliedPromoCode = async () => {
    if (promoCode.trim()) {
      try {
        const res = await apiCall({
          method: "POST",
          endPoint: '/voucher/validate-promocode',
          body: {
            promoCode: promoCode.trim(),
            amount: (finalAmount / 100).toFixed(2)
          }
        });
        if (res.success) {
          setVoucherId(res.voucherId);
          setPromoCodeDiscount(res.discount);
          setPromoCodeMessage(res.message);
        } else {
          setVoucherId("");
          setPromoCodeDiscount(0);
          setPromoCodeMessage(res.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const renderDynamicTickets = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const available = getAvailableSeats(ticket.totalSeats, ticket.totalBookedSeats);
            const isOpen = openTicket === ticket.type?._id;
            const isSelected = selectedType === ticket.type?._id;
            const { status, color } = getTicketStatus(ticket);
            return (
              <div
                key={ticket.type?._id}
                className={`rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                  }`}>
                {/* Accordion Header */}
                <div
                  className={`flex justify-between items-start px-4 py-3 cursor-pointer transition-colors ${isOpen ? "bg-white" : "hover:bg-gray-50"
                    }`}
                  onClick={() => setOpenTicket((prev) => (prev === ticket.type?._id ? null : ticket.type?._id))}>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{ticket.type.name}</h4>
                    <p className="text-xs text-gray-500">{ticket.description}</p>
                  </div>
                  <div className="flex flex-col items-end text-sm gap-1">
                    <span className="font-semibold text-gray-800">₹{ticket.price}</span>
                    <span className="text-xs text-gray-500">
                      {available} seat{available !== 1 ? "s" : ""} left
                    </span>
                    <span
                      className={`inline-block text-[11px] px-3 py-1 rounded-md font-medium tracking-wide shadow-sm transition-colors duration-300 ${color}`}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Accordion Body */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40 opacity-100 py-3 px-4 bg-blue-50" : "max-h-0 opacity-0 px-4 bg-white"
                    }`}>
                  {isSelected && quantity > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          disabled={quantity <= 0}>
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          disabled={quantity >= available}>
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {quantity === available && (
                        <p className="text-xs text-gray-400">Maximum available seats selected.</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTicketSelect(ticket.type?._id)}
                      disabled={available === 0}
                      className={`px-4 py-1.5 text-sm font-medium rounded border w-fit ${available === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}>
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPromoCodeUI = () => {
    return (
      <div className="space-y-2">
        <div className="block text-sm font-medium text-gray-700">
          Promo code
        </div>
        {!voucherId ? (
          <div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={appliedPromoCode}
                className="px-4 py-2 cursor-pointer bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Apply
              </button>
            </div>
            <div>
              {promoCodeMessage && (
                <p className="text-sm text-red-600 mt-2">*{promoCodeMessage}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between border-2 border-green-700 rounded-md p-3 bg-white">
            <div className="flex items-start space-x-2">
              <CircleCheckIcon color='green' />
              <div>
                <p className="font-bold text-sm">{promoCode}</p>
                <p className="text-sm text-gray-600">{promoCodeMessage}</p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-purple-600 cursor-pointer font-medium hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  };

  const selectCoinMethod = () => {
    if (activeMethod === 'coins') {
      setUsedPoints(0);
      setActiveMethod(null);
      return;
    }
    setActiveMethod('coins');
    handleRemove();
  };

  const selectPromoMethod = () => {
    if (activeMethod === 'promo') {
      setActiveMethod(null);
      handleRemove();
      return;
    }
    setUsedPoints(0);
    setActiveMethod('promo');
  };

  const renderToggle = () => (
    <div className="flex space-x-4 items-center">
      {points > 0 && (
        <button
          onClick={() => selectCoinMethod()}
          className={`px-3 py-1 text-sm rounded-md cursor-pointer ${activeMethod === 'coins' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Redeem Coins
        </button>
      )}
      <button
        onClick={() => selectPromoMethod()}
        className={`px-3 py-1 text-sm rounded-md cursor-pointer ${activeMethod === 'promo' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
      >
        Use Promo Code
      </button>
    </div>
  );

  return (
    <CommonModalLayout
      modalTitle={`Booking ${eventTitle}`}
      footerActions={[
        {
          label: `Pay ₹${(finalAmount / 100).toFixed(2)}`,
          type: "submit",
          variant: "primary",
          onClick: () => { handleProceedToPayment() },
          disabled: (!selectedType || quantity === 0)
        }
      ]}
      onClose={onClose}
    >
      <div className='pt-6'>
        {renderDynamicTickets()}
        {totalPrice > 0 && (
          <div className='mt-6'>
            {renderToggle()}
          </div>
        )}
        <div className="mt-3">
          {totalPrice > 0 && (
          <div>
            {activeMethod === 'coins' && (
              <div>
                {points > 0 && (
                  <div className='mt-6'>
                    <CoinRedeemCard
                      totalUserCoins={points}
                      totalAmount={totalPrice}
                      conversionRate={conversionRate}
                      setUsedPoints={updatePoints}
                    />
                  </div>
                )}
              </div>
            )}
            {activeMethod === 'promo' && (
              <div className='pt-5'>
                {renderPromoCodeUI()}
              </div>
            )}
          </div>
          )}
          <div className="flex justify-between items-center mt-6 mb-5">
            <span className="text-gray-900 font-medium">Total Amount</span>
            <span className="text-xl font-semibold text-gray-900">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>
          {(usedPoints || promoCodeDiscount) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Total Discount</span>
              <span className="text-xl font-semibold text-gray-900">
                - ₹{usedPoints > 0 ? (usedPoints / conversionRate).toFixed(2) : promoCodeDiscount}
              </span>
            </div>
          )}
          <form action={handleProceedToPayment} className="max-w-md mx-auto mt-5">
            <input type="hidden" name="ticket" value={JSON.stringify({ type: selectedTicketType?.type, totalPrice: selectedTicketType?.price, quantity: quantity, ticketId: selectedTicketType?._id })} />
            <input type="hidden" name="eventTitle" value={eventTitle} />
          </form>
        </div>
      </div>
    </CommonModalLayout>
  )
}

export default TicketBookingModal
