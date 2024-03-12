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

function verifyToken(req, res, next) {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        message: "Your are not authenticated!"
      });
    }
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token is not valid!"
        });
      }
      try {
          const query = 'SELECT * FROM auth WHERE id = $1';
          const result = await pool.query(query, [decoded.id]);
          const user = result.rows[0];
          if (!user) {
            return res.status(401).send({
              message: "User not found!"
            });
          }
        req.user = user;
        next();
      } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'An error occurred while retrieving user information.' });
      }
    });
  };

module.exports = {
    authenticateUser,
    generateAccessToken,
    verifyToken
};
