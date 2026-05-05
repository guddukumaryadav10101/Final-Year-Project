const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const xlsx = require('xlsx');

// 1. STATS
exports.stats = async (req, res) => {
  try {
    const [totalUsers, totalTests, totalResults] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Question.distinct('mockTestName'),
      Result.countDocuments()
    ]);
    res.json({ success: true, data: { users: totalUsers, tests: totalTests.length, results: totalResults } });
  } catch (err) { res.status(500).json({ msg: "Stats failed" }); }
};

// 2. TEST SUMMARY (Ye missing tha isliye crash ho raha tha)
exports.getTestSummary = async (req, res) => {
  try {
    const summary = await Question.aggregate([
      { $group: { _id: "$mockTestName", totalQuestions: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: summary });
  } catch (err) { res.status(500).json({ msg: "Summary failed" }); }
};

// 3. DROP-DOWN LIST
exports.getMockList = async (req, res) => {
  try {
    const mocks = await Question.distinct('mockTestName');
    res.json({ success: true, data: mocks });
  } catch (err) { res.status(500).json({ success: false }); }
};

// 4. GET QUESTIONS BY NAME
exports.getMockQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ mockTestName: req.params.name }).sort({ questionNumber: 1 });
    res.json({ success: true, data: questions });
  } catch (err) { res.status(500).json({ success: false }); }
}

// 5. MANUAL UPLOAD/UPDATE (UPSERT)
exports.uploadManual = async (req, res) => {
  try {
    const { mockTestName, questions } = req.body;
    const operations = questions.map((q) => ({
      updateOne: {
        filter: { mockTestName: mockTestName.trim(), questionNumber: Number(q.questionNumber) },
        update: { $set: { ...q, mockTestName: mockTestName.trim() } },
        upsert: true
      }
    }));
    await Question.bulkWrite(operations);
    res.json({ success: true, msg: "Database Synced! 🚀" });
  } catch (err) { res.status(500).json({ error: "Sync Failed" }); }
};

// 6. EXCEL UPLOAD
exports.createMockWithExcel = async (req, res) => {
  try {
    const { mockTestName } = req.body;
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const operations = data.map((item) => ({
      updateOne: {
        filter: { mockTestName: mockTestName.trim(), questionNumber: Number(item.questionNumber) },
        update: { $set: { text: item.text, options: [item.A, item.B, item.C, item.D], correctAnswer: item.correctAnswer, section: item.section } },
        upsert: true
      }
    }));
    await Question.bulkWrite(operations);
    res.json({ success: true, msg: "Excel Synced!" });
  } catch (err) { res.status(500).json({ error: "Excel Failed" }); }
};

// 7. USER MANAGEMENT
exports.getUsers = async (req, res) => {
  const users = await User.find({ role: 'student' }).select('-password');
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User removed" });
};

// 8. DELETE MOCK
exports.deleteMock = async (req, res) => {
  await Question.deleteMany({ mockTestName: req.params.name });
  res.json({ success: true, msg: "Mock Deleted" });
};

// 9. ANALYTICS
exports.analytics = async (req, res) => {
  const results = await Result.find().populate('user', 'name email');
  res.json({ success: true, data: results });
};