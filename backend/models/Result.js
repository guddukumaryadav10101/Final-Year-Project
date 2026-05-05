const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    testId: { type: String, required: true },
    totalScore: { type: Number, required: true },
    rank: { type: Number },
    subjectScores: {
        maths: Number,
        reasoning: Number,
        computer: Number,
        english: Number
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);