import * as moment from "moment";
import * as calendar from "node-calendar";

import { Booking } from "../models";

export interface Day {
  day: number;
  date: string;
  notInMonth?: boolean;
  isDisabled?: boolean;
  hasBookings?: boolean;
}

export interface Month {
  name: string;
  weeks: Day[][];
}

interface BookingMap {
  [key: string]: boolean;
}

export function getDates(start: moment.Moment, end: moment.Moment, bookings: Booking[]): Month[] {
  // create a date map of bookings
  const bookingsMap = {};
  bookings.forEach(booking => { bookingsMap[ booking.timeStarts.format("YYYY-MM-DD") ] = true; });

  const month = start.clone().subtract(start.date() - 1, "days");

  const dates: Month[] = [];

  while (month.month() <= end.month()) {
    const monthCalendar = new calendar.Calendar().monthdatescalendar(month.year(), month.month() + 1);

    const weeks = monthCalendar.filter(week => {
      const contains = week.filter(date => {
        const day = moment(date);
        return (day.isAfter(start) && day.isBefore(end));
      });

      return contains.length > 0;
    })
    .map(week => {
      return week.map(dateString => {
        const date = moment(dateString);
        const day: Day = {
          day: date.date(),
          date: date.format("YYYY-MM-DD"),
        };

        if (date.month() !== month.month()) day.notInMonth = true;
        if (date.isBefore(start) || date.isAfter(end)) day.isDisabled = true;
        if (bookingsMap[ date.format("YYYY-MM-DD") ]) day.hasBookings = true;
        return day;
      });
    });

    dates.push({
      name: month.format("MMMM"),
      weeks
    });

    month.add(1, "months");
  }

  return dates;
}

export function getDayAvailability(day: moment.Moment, bookings: Booking[]): any {
}