const mongoose = require('mongoose');

// Schema Definition
const ResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mockTestName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    wrongAnswers: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Safe Export - Yahan dhyan dena, 'ResultSchema' upar wale se match hona chahiye
module.exports = mongoose.models.Result || mongoose.model('Result', ResultSchema);