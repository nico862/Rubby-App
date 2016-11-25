import {Dispatch} from "redux";

import {getBookings} from "../../api/bookings";
import * as types from "./action-types";
import {handleApiError} from "../util";

export function fetchBookingsSuccess(bookings: any) {
  return {type: types.FETCH_SUCCESS, bookings};
}

export function fetchBookingsFail() {
  return {type: types.FETCH_FAIL};
}

export function fetchBookings() {
  return (dispatch: Dispatch<any>) => {
    getBookings()
      .then(data => dispatch(fetchBookingsSuccess(data)))
      .catch(handleApiError.bind(null, dispatch, fetchBookingsFail));
  };
}
