export interface Config {
  api: {
    host: string;
    clientAuth: string;
  };
  timezone: string;
  timerIntervals: {
    bookings: number;
    calendar: number;
  };
  appVersion: string;
}

declare const __DEV__: string;
let config: Config;

if (__DEV__) {
  config = require("../conf/dev.json");
}
else {
  config = require("../conf/prod.json");
}

const pkgConfig = require("../package.json");
config.appVersion = pkgConfig.version;

export default config;
