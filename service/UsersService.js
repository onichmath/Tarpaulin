'use strict';
const { User } = require('../models/user.js');
const { validateAgainstModel, extractValidFields } = require('../utils/validation.js');
const { handleUserError, isAuthorizedToCreateUser, checkForExistingUser, hashAndExtractUserFields, createUser, checkLoginFields, getExistingUser, checkIfAuthenticated } = require('../helpers/userServiceHelpers.js');
const { generateToken } = require('../utils/auth.js');


/**
 * Log in a User.
 * Authenticate a specific User with their email address and password. 
 *
 * body User Email address and plain-text password for the User being authenticated.

 * returns inline_response_200
 **/
module.exports.authenticateUser = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkLoginFields(body);
      const existingUser = await getExistingUser(body);

      await checkIfAuthenticated(body, existingUser);
      const token = await generateToken(existingUser._id);

      return resolve(token);
    } catch (error) {
      return reject(await handleUserError(error));
    }
  });
}


/**
 * Create a new User.
 * Create and store a new application User with specified data and adds it to the application's database.  Only an authenticated User with 'admin' role can create users with the 'admin' or 'instructor' roles. 
 *
 * body User A User object.
 * returns inline_response_201
 **/
module.exports.createUser = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany(); // DELETE IN PRODUCTION
      const {role, auth_role} = body;

      await Promise.all([
        validateAgainstModel(body, User),
        isAuthorizedToCreateUser(role, auth_role),
        checkForExistingUser(body)
      ]);

      const userFields = await hashAndExtractUserFields(body);
      const response = await createUser(userFields);

      return resolve(response);
    } catch (error) {
      return reject(await handleUserError(error));
    }
  });
}


/**
 * Fetch data about a specific User.
 * Returns information about the specified User.  If the User has the 'instructor' role, the response should include a list of the IDs of the Courses the User teaches (i.e. Courses whose `instructorId` field matches the ID of this User).  If the User has the 'student' role, the response should include a list of the IDs of the Courses the User is enrolled in.  Only an authenticated User whose ID matches the ID of the requested User can fetch this information. 
 *
 * id id Unique ID of a User.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns User
 **/
module.exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    var examples = {};
    examples['application/json'] = {
  "password" : "hunter2",
  "role" : "student",
  "name" : "Jane Doe",
  "email" : "doej@oregonstate.edu"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

