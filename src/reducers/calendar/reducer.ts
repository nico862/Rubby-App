import * as si from "seamless-immutable";

import * as types from "./action-types";

const initialState = si.from({
  calendar: [],
  loadingError: false,
});

export default function calendar(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.FETCH_CALENDAR_SUCCESS:
      return state.merge({
        calendar: action.calendar,
        loadingError: false,
      });

    case types.FETCH_CALENDAR_FAIL:
      return state.merge({
        loadingError: true,
      });

    default:
      return state;
  }
}
