'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');
const { requireAuth, checkPermissions } = require('../utils/auth.js');
const { errorHandler }= require('../middleware/errorHandler');

```
Controllers call coresponding services, then passes response to Json writer to create response
```

module.exports.authenticateUser = function authenticateUser (req, res, next, body) {
  ```
  Logs in a user if the user exists and their credentials are correct
  ```
  Users.authenticateUser(body)

    .then(function (response) {
      utils.writeJson(res, response);
    })

    .catch(function (error) {
      errorHandler(res, error);
    });
};

module.exports.createUser = function createUser (req, res, next, body) {
  ```
  If user has permissions to create a user, runs create user service
  ```
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
  ```
  Gets a user by their id if their jwt id matches the id
  ```
  Users.getUserById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
