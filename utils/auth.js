const jwt = require('jsonwebtoken')
require('dotenv').config();
const { User } = require('../models/user')
const secret_key = process.env.JWT_SECRET


function generateToken(user_id) {
    return jwt.sign({ user_id }, secret_key, { expiresIn: '24h' });
}

function requireAuth(req, res, next) {
    const auth_header = req.get('Authorization') || '';
    const header_parts = auth_header.split(' ');
    const token = header_parts[0] == "Bearer"? header_parts[1]: null;

    try {
        const payload = jwt.verify(token, secret_key);
        req.user_id = payload.user_id;
    } catch (err) {
        res.status(401).json({"error": "The specified credentials were invalid."});
    }
    next();
}

function checkPermissions(req, res, next, body) {
    const auth_header = req.get('Authorization') || '';
    const header_parts = auth_header.split(' ');
    const token = header_parts[0] == "Bearer"? header_parts[1]: null;

    try {
        if (!token) {
            throw new Error('Missing token');
        }

        const payload = jwt.verify(token, secret_key);
        const userId = payload.user_id;

        User.findByPk(userId, { attributes: ['role'] })
            .then(user => {
                if (!user) {
                    throw new Error('User not found: ' + userId);
                }
                body.auth_role = user.role;
                next();
            })
            .catch(error => {
                body.auth_role = 'student';
                next();
            });
    } catch (error) {
        console.error('Error checking permission: ', error);
        body.auth_role = 'student';
        next();
    }
}

module.exports = { generateToken, requireAuth, checkPermissions }
