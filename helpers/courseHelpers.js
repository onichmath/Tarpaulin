const { PermissionError, ConflictError, ServerError, ValidationError, NotFoundError } = require('../utils/error.js');
const { Course } = require('../models/course.js');
const { createObjectCsvStringifier } = require('csv-writer');
const { Readable } = require('stream');
const { User } = require('../models/user.js');

module.exports.isCourseInstructor = (auth_role, user_id, course_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (auth_role == 'admin') {
        return resolve();
      }
      const course = await Course.findById(course_id);
      if (!course) {
        throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
      }
      if (course.instructorId != user_id) {
        throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
      }
      return resolve();
    } catch (error) {
      return reject(await this.handleCourseError(error));
    }
  })
}


module.exports.isAdmin = (auth_role) => {
  if (auth_role != 'admin') {
    throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
  }
}

module.exports.checkForExistingCourse = async (body) => {
  try {
    const existingCourse = await Course.findOne(body);
    if (existingCourse) {
      console.log('Course already exists.');
      throw new ConflictError('A course with the specified fields already exists.');
    }
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error;
    }
    throw new ValidationError('The request body was either not present or did not contain all the required fields.');
  }
}

module.exports.createCourse = async (courseFields) => {
  try {
    const createdCourse = await Course.create(courseFields);
    const response = {
      id: createdCourse._id,
      links: {
        course: `/courses/${createdCourse._id}`
      }
    };
    return response;
  } catch (error) {
    throw new ConflictError('A course with the specified fields already exists.');
  }
}

module.exports.updateEnrollmentForCourseId = async (id, body) => {
  try {
      if (!!body.add) {
        for (let studentId of body.add) {
          await Course.updateOne({ _id: id }, { $addToSet: { students: studentId } });
          await User.updateOne({ _id: studentId }, { $addToSet: { courses: id } });
        }
      }

      if (!!body.remove) {
        for (let studentId of body.remove) {
          await Course.updateOne({ _id: id }, { $pull: { students: studentId } });
          await User.updateOne({ _id: studentId }, { $pull: { courses: id } });
        }
      }
  } catch (error) {
    throw error;
  }
}


module.exports.generatePaginatedCourseLinks = (pageNumber, lastPage) => {
  const links = {};
  if (pageNumber < lastPage) {
    links.nextPage = `/courses?page=${pageNumber + 1}`;
    links.lastPage = `/courses?page=${lastPage}`;
  }
  if (pageNumber > 1) {
    links.prevPage = `/courses?page=${pageNumber - 1}`;
    links.firstPage = '/courses?page=1';
  }
  return links;
}

module.exports.mapCourses = (courses) => {
  return courses.map((course) => {
    return {
      id: course._id,
      title: course.title,
      subject: course.subject,
      number: course.number,
      term: course.term,
      instructorId: course.instructorId,
      links: {
        self: `/courses/${course._id}`
      }
    };
  });
}

module.exports.getCourseObjectById = async (id) => {
  try {
    const course = await Course.findById(id);
    return course;
  } catch (error) {
    throw new NotFoundError('Course not found.');
  }
}

module.exports.createAndStreamRoster = async (res, course, studentData) => {
  try {
    const csvHeaders = [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' }
    ];

    const csvStringifier = createObjectCsvStringifier({ header: csvHeaders });

    res.setHeader('Content-Type', 'text/csv');
    res.attachment(`${course.term}-${course.title}-roster.csv`);

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(studentData);
    const csvStream = new Readable();
    csvStream.push(csvContent);
    csvStream.push(null)
    csvStream.pipe(res).on('finish', () => Promise.resolve());
  } catch (error) {
    throw error;
  }
}

module.exports.getStudentDataByIds = async (studentIds) => {
  try {
    const students = await User.find({ _id: { $in: studentIds } });
    return students;
  } catch (error) {
    throw error;
  }
}

module.exports.calculatePagination = (page, numPerPage, totalItems) => {
  const coursePage = parseInt(page) || 1;
  const lastPage = Math.ceil(totalItems / numPerPage);
  const pageNumber = Math.min(Math.max(coursePage, 1), lastPage);
  const skip = (pageNumber - 1) * numPerPage;
  
  return { pageNumber, skip, lastPage };
};


module.exports.handleCourseError = async (error) => {
  console.error('Course Error: ', error);
  if (!(error instanceof ServerError)) {
    return new ServerError('An unexpected error occurred.');
  }
  return error;
}

