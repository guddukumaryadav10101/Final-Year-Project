// backend/middleware/auth.js (Approximate path)
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Pehle 'x-auth-token' check karo
  let token = req.header('x-auth-token');

  // 2. Agar nahi mila, toh 'Authorization' header check karo (Bearer token)
  if (!token && req.header('Authorization')) {
    token = req.header('Authorization').split(' ')[1]; // 'Bearer <token>' se token nikalo
  }

  // 3. Agar token ab bhi nahi hai
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};