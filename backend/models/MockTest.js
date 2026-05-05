const mongoose = require('mongoose');

const MockTestSchema = new mongoose.Schema({
    testName: { type: String, required: true }, // Example: "NIMCET Mock #01"
    totalQuestions: { type: Number, default: 120 },
    sections: {
        mathematics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
        reasoning: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
        computer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
        english: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockTest', MockTestSchema);