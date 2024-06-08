class ValidationError extends Error { // 400
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
module.exports.ValidationError = ValidationError;

class CredentialsError extends Error { // 401
    constructor(message) {
        super(message);
        this.name = 'CredentialsError';
    }
}
module.exports.CredentialsError = CredentialsError;

class PermissionError extends Error { // 403
    constructor(message) {
        super(message);
        this.name = 'PermissionError';
    }
}
module.exports.PermissionError = PermissionError;


module.exports.errorCodes = {
    400: {
        code: 400,
        payload: 'The request body was either not present or did not contain the required fields'
    },
    401: {
        code: 401,
        payload: 'The specified credentials were invalid.'
    },
    403: {
        code: 403,
        payload: 'The request was not made by an authenticated User satisfying the authorization criteria.'
    },
    404: {
        code: 404,
        payload: 'Specified object not found.'
    },
    409: {
        code: 409,
        payload: 'The given object already exists.'
    },
    500: {
        code: 500,
        payload: 'An internal server error occurred.'
    }
}
