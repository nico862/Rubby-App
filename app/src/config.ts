export interface Config {
  api: {
    host: string;
    clientAuth: string;
  };
  timezone: string;
  timerIntervals: {
    bookings: number;
  }
}

// base config used for dev
const config: Config = {
  api: {
    host: "http://localhost:8080/ruuby-pa",
    clientAuth: "cnV1YnlQQU1vYmlsZUFwcDo2NDY4ZGQ1Yy04NTkwLTExZTYtYWUyMi01NmI2YjY0OTk2MTE="
  },
  timezone: "Europe/London",
  timerIntervals: {
    bookings: 1000 * 60 * 5 // 5 minutes
  }
};

// changes for production
if (!__DEV__) {
  config.api = {
    host:  "https://app-api.ruuby.com/ruuby-pa",
    clientAuth: "cnV1YnlQQU1vYmlsZUFwcDplOGEzNjNhNS01OTY5LTRiOTMtOTJlZS0xNWVjNWU2M2NhMTM"
  };
}

export default config;
