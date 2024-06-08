const jwt = require('jsonwebtoken')
require('dotenv').config();
const { User } = require('../models/user')
const secret_key = process.env.JWT_SECRET


function generateToken(user_id) {
    return jwt.sign({ user_id }, secret_key, { expiresIn: '24h' });
}
