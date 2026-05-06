const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Pehle 'x-auth-token' check karo
  let token = req.header('x-auth-token');

  // 2. Agar nahi mila, toh 'Authorization' header check karo (Bearer token)
  if (!token && req.header('Authorization')) {
    const authHeader = req.header('Authorization');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // 3. Agar token ab bhi nahi hai
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // FIX: Kyunki aapne login mein data direct sign kiya hai { id, role }
    // Isliye hum direct 'decoded' assign karenge, 'decoded.user' nahi.
    req.user = decoded; 
    
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};