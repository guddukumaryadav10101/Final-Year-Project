const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Logic
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body; // Frontend se 'fullName' aayega

    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists, Bhai!' });

    // 2. Create User instance
    user = new User({ fullName, email, password });

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Login Logic
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded Admin
    if(email === 'admin@gmail.com') {
      if(password !== 'admin123') {
        return res.status(400).json({ msg: 'Invalid admin credentials' });
      }
      const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ 
        token, 
        user: { id: 'admin', fullName: 'System Admin', role: 'admin' } 
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { id: user._id, fullName: user.fullName, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
