from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import scipy as sp

app = Flask(__name__)
CORS(app)

def calculate_predicted_rank(score):
    """
    NIMCET Trend Analysis Logic:
    Full Marks: 1000
    Top Rank (AIR 1): ~850+
    NIT Seat Boundary: ~450+
    """
    if score >= 800:
        return np.random.randint(1, 50)
    elif score >= 600:
        return np.random.randint(51, 500)
    elif score >= 450:
        return np.random.randint(501, 1500)
    else:
        # Rank prediction formula based on common bell curve
        rank = 10000 - (score * 10)
        return max(1501, int(rank))

@app.route('/api/predict', methods=['POST'])
def predict_rank():
    try:
        data = request.get_json()
        total_score = data.get('score', 0)
        
        predicted_rank = calculate_predicted_rank(total_score)
        
        # Determining College Probability
        status = "Top NIT" if predicted_rank <= 500 else "Other NIT/HBTU" if predicted_rank <= 1500 else "Private/Lower NIT"
        
        return jsonify({
            "predicted_rank": predicted_rank,
            "admission_probability": status,
            "score_analyzed": total_score
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)