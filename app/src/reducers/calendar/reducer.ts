import Immutable from "seamless-immutable";
import { Reducer } from "redux";

import * as types from "./action-types";

const initialState = Immutable({
  calendar: []
});

export default function calendar(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.FETCH_CALENDAR_SUCCESS:
      return state.merge({
        calendar: action.calendar,
        loading: false,
      });

    case types.FETCH_CALENDAR_ATTEMPT:
      return state.merge({
        calendar: [],
        loading: true,
      });

    default:
      return state;
  }
}