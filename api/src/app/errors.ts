export class ExtendableError extends Error {
  constructor(message: string) {
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

export class ValidationError extends ExtendableError {
  constructor(message: string) {
    super(message);
  }
}

export class ResourceNotFound extends ExtendableError {
  constructor(message: string) {
    super(message);
  }
}