'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');
const { requireAuth, checkPermissions } = require('../utils/auth.js');
const { errorHandler }= require('../middleware/errorHandler');

module.exports.authenticateUser = function authenticateUser (req, res, next, body) {
  Users.authenticateUser(body)

    .then(function (response) {
      utils.writeJson(res, response);
    })

    .catch(function (error) {
      errorHandler(res, error);
    });
};

module.exports.createUser = function createUser (req, res, next, body) {
  checkPermissions(req, res, next, body)

    .then(() => {
      return Users.createUser(body);
    })

    .then(function (response) {
      utils.writeJson(res, response);
    })

    .catch(function (error) {
      errorHandler(res, error);
    })
};

module.exports.getUserById = function getUserById (req, res, next, id) {
  // Instructors and students have differnt response to this endpoint
  // Checkpermissions AND check if user is the same as the id
  // WHICH FIRST?
  // check if user is the same as the id then check permissions then Users.getUserById(id)
  // ID can be gotten from JWT
  Users.getUserById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
