import Immutable from "seamless-immutable";
import { Reducer } from "redux";

import * as types from "./action-types";

const emptyBookings: any = {
  completed: [],
  upcoming: [],
};

const initialState = Immutable({
  bookings: emptyBookings
});

export default function bookings(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.FETCH_SUCCESS:
      return state.merge({
        bookings: action.bookings,
        loading: false,
      });

    default:
      return state;
  }
}
