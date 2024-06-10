// Authorization 


const jwt = require('jsonwebtoken')
require('dotenv').config();
const { User } = require('../models/user');
const { PermissionError } = require('./error');
const secret_key = process.env.JWT_SECRET

function generateToken(user_id) {
    // Generate promise for JWT token for authentication
    return new Promise((resolve, reject) => {
        jwt.sign({ user_id }, secret_key, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function requireAuth(req, res, next) {
    // Swagger autogenerated function to check for authorization, currently unused
    return new Promise(async (resolve, reject) => {
        try {
            const auth_header = req.get('Authorization') || '';
            const header_parts = auth_header.split(' ');
            const token = header_parts[0] == "Bearer"? header_parts[1]: null;
            const payload = jwt.verify(token, secret_key);
            req.user_id = payload.user_id;
        } catch (err) {
            console.error('  -- error:', err);
            return reject(new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.'));
        }
        return resolve();
    });
}

function checkPermissions(req, res, next) {
    // Checks if a user has the proper user permissions 
    // If so, resolves as normal. Else, it sends back their authorization as student.
    return new Promise((resolve, reject) => {
        const auth_header = req.get('Authorization') || '';
        const header_parts = auth_header.split(' ');
        const token = header_parts[0] == "Bearer" ? header_parts[1] : null;

        try {
            if (!token) {
                throw new Error('Missing token');
            }

            const payload = jwt.verify(token, secret_key);
            const userId = payload.user_id;

            User.findOne({_id: userId})
                .then((user) => {
                    if (!user) {
                        throw new Error('User not found: ' + userId);
                    }
                    req.auth_role = user.role;
                    return resolve();
                })
        } catch (error) {
            console.error('Error with token: ', error);
            req.auth_role = 'student';
            return resolve();
        }
    });
}
module.exports = { generateToken, requireAuth, checkPermissions }
