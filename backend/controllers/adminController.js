const xlsx = require('xlsx');
const Question = require('../models/Question');
const MockTest = require('../models/MockTest');

// Export 1
exports.uploadExcel = async (req, res) => {
    try {
        res.status(200).json({ msg: "Questions logic working" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export 2
exports.createMockWithExcel = async (req, res) => {
    try {
        res.status(200).json({ msg: "Mock logic working" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};