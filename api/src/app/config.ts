export interface Config {
  env: string;
  express: {
    port: number;
  };
  database: {
    ruuby: {
      host: string;
      database: string;
      user: string;
      password: string;
    }
  };
  log: {
    level: string;
    cloudwatch?: any;
  };
  bookingsApi: {
    endpoint: string;
  };
  jwt: {
    tokenSecret: string;
    expires: number;
  };
  dynamoDB: {
    endpoint?: string;
  };
  calendar: {
    daysAhead: number;
  };
  timezone: string;
}

let confFile = "../../conf/dev.json";
if (process.env.RUUBY_PA_API_CONFIG_FILE) confFile = process.env.RUUBY_PA_API_CONFIG_FILE;

const config: Config = require(confFile);

export default config;
