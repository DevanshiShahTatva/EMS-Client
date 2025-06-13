"use client";

import React, { useEffect, useState } from "react";
import { CircleCheckIcon } from "lucide-react";
import CommonModalLayout from "@/components/common/CommonModalLayout";
import { apiCall } from "@/utils/services/request";
import axios from "axios";
import CoinRedeemCard from "../events-components/CoinReedem";
import { SelectSeat } from "@/utils/types";
import { API_ROUTES } from "@/utils/constant";

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
  selectedSeatNumbers: SelectSeat[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  ticket,
  points,
  conversionRate,
  selectedSeatNumbers,
}) => {
  const [usedPoints, setUsedPoints] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [voucherId, setVoucherId] = useState<string | null>(null);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [promoCodeMessage, setPromoCodeMessage] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<"coins" | "promo" | null>(
    null
  );
  const [charge, setCharge] = useState("0");

  const totalPrice = ticket.price * ticket.quantity;
  const discount =
    promoCodeDiscount > 0
      ? promoCodeDiscount
      : Math.round((usedPoints / conversionRate) * 100);
  const finalAmount = Math.max(totalPrice * 100 - discount, 0);

  const handlePayment = async () => {
    try {
      const res = await axios.post("/api/create-payment-intent", {
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
      sessionStorage.setItem(
        "tickets",
        JSON.stringify({
          type: ticket.type,
          quantity: ticket.quantity,
          totalPrice: finalAmount / 100,
          ticketId: ticket.id,
          voucherId,
          usedPoints,
          discount: discount / 100,
        })
      );
      sessionStorage.setItem("eventTitle", eventTitle);
      sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeatNumbers));
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Error initiating payment:", err);
    }
  };

  useEffect(() => {
    fetchChargeInfo();
  }, []);

  const fetchChargeInfo = async () => {
    const res = await apiCall({
      method: "GET",
      endPoint: API_ROUTES.ADMIN.CANCEL_CHARGE,
    });
    if (res.success) {
      setCharge(res.data.charge);
    }
  };

  const updatePoints = (points: number) => {
    setUsedPoints(points);
    setPromoCodeDiscount(0);
    setVoucherId(null);
  };

  const handleRemove = () => {
    setVoucherId(null);
    setPromoCode("");
    setPromoCodeDiscount(0);
    setPromoCodeMessage(null);
  };

  const appliedPromoCode = async () => {
    if (promoCode.trim()) {
      try {
        const res = await apiCall({
          method: "POST",
          endPoint: "/voucher/validate-promocode",
          body: {
            promoCode: promoCode.trim(),
            amount: (finalAmount / 100).toFixed(2),
          },
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
    if (activeMethod === "coins") {
      setUsedPoints(0);
      setActiveMethod(null);
      return;
    }
    setActiveMethod("coins");
    handleRemove();
  };

  const selectPromoMethod = () => {
    if (activeMethod === "promo") {
      setActiveMethod(null);
      handleRemove();
      return;
    }
    setUsedPoints(0);
    setActiveMethod("promo");
  };

  if (!isOpen) return null;

  return (
    <CommonModalLayout
      modalTitle="Complete Your Purchase"
      maxWidth="max-w-2xl"
      footerActions={[
        {
          label: "Cancel Order",
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
      <div className="p-6">
        {/* Event Header with Seats */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{eventTitle}</h3>

            <div className="mt-3 flex flex-wrap gap-3">
              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <p className="text-sm text-gray-600">Ticket Type</p>
                <p className="font-medium text-gray-900">
                  {ticket.type.name} × {ticket.quantity}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium text-gray-900">
                  ₹{ticket.price.toFixed(2)} per ticket
                </p>
              </div>

              {selectedSeatNumbers.length > 0 && (
                <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                  <p className="text-sm text-blue-600">Selected Seats</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSeatNumbers.map((seat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white text-blue-700 text-xs font-medium rounded-md border border-blue-200"
                      >
                        {seat.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discount Options */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Apply Discount
          </h4>

          <div className="flex gap-3">
            {points > 0 && (
              <button
                onClick={() => selectCoinMethod()}
                className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                  activeMethod === "coins"
                    ? "border-yellow-400 bg-yellow-50 shadow-sm"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span
                  className={`font-medium ${
                    activeMethod === "coins"
                      ? "text-yellow-700"
                      : "text-gray-700"
                  }`}
                >
                  Redeem Coins
                </span>
                <span className="block text-xs mt-1 text-gray-500">
                  Available: {points} coins
                </span>
              </button>
            )}

            <button
              onClick={() => selectPromoMethod()}
              className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                activeMethod === "promo"
                  ? "border-purple-400 bg-purple-50 shadow-sm"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span
                className={`font-medium ${
                  activeMethod === "promo" ? "text-purple-700" : "text-gray-700"
                }`}
              >
                Promo Code
              </span>
              <span className="block text-xs mt-1 text-gray-500">
                Apply coupon code
              </span>
            </button>
          </div>

          {/* Coin Redeem Section */}
          {activeMethod === "coins" && points > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <CoinRedeemCard
                totalUserCoins={points}
                totalAmount={totalPrice}
                conversionRate={conversionRate}
                setUsedPoints={updatePoints}
              />
            </div>
          )}

          {/* Promo Code Section */}
          {activeMethod === "promo" && (
            <div className="mt-4">
              {!voucherId ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={appliedPromoCode}
                    disabled={!promoCode.trim()}
                    className={`px-5 py-3 rounded-lg font-medium ${
                      promoCode.trim()
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CircleCheckIcon className="text-green-600 h-5 w-5" />
                    <div>
                      <p className="font-medium text-green-800">{promoCode}</p>
                      <p className="text-sm text-green-700">
                        {promoCodeMessage}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="text-sm font-medium text-purple-600 hover:text-purple-800"
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoCodeMessage && !voucherId && (
                <p className="mt-2 text-sm text-red-600">{promoCodeMessage}</p>
              )}
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
            </div>

            {(usedPoints || promoCodeDiscount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount Applied</span>
                <span className="font-medium">
                  - ₹
                  {usedPoints > 0
                    ? (usedPoints / conversionRate).toFixed(2)
                    : promoCodeDiscount}
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₹{(finalAmount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Policy Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Cancellation Policy
              </p>
              <p className="mt-1 text-sm text-yellow-700">
                A <span className="font-semibold">{charge}% cancellation fee</span>{" "}
                applies to this ticket. This charge will be deducted if you
                cancel your booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CommonModalLayout>
  );
};

export default CheckoutModal;
