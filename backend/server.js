const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load Config & Connect DB
dotenv.config();
connectDB();

const app = express();

// 2. Middlewares
app.use(cors());
// Body limit badha di hai taaki heavy Excel upload crash na kare
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Basic Health Check
app.get('/', (req, res) => res.send('NIMCET Mock Analyser API Running...'));

// 4. Routes Registration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));

// 5. Global Error Handler (Loopholes band karne ke liye)
// Isse agar server pe koi crash hota hai toh frontend ko clear message milega
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    msg: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));