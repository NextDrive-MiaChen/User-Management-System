const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const verifyToken = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({
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
            message: "User not found or not authenticated!"
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

const authJwt = {
    verifyToken: verifyToken,
};

module.exports = authJwt;