const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mockTestName: { type: String, required: true, index: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    unanswered: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    status: { type: String, enum: ['Pass', 'Fail'], required: true },
    date: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.models.Result || mongoose.model('Result', ResultSchema);