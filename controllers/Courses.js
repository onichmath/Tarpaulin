'use strict';

var utils = require('../utils/writer.js');
var Courses = require('../service/CoursesService');

module.exports.createCourse = function createCourse (req, res, next, body) {
  Courses.createCourse(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllCourses = function getAllCourses (req, res, next, page, subject, number, term) {
  Courses.getAllCourses(page, subject, number, term)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAssignmentsByCourseId = function getAssignmentsByCourseId (req, res, next, id) {
  Courses.getAssignmentsByCourseId(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCourseById = function getCourseById (req, res, next, id) {
  Courses.getCourseById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getRosterByCourseId = function getRosterByCourseId (req, res, next, id) {
  Courses.getRosterByCourseId(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getStudentsByCourseId = function getStudentsByCourseId (req, res, next, id) {
  Courses.getStudentsByCourseId(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removeCourseById = function removeCourseById (req, res, next, id) {
  Courses.removeCourseById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateCourseById = function updateCourseById (req, res, next, body, id) {
  Courses.updateCourseById(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateEnrollmentByCourseId = function updateEnrollmentByCourseId (req, res, next, body, id) {
  Courses.updateEnrollmentByCourseId(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
