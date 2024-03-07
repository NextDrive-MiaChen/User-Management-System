const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function authenticateUser(usermail, password) {
    try {
        const query = 'SELECT * FROM auth WHERE usermail = $1';
        const result = await pool.query(query, [usermail]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }
        return user;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw new Error('An error occurred while authenticating user.');
    }
}

function generateAccessToken(auth) {
    return jwt.sign({ userId: auth.id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

module.exports = {
    authenticateUser,
    generateAccessToken
};
