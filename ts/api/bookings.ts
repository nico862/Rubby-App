import ApiRequest from "./request";

export function getBookings(): Promise<any> {
  const request = new ApiRequest(
    "/bookings",
    { method: "GET" }
  );

  return request.makeRequest().then((res: any) => res.json());
}
