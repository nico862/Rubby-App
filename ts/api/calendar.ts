import * as moment from "moment";

import ApiRequest from "./request";

export function getCalendar(): Promise<any> {
  const request = new ApiRequest(
    "/calendar",
    { method: "GET" }
  );

  return request.makeRequest().then((res: any) => res.json());
}

export function getCalendarDay(date: string): Promise<any> {
  const request = new ApiRequest(
    `/calendar/${ date }`,
    { method: "GET" }
  );

  return request.makeRequest().then((res: any) => res.json());
}

export function setHourAvailable(timeStarts: moment.Moment) {
  const body = JSON.stringify({
    timeStarts,
    timeEnds: timeStarts.clone().endOf("hour"),
  });

  const request = new ApiRequest(
    "/availability",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    }
  );

  return request.makeRequest();
}

export function setHourUnavailable(location: string) {
  const request = new ApiRequest(
    location,
    { method: "DELETE" }
  );

  return request.makeRequest();
}
