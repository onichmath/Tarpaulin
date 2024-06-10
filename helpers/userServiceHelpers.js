const { ValidationError, PermissionError, ConflictError, ServerError, NotFoundError} = require('../utils/error.js');
const { User } = require('../models/user.js');
const { extractValidFields } = require('../utils/validation.js');
const bcrypt = require('bcrypt');

module.exports.getUserCourses = async (id) => {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new NotFoundError('User not found.');
  }

  if (id != existingUser._id) {
    throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
  }

  const courses = existingUser.courses;

  if (!courses || courses.length == 0) {
    throw new NotFoundError('Specified user has no courses.');
  }
  return courses;
}


module.exports.checkIfAuthenticated = async (body, existingUser) => {
  const authenticated = await bcrypt.compare(body.password, existingUser.password);
  if (!authenticated) {
    throw new PermissionError('The specified credentials were invalid.');
  }
  return true;
}

module.exports.checkLoginFields = async (body) => {
  if (!body.email || !body.password) {
    throw new ValidationError('The request body was either not present or did not contain all the required fields.');
  }
}

module.exports.isAuthorizedToCreateUser = async (role, auth_role) => {
  if (typeof(role) != 'string' || typeof(auth_role) != 'string') {
    throw new ValidationError('The request body was either not present or did not contain a valid User object.');
  }
}

module.exports.getExistingUser = async (body) => {
  const existingUser = await User.findOne({email: body.email});
  if (!existingUser) {
    throw new NotFoundError('User not found.');
  }
  return existingUser;
}

module.exports.checkForExistingUser = async (body) => {
  const existingUser = await User.findOne({email: body.email});
  if (existingUser) {
    throw new ConflictError('User already exists.');
  }
}

module.exports.hashAndExtractUserFields = async (body) => {
  const passwordHash = await bcrypt.hash(body.password, 8);
  body.password = passwordHash;

  const userFields = extractValidFields(body, User);
  return userFields;
}

module.exports.createUser = async (userFields) => {
  const createdUser = await User.create(userFields);

  const response = {
    id: createdUser._id,
    links: {
      user: `/users/${createdUser._id}`
    }
  };

  return response;
}

module.exports.handleUserError = async (error) => {
  console.log('handleUserError: ', error);
  if (!(error instanceof ServerError)) {
    return new ServerError('An error occurred while creating a new User.');
  }
  return error;
}
