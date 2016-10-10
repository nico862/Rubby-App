"use strict";
const logger_1 = require("./logger");
const errors_1 = require("./errors");
const OAuth2Error = require("oauth2-server");
function errorLogger(err, req, res, next) {
    logger_1.logger.error(err.message, err);
    next(err);
}
exports.errorLogger = errorLogger;
function resourceErrorHandler(err, req, res, next) {
    console.log("Error: " + err.typeof);
    if (err instanceof OAuth2Error) {
        return res.status(400).json({ "error-message": err.message });
    }
    if (err instanceof errors_1.ResourceNotFound) {
        return res.status(404).json({ "error-message": err.message });
    }
    next(err);
}
exports.resourceErrorHandler = resourceErrorHandler;
function errorHandler(err, req, res, next) {
    res.status(500).json({ "error-message": "The server encountered an unexpected condition which prevented it from fulfilling the request." });
}
exports.errorHandler = errorHandler;

//# sourceMappingURL=error-handlers.js.map
