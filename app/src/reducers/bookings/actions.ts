import * as reactRedux from "react-redux";

import {getBookings} from "../../api/bookings";
import * as types from "./action-types";

export function fetchBookingsSuccess(bookings: any) {
  return {type: types.FETCH_SUCCESS, bookings};
}

export function fetchBookingsFail(err: Error) {
  console.log(err);
  return {type: types.FETCH_FAIL};
}

export function fetchBookings() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
    getBookings()
      .then(data => dispatch(fetchBookingsSuccess(data)))
      .catch(err => dispatch(fetchBookingsFail(err)));
  };
}
