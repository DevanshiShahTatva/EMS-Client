import { EventsDataTypes, EventTicket, IApplyFiltersKey, IEventPrice, IEventRangeDate } from "@/utils/types";
import { IEventFormData } from "./types";
import moment from "moment";

export const getTicketPriceRange = (data: EventTicket[]) => {
    const prices = data.map((ticket) => ticket.price);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const priceRange =
        minPrice === 0
            ? `${maxPrice === 0 ? "Free" : `Free - ₹${maxPrice}`}`
            : minPrice === maxPrice
                ? `₹${minPrice}`
                : `₹${minPrice} - ₹${maxPrice}`;
    return priceRange
};
export const onwardPriceRange=(data:EventTicket[])=>{
    const price = data.map((ticket)=>ticket.price);
    const minPrice = Math.min(...price);
    const priceOnwards =  minPrice===0 ? 'Starting from Free' : `₹ ${minPrice} onwards`
    return priceOnwards;
}
export const getMaxTicketPrice = (events: EventsDataTypes[]): number => {
    let maxPrice = 0;
  
    events.forEach(event => {
      event.ticketsArray.forEach(ticket => {
        if (ticket.price > maxPrice) {
          maxPrice = ticket.price;
        }
      });
    });
  
    return maxPrice;
  };

export const getStatus = (startDate: string, endDate: string, tickets: number) => {
    const now = moment();
    const start = moment(startDate);
    const end = moment(endDate);

    if (tickets === 0) return "Sold Out";
    if (now.isBefore(start)) return "Upcoming";
    if (now.isAfter(end)) return "Ended";
    return "Ongoing";
};

export const getPaginatedData = (dataArray : EventsDataTypes[], currentPage : number,  itemsPerPage : number ) => {
    const result = dataArray.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    return result
} 

export const handleFreeTicketType = (dataArray : any[], value : string) => {
    let freeType = false

    const label = dataArray.find(item => item.value === value)?.label.toLowerCase();
    if(label && label === "free") {
        freeType = true
    }

    return freeType
}

export const InitialEventFormDataValues: IEventFormData = {
    title: "",
    description: "",
    location: {
        address: "",
        lat: 0,
        long: 0,
    },
    start_time: null,
    end_time: null,
    duration: "",
    category: "",
    ticket_type: [
        {
            type: "",
            price: "",
            max_qty: "",
            description: "",
        },
    ],
    images: [],
    points: ""
}

export const InitialEventFormDataErrorTypes = {
    title: false,
    description: false,
    location: false,
    start_time: false,
    end_time: false,
    duration: false,
    category: false,
    ticket_type: false,
    images: false,
    points : false
};

export const parseDurationToMinutes = (duration: string): number => {
    const regex = /(\d+)\s*(day|days|hr|hrs|hour|hours|min|minutes)/gi;
    let totalMinutes = 0;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(duration)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        if (unit.includes("day")) totalMinutes += value * 24 * 60;
        else if (unit.includes("hr") || unit.includes("hour")) totalMinutes += value * 60;
        else if (unit.includes("min")) totalMinutes += value;
    }

    return totalMinutes;
};

export const sortEvents = (
    events: EventsDataTypes[],
    key: keyof Omit<EventsDataTypes, "img"> | "status",
    order: "asc" | "desc" = "asc"
): EventsDataTypes[] => {

    return [...events].sort((a, b) => {
        let valA: any = a[key as keyof EventsDataTypes];
        let valB: any = b[key as keyof EventsDataTypes];

        if (key === "status") {
            valA = getStatus(a.startTime, a.endTime, a.ticketsAvailable);
            valB = getStatus(b.startTime, b.endTime, b.ticketsAvailable);
        }

        if (key === "startTime" || key === "endTime") {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        }

        if (key === "ticketsAvailable") {
            valA = Number(valA);
            valB = Number(valB);
        }

        if (key === "price") {
            const pricesA = a.ticketsArray.map(t => t.price);
            const pricesB = b.ticketsArray.map(t => t.price);

            const minA = Math.min(...pricesA);
            const maxA = Math.max(...pricesA);
            const minB = Math.min(...pricesB);
            const maxB = Math.max(...pricesB);

            valA = order === "asc" ? minA : maxA;
            valB = order === "asc" ? minB : maxB;
           
        }

        if (key === "duration") {
            valA = parseDurationToMinutes(valA as string);
            valB = parseDurationToMinutes(valB as string);
        }

        if (typeof valA === "string" && typeof valB === "string") {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
    });
};

export const filterByCatogories = (events: EventsDataTypes[], catogoeriesArray : string[]) => {
  return events.filter(event => catogoeriesArray.includes(event.category?.name))
}

export const filterByDuration = (
    events: EventsDataTypes[],
    selectedDurations: string[]
): EventsDataTypes[] => {

    return events.filter(event => {
        const start = moment(event.startTime)
        const end = moment(event.endTime)
        const durationInMinutes = end.diff(start, "minutes")

        return selectedDurations.some(duration => {
            switch (duration) {
                case "short":
                    return durationInMinutes < 60
                case "medium":
                    return durationInMinutes >= 60 && durationInMinutes <= 240
                case "long":
                    return durationInMinutes > 240 && durationInMinutes <= 720
                case "fullDay":
                    return durationInMinutes > 720 && durationInMinutes <= 1440
                case "multiDay":
                    return durationInMinutes > 1440
                default:
                    return false
            }
        })
    })
}

export const filterByStatus = (
    events: EventsDataTypes[],
    status: string
): EventsDataTypes[] => {

    const now = moment()

    return events.filter(event => {
        const start = moment(event.startTime)
        const end = moment(event.endTime)

        switch (status) {
            case "upcoming":
                return start.isAfter(now)
            case "ongoing":
                return now.isBetween(start, end)
            case "ended":
                return end.isBefore(now)
            default:
                return false
        }
    })
}

export const filterByTicketsAvailability = (
    events: EventsDataTypes[],
    ticketType: string // one of: "available" | "fastFilling" | "almostFull" | "soldOut"
): EventsDataTypes[] => {

    return events.filter(event => {
        const { ticketsAvailable, totalTickets } = event
        if (!totalTickets || totalTickets === 0) return false

        const percentageAvailable = (ticketsAvailable / totalTickets) * 100

        switch (ticketType) {
            case "available":
                return percentageAvailable > 50
            case "fastFilling":
                return percentageAvailable > 20 && percentageAvailable <= 50
            case "almostFull":
                return percentageAvailable > 0 && percentageAvailable <= 20
            case "soldOut":
                return ticketsAvailable === 0
            default:
                return false
        }
    })
}

export const filterByDateRange = (
    events: EventsDataTypes[],
    eventDates: IEventRangeDate
  ): EventsDataTypes[] => {
    const { from, to } = eventDates
  
    const fromDate = moment(from).startOf("day")
    const toDate = to ? moment(to).endOf("day") : moment().endOf("day") // if `to` missing, use today
  
    return events.filter(event => {
      const eventDate = moment(event.startTime)
      return eventDate.isBetween(fromDate, toDate, undefined, "[]") // inclusive
    })
  }

export const filterByPriceRange = (
    events: EventsDataTypes[],
    priceRange: IEventPrice
): EventsDataTypes[] => {
    const { min, max } = priceRange;

    return events.filter(event => {
        const prices = event.ticketsArray.map(ticket => ticket.price);
        const minTicketPrice = Math.min(...prices);
        const maxTicketPrice = Math.max(...prices);
    
        // Check if event's price range overlaps with filter range
        const isOverlap = !(max < minTicketPrice || min > maxTicketPrice);
        return isOverlap;
    });
};

export const filterBySearch = (
    events: EventsDataTypes[],
    keyword: string
) => {
    const lowerKeyword = keyword.toString().toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowerKeyword) ||
      event.category?.name.toLowerCase().includes(lowerKeyword) ||
      event.startTime.toLowerCase().includes(lowerKeyword) ||
      event.location.toLowerCase().includes(lowerKeyword) ||
      event.price.toString().toLowerCase().includes(lowerKeyword) ||
      event.ticketsAvailable.toString().toLowerCase().includes(lowerKeyword)
    );
}

export const getFilteredData = (events: EventsDataTypes[], filterValues : IApplyFiltersKey) => {
    let data = [...events]
    let activeFiltersKey = 0

    const { catogories, durations, status, ticketsTypes, eventsDates, priceRange, search } = filterValues

    if(search && search.trim() !== "") {
        data = filterBySearch(data, search)
    }

    if(catogories && catogories.length > 0) {
        data = filterByCatogories(data, catogories)
        activeFiltersKey = activeFiltersKey + 1
    }
    if(durations && durations.length > 0) {
        data = filterByDuration(data, durations)
        activeFiltersKey = activeFiltersKey + 1
    }

    if(status && status.trim() !== "") {
        data = filterByStatus(data, status)
        activeFiltersKey = activeFiltersKey + 1
    }

    if(ticketsTypes && ticketsTypes.trim() !== "") {
        data = filterByTicketsAvailability(data, ticketsTypes)
        activeFiltersKey = activeFiltersKey + 1
    }

    if(eventsDates && eventsDates.from && eventsDates.to && eventsDates.from !== "") {
        data = filterByDateRange(data, eventsDates)
        activeFiltersKey = activeFiltersKey + 1
    }

    if(priceRange && priceRange.max && priceRange.min > -1) {
        data = filterByPriceRange(data, priceRange)
        activeFiltersKey = activeFiltersKey + 1
    }

    return {data , filterCount : activeFiltersKey}
}