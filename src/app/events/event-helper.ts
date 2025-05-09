import { EventData, Ticket } from "./types";
import { EventDataObjResponse, EventResponse, IApplyFiltersKey, IEventPrice, IEventRangeDate } from "@/utils/types";
import { LabelValue } from "./types";
import { durationOptions, STATUS_OPTIONS, TICKETS_OPTIONS } from "@/utils/constant";

import moment from "moment";

export const setUserLatLong = (lat: number, lng : number) => {
   localStorage.setItem("lat", `${lat}`)
   localStorage.setItem("lng", `${lng}`)
}

const removeUserLatLong = () => {
  localStorage.removeItem("lat")
  localStorage.removeItem("lng")
}

export function getEventStatus(startTime: string, endTime: string): 'ongoing' | 'upcoming' | 'ended' {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    if (now >= start && now <= end) {
      return 'ongoing';
    } else if (now < start) {
      return 'upcoming';
    } else {
      return 'ended';
    }
  }
  export const isNearbyWithUserLocation = async (
    targetLat: number,
    targetLng: number,
    radiusInKm: number = 5
  ): Promise<boolean> => {
    const toRad = (value: number) => (value * Math.PI) / 180;
  
    if (typeof window === "undefined" || !navigator.geolocation) {
      return false;
    }
  
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLatLong(userLat,userLng)
  
          const R = 6371; 
          const dLat = toRad(targetLat - userLat);
          const dLng = toRad(targetLng - userLng);
  
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(userLat)) *
            Math.cos(toRad(targetLat)) *
            Math.sin(dLng / 2) ** 2;
  
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
  
          resolve(distance <= radiusInKm);
        },
        () => {
          resolve(false); 
          removeUserLatLong()
        }
      );
    });
  };

export const openMapDirection=(location: {
  lat: number;
  lng: number;
})=>{
  const url = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=18/${location.lat}/${location.lng}`
  window.open(url, '_blank')
}

export const areAllTicketsBooked = (tickets : Ticket[]): boolean => {
    return tickets.every(ticket => ticket.totalBookedSeats >= ticket.totalSeats);
};

export const getAllTicketStatus=(tickets:Ticket[])=>{
  let totalTicket=0,bookedTickets=0;
  tickets.map((ticket)=>{
    totalTicket+=ticket.totalSeats;
    bookedTickets+=ticket.totalBookedSeats;
  })
  const availableSeats = totalTicket - bookedTickets;
  const ratio = availableSeats / totalTicket;
  if (availableSeats <= 0) {
    return { status: 'Sold Out', color: 'gray' };
  } else if (ratio > 0.5) {
    return { status: 'Available', color: 'text-green-800' };
  } else if (ratio > 0.2) {
    return { status: 'Filling Fast', color: 'text-yellow-800' };
  } else {
    return { status: 'Almost Full', color: 'text-red-800' };
  }
}

export const getSimilarEvents = (events:EventDataObjResponse[] | null,currentEventId :string) => {
if(events){
    const currentEvent = events.find(event => event._id === currentEventId);
if (!currentEvent) return [];
return events
    .filter(event => event.category === currentEvent.category && event._id !== currentEventId)
    .slice(0, 3); 
}
};

export const getTicketStatus = (ticket: Ticket): {
  status: 'Available' | 'Filling Fast' | 'Almost Full' | 'Sold Out';
  color: 'bg-green-100 text-green-800' | 'bg-yellow-100 text-yellow-800' | 'bg-red-100 text-red-800' | 'gray';
} => {
  const availableSeats = ticket.totalSeats - ticket.totalBookedSeats;
  const ratio = availableSeats / ticket.totalSeats;

  if (availableSeats <= 0) {
    return { status: 'Sold Out', color: 'gray' };
  } else if (ratio > 0.5) {
    return { status: 'Available', color: 'bg-green-100 text-green-800' };
  } else if (ratio > 0.2) {
    return { status: 'Filling Fast', color: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { status: 'Almost Full', color: 'bg-red-100 text-red-800' };
  }
};

export const convertToSubCurrency=(amount:number,factor:100)=>{
  return Math.round(amount * factor)
}

export const getMaxTicketPrice = (events: EventData[]): number => {
  let maxPrice = 0;

  events.forEach(event => {
    const data = event.ticketsArray ? event.ticketsArray : [] ;
    data.forEach(ticket => {
      if (ticket.price > maxPrice) {
        maxPrice = ticket.price;
      }
    });
  });

  return maxPrice;
};

export const convertFiltersToArray = (filters: IApplyFiltersKey): LabelValue[] => {
  const result: LabelValue[] = [];

  const { catogories, durations, status, ticketsTypes, eventsDates, priceRange , locationRadius, likeEvent } = filters

  if (catogories && catogories.length) {
    catogories.forEach((cat) =>
      result.push({ label: cat, value: cat, rowKey: "catogories" })
    );
  }

  if (durations && durations.length) {
    durations.forEach((duration) => {
      const durationLable = durationOptions.filter(item => item.value === duration).map(item => item.label)
      return result.push({ label: durationLable.toString(), value: duration, rowKey: "durations" })
    }
    );
  }

  if (status) {
    const statusLabel = STATUS_OPTIONS.filter(item => item.value === status).map(item => item.label)
    result.push({ label: statusLabel.toString(), value: status, rowKey: "status" });
  }

  if (ticketsTypes) {
    const ticketLablel = TICKETS_OPTIONS.filter(item => item.value === ticketsTypes).map(item => item.label)
    result.push({ label: ticketLablel.toString(), value: ticketsTypes, rowKey : "ticketsTypes" });
  }

  if (eventsDates && eventsDates.from && eventsDates.to) {
    result.push({
      label: `${moment(eventsDates.from).format(('DD MMM YYYY'))} - ${moment(eventsDates.to).format(('DD MMM YYYY'))}`,
      value: `${eventsDates.from}`,
      rowKey: "eventsDates"
    });
  }

  if (priceRange && priceRange.min > -1 && priceRange.max) {
    result.push({
      label:  `₹${priceRange.min} - ₹${priceRange.max}`,
      value: `${priceRange.min} - ${priceRange.max}`,
      rowKey: "priceRange"
    });
  }

  if (likeEvent) {
    result.push({
      label:  "Liked Events",
      value: "true",
      rowKey: "likeEvent"
    });
  }

  if (locationRadius) {
    result.push({
      label: `Upto ${locationRadius} km`,
      value: locationRadius,
      rowKey: "locationRadius"
    });
  }

  return result;
};

export const removeFilterFromObject = (
  key: keyof IApplyFiltersKey,
  valueToRemove: string,
  currentFilters: IApplyFiltersKey
): IApplyFiltersKey => {
  const updatedFilters: IApplyFiltersKey = { ...currentFilters };

  const currentValue = updatedFilters[key];

  // Handle array values (e.g., catogories, durations)
  if (Array.isArray(currentValue)) {
    const filteredArray = currentValue.filter(item => item !== valueToRemove);
    if (filteredArray.length > 0) {
      updatedFilters[key] = filteredArray as any;
    } else {
      delete updatedFilters[key];
    }
  }

  // Handle primitive string values
  else if (typeof currentValue === 'string') {
    if (currentValue === valueToRemove) {
      delete updatedFilters[key];
    }
  }

  // Handle object values (optional: extend this logic as needed)
  else if (typeof currentValue === 'object' && currentValue !== null) {
    // Example: remove eventsDates if both fields are empty
    if (key === 'eventsDates') {
       delete updatedFilters[key];
    }

    if (key === 'priceRange') {
      delete updatedFilters[key];
    }
  }

  return updatedFilters;
};

export const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const filterEventsByDistance = (events: EventData[], selectedRadius: string): EventData[] => {
  const userLat = parseFloat(localStorage.getItem("lat") || "0");
  const userLng = parseFloat(localStorage.getItem("lng") || "0");
  const radiusKm = parseFloat(selectedRadius);

  return events.filter((event) => {
    if (event.lat && event.lng) {
      const distance = getDistanceInKm(userLat, userLng, event.lat, event.lng);
      return distance <= radiusKm;
    }
    return false;
  });
}



export const filterByCatogories = (events: EventData[], catogoeriesArray : string[]) => {
  return events.filter(event => catogoeriesArray.includes(event.category))
}

export const filterByDuration = (
    events: EventData[],
    selectedDurations: string[]
): EventData[] => {

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
    events: EventData[],
    status: string
): EventData[] => {
    return events.filter(event => event.status.includes(status))
}

export const filterByTicketsAvailability = (
    events: EventData[],
    ticketType: string // one of: "available" | "fastFilling" | "almostFull" | "soldOut"
): EventData[] => {

    return events.filter(event => {
      const { ticketsAvailable, totalTickets } = event
      if (!totalTickets || totalTickets === 0) return false

      if (ticketsAvailable && totalTickets) {
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

      }
    })
}


export const filterBySearch = (
    events: EventData[],
    keyword: string
) => {
    const lowerKeyword = keyword.toString().toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowerKeyword)
    );
}

export const filterByDateRange = (
  events: EventData[],
  eventDates: IEventRangeDate
): EventData[] => {
  const { from, to } = eventDates

  const fromDate = moment(from).startOf("day")
  const toDate = to ? moment(to).endOf("day") : moment().endOf("day") // if `to` missing, use today

  return events.filter(event => {
    const eventDate = moment(event.startTime)
    return eventDate.isBetween(fromDate, toDate, undefined, "[]") // inclusive
  })
}

export const filterByLikedEvents = (events: EventData[], likeEvent : string) => {
  if(likeEvent === "true") {
   return events.filter(event => event.isLiked)
  }
  return events
}

export const filterByPriceRange = (
    events: EventData[],
    priceRange: IEventPrice
): EventData[] => {
    const { min, max } = priceRange;

    return events.filter(event => {
        const prices = event.ticketsArray ? event.ticketsArray.map(ticket => ticket.price) : [];
        const minTicketPrice = Math.min(...prices);
        const maxTicketPrice = Math.max(...prices);
    
        // Check if event's price range overlaps with filter range
        const isOverlap = !(max < minTicketPrice || min > maxTicketPrice);
        return isOverlap;
    });
};

export const getFilteredEventsData = (events : EventData[], filterValues : IApplyFiltersKey) => {
  let data = [...events]

  const { catogories, status, durations, search, eventsDates, ticketsTypes, priceRange, likeEvent, locationRadius } = filterValues

  if (search && search.trim() !== "") {
    data = filterBySearch(data, search)
  }

  if(catogories && catogories.length > 0) {
     data = filterByCatogories(data,catogories)
  }

  if(status && status.trim() !== "") {
    data = filterByStatus(data, status)
  }
  if (durations && durations.length > 0) {
    data = filterByDuration(data, durations)
  }

  if (eventsDates && eventsDates.from && eventsDates.to && eventsDates.from !== "") {
    data = filterByDateRange(data, eventsDates)
  }

  if (ticketsTypes && ticketsTypes.trim() !== "") {
    data = filterByTicketsAvailability(data, ticketsTypes)
  }

  if (priceRange && priceRange.max && priceRange.min > -1) {
    data = filterByPriceRange(data, priceRange)
  }

  if (likeEvent && likeEvent.trim() !== "") {
    data = filterByLikedEvents(data, likeEvent)
  }

  if(locationRadius && locationRadius.trim() !== "") {
    data = filterEventsByDistance(data,locationRadius)
  }

  return data
}

export const hasEventEnded = (endDateTime: string | Date): boolean => {
  const endDate = new Date(endDateTime)
  endDate.setDate(endDate.getDate() + 1)
  return endDate.getTime() < new Date().getTime()
}
