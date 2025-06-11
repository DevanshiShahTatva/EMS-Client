'use client'

import React, { useState } from 'react';
import { CircleCheckIcon } from 'lucide-react';
import CommonModalLayout from '@/components/common/CommonModalLayout';
import { apiCall } from '@/utils/services/request';
import axios from 'axios';
import CoinRedeemCard from '../events-components/CoinReedem';
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  ticket: {
    type: any;
    price: number;
    quantity: number;
    id: string;
  };
  points: number;
  conversionRate: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  ticket,
  points,
  conversionRate
}) => {
  const [usedPoints, setUsedPoints] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [voucherId, setVoucherId] = useState<string | null>(null);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [promoCodeMessage, setPromoCodeMessage] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<'coins' | 'promo' | null>(null);

  const totalPrice = ticket.price * ticket.quantity;
  const discount = promoCodeDiscount > 0 ? promoCodeDiscount : Math.round((usedPoints / conversionRate) * 100);
  const finalAmount = Math.max(totalPrice * 100 - discount, 0);

  const handlePayment = async () => {
    try {
      const res = await axios.post('/api/create-payment-intent', {
        eventTitle,
        tickets: {
          quantity: ticket.quantity,
          discount,
          usedPoints,
          finalAmount,
          conversionRate,
          type: ticket.type,
          ticketId: ticket.id,
          totalPrice: ticket.price,
        },
      });
      sessionStorage.setItem("tickets", JSON.stringify({
        type: ticket.type,
        quantity: ticket.quantity,
        totalPrice: finalAmount / 100,
        ticketId: ticket.id,
        voucherId,
        usedPoints,
        discount: discount / 100
      }));
      sessionStorage.setItem("eventTitle", eventTitle);
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Error initiating payment:', err);
    }
  };

  const updatePoints = (points: number) => {
    setUsedPoints(points);
    setPromoCodeDiscount(0);
    setVoucherId(null);
  };

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

  const renderPromoCodeUI = () => {
    return (
      <div className="space-y-2 mt-4">
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

  const renderToggle = () => (
    <div className="flex space-x-4 items-center mt-4">
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

  if (!isOpen) return null;

  return (
    <CommonModalLayout
      modalTitle="Checkout"
      footerActions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
        },
        {
          label: `Pay ₹${(finalAmount / 100).toFixed(2)}`,
          onClick: handlePayment,
          variant: "primary",
        },
      ]}
      onClose={onClose}
    >
      <div className="p-4">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold">{eventTitle}</h3>
          <div className="mt-2">
            <p className="text-gray-700">
              {ticket.type.name} × {ticket.quantity}
            </p>
            <p className="text-gray-500 text-sm">
              ₹{ticket.price.toFixed(2)} per ticket
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          {renderToggle()}

          {activeMethod === 'coins' && points > 0 && (
            <div className="mt-4">
              <CoinRedeemCard
                totalUserCoins={points}
                totalAmount={totalPrice}
                conversionRate={conversionRate}
                setUsedPoints={updatePoints}
              />
            </div>
          )}

          {activeMethod === 'promo' && renderPromoCodeUI()}

          {(usedPoints || promoCodeDiscount) > 0 && (
            <div className="mt-4 flex justify-between text-green-600">
              <span>Discount:</span>
              <span>- ₹{usedPoints > 0 ? (usedPoints / conversionRate).toFixed(2) : promoCodeDiscount}</span>
            </div>
          )}

          <div className="mt-6 pt-4 border-t flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>₹{(finalAmount / 100).toFixed(2)}</span>
          </div>

          <div className="mt-4 mb-6 rounded-md border border-red-300 bg-red-50 p-4 shadow-md flex items-start space-x-3">
            <InformationCircleIcon
              color="oklch(44.4% .177 26.899)"
              className="size-8"
            />
            <div className="text-sm text-red-800">
              <span className="font-medium">Cancellation Policy:</span> A{" "}
              <span className="font-semibold">10%</span> cancellation fee
              applies to this ticket. This charge will be deducted if you cancel
              your booking.
            </div>
          </div>
        </div>
      </div>
    </CommonModalLayout>
  );
};

export default CheckoutModal;