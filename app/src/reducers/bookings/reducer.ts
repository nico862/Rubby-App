import * as si from "seamless-immutable";

import * as types from "./action-types";

const emptyBookings: any = {
  completed: [],
  upcoming: [],
};

const initialState = si.from({
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

// import * as si from "seamless-immutable";

// import * as types from "./action-types";
// import {Booking} from "../../business-objects";

// export interface BookingsState {
//   bookings: {
//     completed: Booking[];
//     upcoming: Booking[];
//   },
//   loading: boolean;
// }

// const initialStateObject: BookingsState = {
//   bookings: {
//     completed: [],
//     upcoming: [],
//   },
//   loading: false,
// };

// const initialState = si.from(initialStateObject);

// export default function bookings(state: si.ImmutableObject<BookingsState> = initialState, action: any = {}): any {
//   switch (action.type) {
//     case types.FETCH_SUCCESS:
//       return state.merge({
//         bookings: action.payload,
//         loading: false,
//       });

//     default:
//       return state;
//   }
// }
