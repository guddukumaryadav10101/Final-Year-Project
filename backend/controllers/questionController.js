// backend/controllers/questionController.js
const Question = require('../models/Question');

exports.bulkUploadQuestions = async (req, res) => {
  try {
    const { mockTestName, questions } = req.body;
    if (!mockTestName || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'mockTestName and questions array required' });
    }

    const sectionMarks = {
      'MATHS': {positive: 12, negative: 3},
      'REASONING': {positive: 6, negative: 1.5},
      'COMPUTER': {positive: 6, negative: 1.5},
      'ENGLISH': {positive: 4, negative: 1}
    };

    const formattedQuestions = questions.map(q => ({
      ...q,
      mockTestName,
      marks: sectionMarks[q.section] || {positive: 0, negative: 0}
    }));

    const result = await Question.insertMany(formattedQuestions);
    res.status(201).json({ success: true, msg: `Uploaded ${result.length} questions for ${mockTestName}`, count: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const { mockTestName } = req.query;
    if (!mockTestName) {
      return res.status(400).json({ error: 'mockTestName query param required' });
    }
    const questions = await Question.find({ mockTestName }).sort({ questionNumber: 1 });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateScore = async (req, res) => {
  try {
    const { mockTestName, userAnswers } = req.body; // {1: 'A', 2: 'B', ...}
    if (!mockTestName || !userAnswers) {
      return res.status(400).json({ error: 'mockTestName and userAnswers required' });
    }
    const questions = await Question.find({ mockTestName }).sort({ questionNumber: 1 });
    let score = 0;
    const details = [];
    questions.forEach(q => {
      const userAns = userAnswers[q.questionNumber];
      if (userAns === q.correctAnswer) {
        score += q.marks.positive;
        details.push({ qNum: q.questionNumber, status: 'correct', marks: q.marks.positive });
      } else if (userAns) {
        score -= q.marks.negative;
        details.push({ qNum: q.questionNumber, status: 'incorrect', marks: -q.marks.negative });
      } else {
        details.push({ qNum: q.questionNumber, status: 'unattempted', marks: 0 });
      }
    });
    res.json({ 
      success: true, 
      totalScore: score,
      totalQuestions: questions.length,
      details 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
