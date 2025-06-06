import { IPaymentHistory, ITicketBooking } from "./types";

export const getChipLabel = (row: ITicketBooking): "attended" | "booked" | "cancelled" => {
  if (row.bookingStatus === "booked" && row.isAttended) return "attended";
  if (row.bookingStatus === "booked" && !row.isAttended) return "booked";
  if (row.bookingStatus === "cancelled") return "cancelled";

  // Default case (in case of unexpected data)
  return "booked";
};

export const getSearchResults = (data: IPaymentHistory[], keyword: string) => {
    const searchQuery = keyword.toLowerCase()

    return data.filter(item => 
        item.title.toLowerCase().includes(searchQuery) ||
        item.staus.toLowerCase().includes(searchQuery) ||
        item.cancelledDate.toLowerCase().includes(searchQuery) ||
        item.bookingDate.toLowerCase().includes(searchQuery)
    )
}

export const getAmountInfo = (item: ITicketBooking) => {
  let refundedAmount = 0;
  let totalAmountPaid = item.totalAmount;

  if (item.cancelledAt !== null) {
    const selectedTicketPrice =
      item.event.tickets.find(t => t._id === item.ticket)?.price || 0;

    const actualAmount = selectedTicketPrice * item.seats; // 120
    refundedAmount = actualAmount - item.totalAmount; // 108
    totalAmountPaid = actualAmount
  }

  return {refundedAmount, totalAmountPaid};
};


