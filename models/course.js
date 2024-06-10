const mongoose = require('mongoose');

/*
 * Schema for a Tarpaulin Course
 */
const CourseSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    number: {
        type: String, // String in OpenAPI but should this be a number?
        required: true,
        trim: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    term: { // example: sp22
        type: String,
        required: true,
        trim: true
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Add middleware later to ensure this user is an instructor
        required: true
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
        required: false
    }
})
const Course = mongoose.model('Course', CourseSchema)
exports.Course = Course
