module.exports.errorCodes = {
    400: {
        code: 400,
        message: 'The request body was either not present or did not contain the required fields'
    },
    401: {
        code: 401,
        message: 'The specified credentials were invalid.'
    },
    403: {
        code: 403,
        message: 'The request was not made by an authenticated User satisfying the authorization criteria.'
    },
    404: {
        code: 404,
        message: 'Specified object not found.'
    },
    409: {
        code: 409,
        message: 'The given object already exists.'
    },
    500: {
        code: 500,
        message: 'An internal server error occurred.'
    }
}
