'use strict';
const { errorCodes } = require('../utils/error.js');
const { User } = require('../models/user.js');
const { validateAgainstModel, extractValidFields } = require('../utils/validation.js');



/**
 * Log in a User.
 * Authenticate a specific User with their email address and password. 
 *
 * body User Email address and plain-text password for the User being authenticated.

 * returns inline_response_200
 **/
module.exports.authenticateUser = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "token" : "aaaaaaaa.bbbbbbbb.cccccccc"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
module.exports.createUser = function(body) {
  return new Promise(async function(resolve, reject) {
    try {
      await User.deleteMany(); // DELETE IN PRODUCTION
      const {role, auth_role} = body;

      if (typeof(role) != 'string' || typeof(auth_role) != 'string') {
        return reject(errorCodes[400]);
      }

      if (auth_role != 'admin' && (role == 'instructor' || role == 'admin')) {
        return reject(errorCodes[403]);
      }

      const existingUser = await User.findOne({where: {email: body.email}});
      
      if (existingUser) {
        return reject(errorCodes[409]);
      }

      if (!validateAgainstModel(body, User)) {
        return reject(errorCodes[400]);
      }

      const userFields = extractValidFields(body, User);
      const createdUser = await User.create(userFields);
      const response = {
        id: createdUser._id
      };

      resolve(response);
    } catch (error) {
      console.log(error)
      reject(errorCodes[500]);
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
module.exports.getUserById = function(id) {
  return new Promise(function(resolve, reject) {
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

