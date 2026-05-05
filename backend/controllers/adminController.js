const User = require('../models/User');
const Result = require('../models/Result');
const Question = require('../models/Question');

// 1. DASHBOARD STATS (Total original counts)
exports.stats = async (req, res) => {
  try {
    const [totalStudents, mockNames, totalQuestions, scoreStats] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Question.distinct('mockTestName'),
      Question.countDocuments(),
      Result.aggregate([{ $group: { _id: null, avg: { $avg: '$totalScore' } } }])
    ]);

    res.json({ 
      totalStudents, 
      activeTests: mockNames.length, 
      avgScore: scoreStats[0]?.avg ? Number(scoreStats[0].avg.toFixed(1)) : 0,
      totalQuestions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. ANALYTICS (For Line & Bar Charts)
exports.analytics = async (req, res) => {
  try {
    // Line Chart: Last 7 days attempts count logic
    const lineData = await Result.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
      { $project: { day: "$_id", attempts: 1, _id: 0 } }
    ]);

    // Bar Chart: Question distribution per section
    const barData = await Question.aggregate([
      { $group: { _id: '$section', count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } }
    ]);

    res.json({ lineChartData: lineData, barData: barData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. TEST SUMMARY (Bar Chart for Mock Sets)
exports.getTestSummary = async (req, res) => {
  try {
    const summary = await Question.aggregate([
      { $group: { _id: '$mockTestName', count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { name: 1 } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. USER MANAGEMENT
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }, 'fullName email createdAt')
      .sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. MOCK TEST MANAGEMENT
exports.getMocks = async (req, res) => {
  try {
    const mocks = await Question.aggregate([
      { $group: { _id: "$mockTestName", totalQuestions: { $sum: 1 } } },
      { $project: { name: "$_id", totalQuestions: 1, _id: 0 } }
    ]);
    res.json(mocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMockQuestions = async (req, res) => {
  try {
    const { name } = req.params;
    const questions = await Question.find({ mockTestName: name }).sort({ questionNumber: 1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMock = async (req, res) => {
  try {
    const result = await Question.deleteMany({ mockTestName: req.params.name });
    res.json({ success: true, msg: `Deleted ${result.deletedCount} questions` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dummy placeholders for Multer upload (Logic should be in separate Excel helper)
exports.uploadExcel = (req, res) => res.json({ msg: "API Connected" });
exports.createMockWithExcel = (req, res) => res.json({ msg: "API Connected" });