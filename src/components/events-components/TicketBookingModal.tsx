import React, { useState } from 'react'
import {
  X as CloseIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
} from 'lucide-react'
import { EventTicket } from '@/types/events'
interface TicketType {
  type: string
  price: number
  description: string
  availableSeats: number
}
interface TicketBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (ticketDetails: {
    type: string
    quantity: number
    totalPrice: number
  }) => void
  eventTitle: string
  tickets:EventTicket[]
}
const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  eventTitle,
  tickets
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(0)
  if (!isOpen) return null
  const selectedTicketType = tickets.find((t) => t.type === selectedType)
  const totalPrice = selectedTicketType
    ? selectedTicketType.price * quantity
    : 0
  const handleTicketSelect = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null)
      setQuantity(0)
    } else {
      setSelectedType(type)
      setQuantity(1)
    }
  }
  const availableSeats = (totalSeats:number,totalBookedSeats:number)=>{
    return totalSeats-totalBookedSeats;
  }
  const handleQuantityChange = (newQuantity: number) => {
    if (
      newQuantity >= 0 &&
      selectedTicketType &&
      newQuantity <= availableSeats(selectedTicketType.totalSeats,selectedTicketType.totalBookedSeats)
    ) {
      setQuantity(newQuantity)
    }
  }
  const handleProceed = () => {
    if (selectedType && quantity > 0) {
      onSuccess({
        type: selectedType,
        quantity,
        totalPrice,
      })
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-scroll no-scrollbar">
      <div className="bg-white rounded-lg w-full max-w-md mt-40 ">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Book Tickets</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {eventTitle}
          </h3>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.type}
                className={`p-4 rounded-lg border-2 transition-colors ${selectedType === ticket.type ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{ticket.type}</h4>
                    <p className="text-sm text-gray-500">
                      {ticket.description}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${ticket.price}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  {selectedType === ticket.type ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                        disabled={quantity < 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                        disabled={quantity >= availableSeats(ticket.totalSeats,ticket.totalBookedSeats)}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTicketSelect(ticket.type)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      Add
                    </button>
                  )}
                  <span className="text-sm text-gray-500">
                    {availableSeats(ticket.totalSeats,ticket.totalBookedSeats)} available
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-900 font-medium">Total Amount:</span>
              <span className="text-xl font-semibold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleProceed}
              disabled={!selectedType || quantity === 0}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${selectedType && quantity > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TicketBookingModal
