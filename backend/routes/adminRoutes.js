const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Destructuring import
const adminController = require('../controllers/adminController');

// Logging for debugging (Terminal mein check karne ke liye)
console.log("Controller methods:", Object.keys(adminController));

// Routes
router.post('/upload-questions', upload.single('file'), adminController.uploadExcel);
router.post('/create-mock', upload.single('file'), adminController.createMockWithExcel);


module.exports = router;