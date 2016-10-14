import {ReducersMapObject} from "redux";

import session from "./session/reducer";
import bookings from "./bookings/reducer";
import calendar from "./calendar/reducer";

export default <ReducersMapObject> {
  session,
  bookings,
  calendar,
};
