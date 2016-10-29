import * as si from "seamless-immutable";

import * as types from "./action-types";

const emptyDiary: any = {
  bookings: [],
  hours: [],
};

const initialState = si.from({
  calendar: [],
  diary: emptyDiary,
});

export default function calendar(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.FETCH_CALENDAR_SUCCESS:
      return state.merge({
        calendar: action.calendar,
        diaryIsLoading: false,
      });

    case types.FETCH_CALENDAR_ATTEMPT:
      return state.merge({
        calendar: [],
        loading: true,
      });

    case types.FETCH_DAY_DIARY_SUCCESS:
      return state.merge({
        diary: action.diary,
        diaryIsLoading: false,
      });

    case types.FETCH_DAY_DIARY_ATTEMPT:
      return state.merge({
        diary: emptyDiary,
        diaryIsLoading: true,
      });

    case types.SET_HOUR_AVAILABLE:
      return setHourIndexProperty(state, action.payload.hourIndex, "isAvailable", true);

    case types.SET_HOUR_UNAVAILABLE:
      return setHourIndexProperty(state, action.payload.hourIndex, "isAvailable", false);

    case types.SET_HOUR_UPDATING:
      return setHourIndexProperty(state, action.payload.hourIndex, "isUpdating", true);

    case types.SET_HOUR_UPDATED:
      return setHourIndexProperty(state, action.payload.hourIndex, "isUpdating", false);

    case types.SET_HOUR_LOCATION:
      return setHourIndexProperty(state, action.payload.hourIndex, "location", action.payload.location);

    case types.UNSET_HOUR_LOCATION:
      return setHourIndexProperty(state, action.payload.hourIndex, "location", undefined);

    default:
      return state;
  }
}

function setHourIndexProperty(state: any, index: number, property: string, value: any) {
  return state.setIn(
    ["diary", "hours", index, property],
    value
  );
}
