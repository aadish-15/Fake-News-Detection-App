from flask import Flask, request, jsonify
from flask_cors import CORS
from model_service import predict_news

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {
        "status": "working",
        "message": "Fake News Detection API"
    }

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({
            "error": "No text provided"
        }), 400

    result = predict_news(text)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)