export interface Config {
  api: {
    host: string;
    clientAuth: string;
  };
  timezone: string;
  timerIntervals: {
    bookings: number;
  };
  appVersion: string;
}

let config: Config;
if (__DEV__) {
  config = require("../conf/prod.json");
}
else {
  config = require("../conf/prod.json");
}

const pkgConfig = require("../package.json");
config.appVersion = pkgConfig.version;

export default config;
