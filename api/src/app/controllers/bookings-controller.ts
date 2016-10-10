import * as express from "express";
import * as moment from "moment";

import {
  bookingService,
  salonService,
  addressService,
  customerService,
  bookingTreatmentService,
  treatmentService,
  therapistService
} from "../services";

import {
  Booking,
  Customer,
  Salon,
  Address,
  BookingTreatment,
  Treatment,
  Therapist
} from "../models";

function assignAddresses(bookings: Booking[]): Promise<Booking[]> {
  const urns = bookings.map(booking => booking.addressUrn).filter(urn => urn !== undefined);

  return addressService.fetchCustomerAddressesByUrns(urns).then((addresses: Address[]) => {
    bookings.forEach(booking => booking.address = addresses.find((address: Address) => booking.addressUrn === address.urn));
  }).then(() => bookings);
}

function assignCustomers(bookings: Booking[]): Promise<Booking[]> {
  const urns = bookings.map(booking => booking.customerUrn);

  return customerService.fetchCustomersByUrns(urns).then((customers: Customer[]) => {
    bookings.forEach(booking => booking.customer = customers.find((customer: Customer) => booking.customerUrn === customer.urn));
  }).then(() => bookings);
}

function assignSalons(bookings: Booking[]): Promise<Booking[]> {
  const urns = bookings.map(booking => booking.salonUrn);

  return salonService.fetchSalonsByUrns(urns).then((salons: Salon[]) => {
    bookings.forEach(booking => booking.salon = salons.find((salon: Salon) => booking.salonUrn === salon.urn));
  }).then(() => bookings);
}

function assignTreatmentToBookingTreatments(salonUrn: string, bookingTreatments: BookingTreatment[]): Promise<BookingTreatment[]> {
  const urns = bookingTreatments.map(bookingTreatment => bookingTreatment.treatmentUrn);

  return treatmentService.fetchTreatmentsByUrns(salonUrn, urns)
    .then((treatments: Treatment[]) => {
      bookingTreatments.forEach(bookingTreatment => bookingTreatment.treatment = treatments.find((treatment: Treatment) => treatment.urn === bookingTreatment.treatmentUrn ));
    })
    .then(() => bookingTreatments);
}

function assignTherapistToBookingTreatments(salonUrn: string, bookingTreatments: BookingTreatment[]): Promise<BookingTreatment[]> {
  const urns = bookingTreatments.map(bookingTreatment => bookingTreatment.therapistUrn);
  return therapistService.fetchTherapistsByUrns(salonUrn, urns)
    .then((therapists: Therapist[]) => {
      bookingTreatments.forEach(bookingTreatment => bookingTreatment.therapist = therapists.find((therapist: Therapist) => therapist.urn === bookingTreatment.therapistUrn ));
    })
    .then(() => bookingTreatments);
}

function assignBookingTreatments(bookings: Booking[]): Promise<Booking[]>  {
  const promises = bookings.map((booking) => {
    return bookingTreatmentService.fetchBookingTreatments(booking)
      .then((bookingTreatments: BookingTreatment[]) =>  {
        booking.bookingTreatments = bookingTreatments;
      })
      .then(() => assignTreatmentToBookingTreatments(booking.salonUrn, booking.bookingTreatments))
      .then(() => assignTherapistToBookingTreatments(booking.salonUrn, booking.bookingTreatments));
  });

  return Promise.all(promises).then(() => bookings);
}

function assignFields(bookings: Booking[]): Promise<Booking[]> {
  return Promise.all([
    assignBookingTreatments(bookings),
    assignSalons(bookings),
    assignCustomers(bookings),
    assignAddresses(bookings)
  ]).then(() => bookings);
}

interface DividedBookings {
  completed: Booking[];
  upcoming: Booking[];
}

function divideByCompleted(bookings: Booking[]): DividedBookings {
  const now = moment();

  const dividedBookings: DividedBookings = {
    completed: [],
    upcoming: [],
  };

  bookings.forEach(booking => {
    if (booking.timeEnds.isBefore(now)) {
      dividedBookings.completed.push(booking);
    }
    else {
      dividedBookings.upcoming.push(booking);
    }
  });

  return dividedBookings;
}

function sortBookings(bookings: Booking[]): Booking[] {
  return bookings.sort((a, b) => {
    if (a.timeEnds < b.timeEnds) return 1;
    if (a.timeEnds > b.timeEnds) return -1;
    return 0;
  });
}

export function index(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const user = res.locals.oauth.token.user;

  bookingService.fetchBookingsForUser(user.id)
    .then(sortBookings)
    .then(assignFields)
    .then((bookings) => res.json(divideByCompleted(bookings)))
    .catch(console.log);
}
