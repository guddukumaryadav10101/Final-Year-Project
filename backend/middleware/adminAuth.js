// Simple hardcoded Basic Auth for admin upload
// Username: admin | Password: password123

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Access denied. No credentials provided.' });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username === 'admin' && password === 'password123') {
    return next();
  }

  res.status(401).json({ error: 'Invalid credentials. Admin: password123' });
};

module.exports = adminAuth;

