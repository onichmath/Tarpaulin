const jwt = require('jsonwebtoken')
require('dotenv').config();
const { User } = require('../models/user')
const secret_key = process.env.JWT_SECRET

function generateToken(user_id) {
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

            User.findByPk(userId, { attributes: ['role'] })
                .then(user => {
                    if (!user) {
                        throw new Error('User not found: ' + userId);
                    }
                    body.auth_role = user.role;
                    resolve();
                })
                .catch(error => {
                    console.error('Error finding user: ', error);
                    body.auth_role = 'student';
                    resolve();
                });
        } catch (error) {
            body.auth_role = 'student';
            resolve();
        }
    });
}
module.exports = { generateToken, requireAuth, checkPermissions }
