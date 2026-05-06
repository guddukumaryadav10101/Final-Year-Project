const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER LOGIC ---
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists, Bhai!' });

    user = new User({ fullName, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};



// --- IMPROVED LOGIN LOGIC ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if it's the master admin
    if(email === 'admin@gmail.com' && password === 'admin123') {
      let adminUser = await User.findOne({ email: 'admin@gmail.com' });
      
      // Agar ye admin database mein nahi hai, toh register kar do
      if (!adminUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        adminUser = new User({ 
          fullName: 'System Admin', 
          email: 'admin@gmail.com', 
          password: hashedPassword,
          role: 'admin' 
        });
        await adminUser.save();
      }

      // Naya Token asli Database ID ke saath
      const token = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ 
        token, 
        user: { id: adminUser._id, fullName: adminUser.fullName, role: 'admin' } 
      });
    }

    // ... baaki normal user login logic waisa hi rahega
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });

  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};