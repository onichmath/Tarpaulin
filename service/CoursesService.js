'use strict';

const { Course } = require('../models/course.js');
const { Assignment } = require('../models/assignment.js');
const { User } = require('../models/user.js');
const { validateAgainstModel, extractValidFields } = require('../utils/validation.js');
const { ValidationError, PermissionError, ConflictError, ServerError, NotFoundError} = require('../utils/error.js');



/**
 * Create a new course.
 * Creates a new Course with specified data and adds it to the application's database.  Only an authenticated User with 'admin' role can create a new Course. 
 *
 * body Course A Course object.
 * returns inline_response_201_1
 **/

exports.createCourse = (body) => {
  //untested
  return new Promise(async (resolve, reject) => {
    try{
      const {role, auth_role} = body;

      if (typeof(role) != 'string' || typeof(auth_role) != 'string') {
        throw new ValidationError('The request body was either not present or did not contain a valid User object.');
      }

      if (auth_role != 'admin' && role == 'admin') { //difference between role and auth_role?
        throw new PermissionError('The request was not authorized.');
      }

      const courseFields = extractValidFields(body, Course);
      const createdCourse = await Course.create(courseFields);
      const response = {
        id: createdCourse._id
      };

      resolve(response);

    }
    catch (error) {
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }
    //commented out example endpoint. Requires removing of try/catch
//     var examples = {};
//     examples['application/json'] = {
//   "id" : "123"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
  });
}


/**
 * Fetch the list of all Courses.
 * Returns the list of all Courses.  This list should be paginated.  The Courses returned should not contain the list of students in the Course or the list of Assignments for the Course. 
 *
 * page Integer Page of Courses to fetch.  (optional)
 * subject String Fetch only Courses with the specified subject code.  (optional)
 * number String Fetch only Courses with the specified course number.  (optional)
 * term String Fetch only Courses in the specified academic term.  (optional)
 * returns inline_response_200_1
 **/

exports.getAllCourses = (page,subject,number,term) => {
  //unfinished
  return new Promise(async (resolve, reject) => {
    try{
      let coursePage = parseInt(page) || 1;
      const numPerPage = 10;
      lengthOfCourses = await Course.countDocuments({}).count().exec()
      const lastPage = Math.ceil(lengthOfCourses / numPerPage);
      coursePage = coursePage > lastPage ? lastPage : coursePage;
      coursePage = coursePage < 1 ? 1 : coursePage;
    
      /*
       * Calculate starting and ending indices of courses on requested page and
       * slice out the corresponsing sub-array of courses.
       */
      const start = (coursePage - 1) * numPerPage;
      const end = start + numPerPage;
      const pageBusinesses = Business.slice(start, end); //???
    
      /*
       * Generate HATEOAS links for surrounding pages.
       */
      const links = {};
      if (page < lastPage) {
        links.nextPage = `/courses?page=${page + 1}`;
        links.lastPage = `/courses?page=${lastPage}`;
      }
      if (page > 1) {
        links.prevPage = `/courses?page=${page - 1}`;
        links.firstPage = '/courses?page=1';
      }
    
      /*
       * Construct and send response.
       */
      res.status(200).json({
        course: pageBusinesses, //???
        pageNumber: coursePage,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: lengthOfCourses,
        links: links
      });
  
    }
    catch{
  
    }

//     var examples = {};
//     examples['application/json'] = {
//   "courses" : [ {
//     "number" : "493",
//     "subject" : "CS",
//     "term" : "sp22",
//     "title" : "Cloud Application Development",
//     "instructorId" : "123"
//   }, {
//     "number" : "493",
//     "subject" : "CS",
//     "term" : "sp22",
//     "title" : "Cloud Application Development",
//     "instructorId" : "123"
//   } ]
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
  });
}


/**
 * Fetch a list of the Assignments for the Course.
 * Returns a list containing the Assignment IDs of all Assignments for the Course. 
 *
 * id id_4 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns inline_response_200_3
 **/

exports.getAssignmentsByCourseId = (id) => {
  return new Promise(async (resolve, reject) => {
      //Untested/ likely unfinished
    try{
      const courseExist = await Course.countDocuments({id: id }).count().exec(); //ensure id exists
      if (courseExist != 1){
        throw new NotFoundError('Course not found.');
      }
      //not sure if assignment count is necessary
      //const assignmentCount = await Assignment.countDocuments({courseId: id }).count().exec()

      //check all assignments and find all that match, and store them into a variable?
      const foundAssignments = await Assignment.find({courseId: id})
      // Should I push them into a array and then put t into a response?
      // for (let i = 0; i < foundAssignments.length; i++) {
      //   ???
      // } 

      const response = {
        courseId: id,
        assignments: foundAssignments
      };
      resolve(response);

    }
    catch (error) {
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }

// Keeping around just in case
//     var examples = {};
//     examples['application/json'] = {
//   "assignments" : [ {
//     "due" : "2022-06-14T17:00:00-07:00",
//     "title" : "Assignment 3",
//     "courseId" : "123",
//     "points" : 100
//   }, {
//     "due" : "2022-06-14T17:00:00-07:00",
//     "title" : "Assignment 3",
//     "courseId" : "123",
//     "points" : 100
//   } ]
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
  });
}


/**
 * Fetch data about a specific Course.
 * Returns summary data about the Course, excluding the list of students enrolled in the course and the list of Assignments for the course. 
 *
 * id id_1 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns Course
 **/

exports.getCourseById = (id) => {
  return new Promise(async (resolve, reject) => {
    //Untested
    try{
      const courseExist = await Course.countDocuments({id: id }).count().exec(); //ensure id exists
      if (courseExist != 1){
        throw new NotFoundError('Course not found.');
      }
      //does it need error checking if in try/except block?
      const foundCourse = await Course.findById({id: id})
      const response = {
        id: foundCourse._id,
        subject: foundCourse.subject,
        number: foundCourse.number,
        title: foundCourse.title,
        term: foundCourse.term,
        instructorId: foundCourse.instructorId
      };
      resolve(response)
      
    }
    catch (error){
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }

    //prior example code, keeping around until tested
//     var examples = {};
//     examples['application/json'] = {
//   "number" : "493",
//   "subject" : "CS",
//   "term" : "sp22",
//   "title" : "Cloud Application Development",
//   "instructorId" : "123"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
  });
}


/**
 * Fetch a CSV file containing list of the students enrolled in the Course.
 * Returns a CSV file containing information about all of the students currently enrolled in the Course, including names, IDs, and email addresses.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can fetch the course roster. 
 *
 * id id_3 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns String
 **/

exports.getRosterByCourseId = (id) => {
  return new Promise(async (resolve, reject) => {
    //Unfinished
    try{
      const courseExist = await Course.countDocuments({id: id }).count().exec(); //ensure id exists
      if (courseExist != 1){
        throw new NotFoundError('Course not found.');
      }
      //find all students related to course
      const foundStudents = await User.find({courseId: id, role: "student"})

      //LOGIC TO LOOP THROUGH AND ADD THEM TO CSV FILE HERE
    }
    catch (error) {
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }
    //example kept for testing purposes
    // var examples = {};
    // examples['application/json'] = "123,\"Jane Doe\",doej@oregonstate.edu\n...\n";
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}


/**
 * Fetch a list of the students enrolled in the Course.
 * Returns a list containing the User IDs of all students currently enrolled in the Course.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can fetch the list of enrolled students. 
 *
 * id id_2 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns inline_response_200_2
 **/

exports.getStudentsByCourseId = (id) => {
  return new Promise(async (resolve, reject) => {
    //Unfinished
    try{
      const courseExist = await Course.countDocuments({id: id }).count().exec(); //ensure id exists
      if (courseExist != 1){
        throw new NotFoundError('Course not found.');
      }
      const foundStudents = await User.find({courseId: id, role: "student"})

      const response = {
        courseId: id,
        students: foundStudents
      };
      resolve(response);
    }
    catch (error) {
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }
    //keeping for testing purposes
//     var examples = {};
//     examples['application/json'] = {
//   "students" : [ {
//     "password" : "hunter2",
//     "role" : "student",
//     "name" : "Jane Doe",
//     "email" : "doej@oregonstate.edu"
//   }, {
//     "password" : "hunter2",
//     "role" : "student",
//     "name" : "Jane Doe",
//     "email" : "doej@oregonstate.edu"
//   } ]
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
  });
}


/**
 * Remove a specific Course from the database.
 * Completely removes the data for the specified Course, including all enrolled students, all Assignments, etc.  Only an authenticated User with 'admin' role can remove a Course. 
 *
 * id id_1 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/

exports.removeCourseById = (id) => {
  return new Promise(async (resolve, reject) => {
    //Untested
    try{
      const courseExist = await Course.countDocuments({_id: id }).count().exec(); //ensure id exists
      if (courseExist != 1){
        throw new NotFoundError('Course not found.');
      }
      await Course.deleteOne(id);
    }
    catch (error){
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }

  });
}


/**
 * Update data for a specific Course.
 * Performs a partial update on the data for the Course.  Note that enrolled students and assignments cannot be modified via this endpoint.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can update Course information. 
 *
 * body Course Partial updates to be applied to the specified Course.

 * id id_1 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/

exports.updateCourseById = (body,id) => {
  return new Promise(async (resolve, reject) => {
    //Untested
    try{
      const {role, auth_role} = body;
      if (typeof(role) != 'string' || typeof(auth_role) != 'string') {
        throw new ValidationError('The request body was either not present or did not contain a valid User object.');
      }
      if (auth_role != 'admin') { //difference between role and auth_role?
        throw new PermissionError('The request was not authorized.');
      }

      const courseFields = extractValidFields(body, Course);
      const updatedCourse = await Course.updateOne({_id: id }, courseFields); // This might not be the exact way to do this
      const response = {
        id: updatedCourse._id,
        subject: updatedCourse.subject,
        number: updatedCourse.number,
        title: updatedCourse.title,
        term: updatedCourse.term,
        instructorId: updatedCourse.instructorId
      };

      resolve(response);
    }
    catch (error) {
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }

  });
}


/**
 * Update enrollment for a Course.
 * Enrolls and/or unenrolls students from a Course.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can update the students enrolled in the Course. 
 *
 * body Id_students_body Arrays of User IDs for students to be enrolled/unenrolled in the Course.  Exact type/format of IDs will depend on your implementation but each will likely be either an integer or a string.

 * id id_2 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/

exports.updateEnrollmentByCourseId = (body,id) => {
  return new Promise(async (resolve, reject) => {
    //Untested
    try{
      //NEEDS TO UPDATE TO HAVE AUTHORIZATION AS RELEVANT INSTRUCTOR OR ADMIN
      const courseExist = await Course.countDocuments({_id: id }).count().exec(); //ensure id exists
      if (courseExist != 1){
        throw new NotFoundError('Course not found.');
      }
      const {role, auth_role} = body;
      if (typeof(role) != 'string' || typeof(auth_role) != 'string') {
        throw new ValidationError('The request body was either not present or did not contain a valid User object.');
      }
      if (auth_role != 'admin' || (auth_role != 'instructor')) { //difference between role and auth_role?
        throw new PermissionError('The request was not authorized.');
      }



      for (let i = 0; i < body["add"].length; i++) {
        //add user onto courses students array(push operator?)
        await Courses.updateOne({_id: id}, {$push: {students: body["add"][i].push}})
        //add course to student courses array
        await User.updateOne({_id: body["add"][i]}, {$push: {courses: body["add"][i]}})
      }
      for (let i = 0; i < body["remove"].length; i++) {
        //remove user onto courses students array(push operator?)
        await Courses.updateOne({_id: id}, {$pull: {students: body["add"][i].push}})
        //remove course to student courses array
        await User.updateOne({_id: body["add"][i]}, {$push: {courses: body["add"][i]}})
      } 
      resolve();
    }
    catch (error) {
      console.log(error)
      if (!(error instanceof ServerError)) {
        return reject(new ServerError('An error occurred while creating a new User.'));
      }
      return reject(error);
    }
  });
}

