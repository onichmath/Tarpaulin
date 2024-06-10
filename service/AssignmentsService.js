'use strict';


/**
 * Create a new Assignment.
 * Create and store a new Assignment with specified data and adds it to the application's database.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can create an Assignment. 
 *
 * body Assignment An Assignment object.
 * returns inline_response_201_2
 **/
exports.createAssignment = (body) => {
  return new Promise((resolve, reject) => {
    var examples = {};
    examples['application/json'] = {
  "id" : "123"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create a new Submission for an Assignment.
 * Create and store a new Assignment with specified data and adds it to the application's database.  Only an authenticated User with 'student' role who is enrolled in the Course corresponding to the Assignment's `courseId` can create a Submission. 
 *
 * body Submission A Submission object.
 * id id_6 Unique ID of an Assignment.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns inline_response_201_3
 **/
exports.createSubmission = (body,id) => {
  return new Promise((resolve, reject) => {
    var examples = {};
    examples['application/json'] = {
  "id" : "123"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Fetch data about a specific Assignment.
 * Returns summary data about the Assignment, excluding the list of Submissions. 
 *
 * id id_5 Unique ID of an Assignment.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns Assignment
 **/
exports.getAssignmentById = (id) => {
  return new Promise((resolve, reject) => {
    var examples = {};
    examples['application/json'] = {
  "due" : "2022-06-14T17:00:00-07:00",
  "title" : "Assignment 3",
  "courseId" : "123",
  "points" : 100
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Fetch the list of all Submissions for an Assignment.
 * Returns the list of all Submissions for an Assignment.  This list should be paginated.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can fetch the Submissions for an Assignment. 
 *
 * id id_6 Unique ID of an Assignment.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * page Integer Page of Submissions to fetch.  (optional)
 * studentId studentId Fetch assignments only for the specified student ID.  Exact type/format will depend on your implementation but will likely be either an integer or a string.  (optional)
 * returns inline_response_200_4
 **/
exports.getSubmissionsByAssignmentId = (id,page,studentId) => {
  return new Promise((resolve, reject) => {
    var examples = {};
    examples['application/json'] = {
  "submissions" : [ {
    "studentId" : "123",
    "file" : "file",
    "grade" : 94.5,
    "assignmentId" : "123",
    "timestamp" : "2022-06-14T17:00:00-07:00"
  }, {
    "studentId" : "123",
    "file" : "file",
    "grade" : 94.5,
    "assignmentId" : "123",
    "timestamp" : "2022-06-14T17:00:00-07:00"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Remove a specific Assignment from the database.
 * Completely removes the data for the specified Assignment, including all submissions.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can delete an Assignment. 
 *
 * id id_5 Unique ID of an Assignment.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/
exports.removeAssignmentsById = (id) => {
  return new Promise((resolve, reject) => {
    resolve();
  });
}


/**
 * Update data for a specific Assignment.
 * Performs a partial update on the data for the Assignment.  Note that submissions cannot be modified via this endpoint.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can update an Assignment. 
 *
 * body Assignment Partial updates to be applied to the specified Assignment.

 * id id_5 Unique ID of an Assignment.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/
exports.updateAssignmentById = (body,id) => {
  return new Promise((resolve, reject) =>  {
    resolve();
  });
}

