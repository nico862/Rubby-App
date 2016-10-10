import * as winston from "winston";
import config from "./config";

const WinstonCloudWatch = require("winston-cloudwatch");

export const logger = new (winston.Logger)({
  level: config.log.level
});

if (process.env.NODE_ENV !== "test") {
  if (config.log.cloudwatch) {
    logger.add(WinstonCloudWatch, config.log.cloudwatch);
  }
  else {
    logger.add(winston.transports.Console, {
      level: "debug",
      colorize: true,
      handleExceptions: true
    });
  }
}
else {
  logger.add(winston.transports.File, {
    level: "debug",
    filename: "test.log"
  });
}
