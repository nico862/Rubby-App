import * as express from "express";
import * as moment from "moment";
import "moment-timezone";
import "moment-range";
import * as calendar from "node-calendar";
import * as _ from "underscore";

import { bookingService, availabilityService } from "../services";
import * as bookingsModel from "./bookings-model";
import { Booking, Availability } from "../business-objects";
import { mapRowToAvailability } from "../services/model-helper";
import {location} from "../utils/http";
import config from "../config";

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

export function getCalendarForTherapist(therapistUrn: string): Promise<Month[]> {
  const start = moment().startOf("day");
  const end = start.clone().add(config.calendar.daysAhead, "days");

  return bookingService.fetchBookingsForTherapist(therapistUrn, {start, end})
    .then(bookings => getDates(start, end, bookings));
}

function getDates(start: moment.Moment, end: moment.Moment, bookings: Booking[]): Month[] {
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

export interface AvailabilityHour {
  hour: number;
  isAvailable?: boolean;
  hasBooking?: boolean;
  location?: string;
}

export interface BookingAvailability {
  bookings: Booking[];
  hours: AvailabilityHour[];
}

export function getAvailabilityForTherapistForDay(req: express.Request, therapistUrn: string, start: moment.Moment): Promise<BookingAvailability> {
  const end = start.clone().endOf("day");

  return Promise.all([
    availabilityService.getAvailableTimesForDay(therapistUrn, start),
    bookingService.fetchBookingsForTherapist(therapistUrn, {start, end})
  ])
    .then(data => {
      const [availability, bookings] = data;

      const hours = annotateAvailability(req, start, availability, bookings);

      if (bookings.length === 0) {
        return {hours, bookings: []} as BookingAvailability;
      }

      return bookingsModel.assignBookingFields(bookings)
        .then(populatedBookings => {
          return {hours, bookings: populatedBookings} as BookingAvailability;
        });
    });
}

function annotateAvailability(req: express.Request, start: moment.Moment, availability: Availability[], bookings: Booking[]): AvailabilityHour[] {
  return _.range(0, 24).map(hour => {
    const hourStart = start.clone().add(hour, "hour");
    const hourEnd = hourStart.clone().endOf("hour");
    const hourRange = moment.range(hourStart, hourEnd);

    // test if any availability slots start time are same as this hour
    const hourAvailability = availability.filter(availabilityOption => {
      return availabilityOption.timeStarts.isSame(hourStart);
    });
    const isAvailable = hourAvailability.length > 0;

    // test if any booking overlap this hour
    const hasBooking = bookings.filter(booking => {
      const bookingRange = moment.range(booking.timeStarts, booking.timeEnds);
      return bookingRange.overlaps(hourRange);
    }).length > 0;

    const data: AvailabilityHour = {hour, isAvailable, hasBooking};

    if (isAvailable) {
      data.location = location(req, `/availability/${hourAvailability[0].urn}`);
    }

    return data;
  });
}

export function createAvailability(therapistUrn: string, params: any): Promise<Availability> {
  params["therapistUrn"] = therapistUrn;
  const availability = mapRowToAvailability(params);

  return availabilityService.createAvailability(availability);
}

export function deleteAvailability(availabilityUrn: string): Promise<boolean> {
  return availabilityService.deleteAvailability(availabilityUrn);
}
