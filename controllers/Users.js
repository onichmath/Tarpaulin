'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');
const { requireAuth, checkPermissions } = require('../utils/auth.js');
const { errorHandler }= require('../middleware/errorHandler');
const { rateLimiter } = require('../utils/ratelimiter.js');


// Controllers call coresponding services, then passes response to Json writer to create response

module.exports.authenticateUser = function authenticateUser (req, res, next, body) {
  // Logs in a user if the user exists and their credentials are correct
  rateLimiter(req, res, next)
    .then(() => Users.authenticateUser(body))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    })
};

module.exports.createUser = function createUser(req, res, next, body) {
  rateLimiter(req, res, next)
    .then(() => checkPermissions(req, res, next, body))
    .then(() => Users.createUser(body))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};


module.exports.getUserById = function getUserById (req, res, next, id) {
  // Instructors and students have differnt response to this endpoint
  // Checkpermissions AND check if user is the same as the id
  // WHICH FIRST?
  // check if user is the same as the id then check permissions then Users.getUserById(id)
  // ID can be gotten from JWT
  // Gets a user by their id if their jwt id matches the id
  Users.getUserById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
