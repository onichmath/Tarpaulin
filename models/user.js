const mongoose = require('mongoose');

/*
 * Schema for a Tarpaulin User
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'instructor', 'student'],
        default: 'student'
    },
    courses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Course',
        default: [],
        required: false
    }
})
const User = mongoose.model('User', UserSchema)
exports.User = User
