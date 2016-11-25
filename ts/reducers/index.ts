import {ReducersMapObject} from "redux";

import session from "./session/reducer";
import bookings from "./bookings/reducer";
import calendar from "./calendar/reducer";
import calendarDay from "./calendar-day/reducer";

export default <ReducersMapObject> {
  session,
  bookings,
  calendar,
  calendarDay,
};
