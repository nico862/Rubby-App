"use strict";
const winston = require("winston");
const config_1 = require("./config");
const WinstonCloudWatch = require("winston-cloudwatch");
exports.logger = new (winston.Logger)({
    level: config_1.default.log.level
});
if (process.env.NODE_ENV !== "test") {
    if (config_1.default.log.cloudwatch) {
        exports.logger.add(WinstonCloudWatch, config_1.default.log.cloudwatch);
    }
    else {
        exports.logger.add(winston.transports.Console, {
            level: "debug",
            colorize: true,
            handleExceptions: true
        });
    }
}
else {
    exports.logger.add(winston.transports.File, {
        level: "debug",
        filename: "test.log"
    });
}

//# sourceMappingURL=logger.js.map
