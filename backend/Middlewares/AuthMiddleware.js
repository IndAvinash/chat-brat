const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token
  const email = req.headers['email']; // Extract email from headers
  const pass = await User.getPass(email);
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, pass, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user; // Attach decoded user data to request
    next();
  });
};

module.exports = { authenticateToken };