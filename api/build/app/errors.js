"use strict";
class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = (new Error(message)).stack;
        }
    }
}
exports.ExtendableError = ExtendableError;
class ValidationError extends ExtendableError {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
class ResourceNotFound extends ExtendableError {
    constructor(message) {
        super(message);
    }
}
exports.ResourceNotFound = ResourceNotFound;

//# sourceMappingURL=errors.js.map
