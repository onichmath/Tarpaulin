class ServerError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends ServerError { // 400
    constructor(message) {
        super(message, 400);
    }
}

class CredentialsError extends ServerError { // 401
    constructor(message) {
        super(message, 401);
    }
}

class PermissionError extends ServerError { // 403
    constructor(message) {
        super(message, 403);
    }
}

class NotFoundError extends ServerError { // 404
    constructor(message) {
        super(message, 404);
    }
}

class ConflictError extends ServerError { // 409
    constructor(message) {
        super(message, 409);
    }
}

class RateLimitError extends ServerError { // 429
    constructor(message) {
        super(message, 429);
    }
}


module.exports = {
    ServerError,
    ValidationError,
    CredentialsError,
    PermissionError,
    NotFoundError,
    ConflictError,
    RateLimitError
}
