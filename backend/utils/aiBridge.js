const axios = require('axios');

const getRankPrediction = async (score) => {
    try {
        const response = await axios.post(`${process.env.FLASK_AI_URL}/api/predict`, {
            score: score
        });
        return response.data;
    } catch (error) {
        console.error("AI Service Error:", error.message);
        return { predicted_rank: "N/A", admission_probability: "Pending" };
    }
};

module.exports = getRankPrediction;