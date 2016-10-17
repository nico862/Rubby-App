import * as base64 from "base-64";

const config = {
  api: {
    // host: "http://192.168.15.71:8080",
    host: "http://localhost:8080",
    clientAuth: base64.encode([
      "ruubyPAMobileApp",
      "6468dd5c-8590-11e6-ae22-56b6b6499611"
    ].join(":"))
  },
  timerIntervals: {
    bookings: 1000 * 60 * 5
  }
};

export default config;
