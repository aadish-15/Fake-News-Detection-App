import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

vectorizer = joblib.load(MODELS_DIR / "vectorizer.pkl")
lr = joblib.load(MODELS_DIR / "logistic.pkl")
dt = joblib.load(MODELS_DIR / "decision_tree.pkl")
gb = joblib.load(MODELS_DIR / "gradient_boost.pkl")

import re
import string
def wordopt(text):
    text = text.lower()
    text = re.sub('\\[.*?\\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\\S+|www\\.\\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\\w*\\d\\w*', '', text)
    return text

def predict_news(text):
    """
    Predict whether news content is real or fake using
    four trained models and an ensemble score.
    """
    # Clean text
    cleaned_text = wordopt(text)

    # Convert to TF-IDF features
    transformed_text = vectorizer.transform([cleaned_text])

    # Probability of Real News (class = 1)
    lr_prob = float(lr.predict_proba(transformed_text)[0][1]) * 100
    dt_prob = float(dt.predict_proba(transformed_text)[0][1]) * 100
    gb_prob = float(gb.predict_proba(transformed_text)[0][1]) * 100

    # Ensemble Score
    overall_score = (
        lr_prob +
        dt_prob +
        gb_prob
    ) / 3

    # Verdict
    verdict = (
        "Likely Real"
        if overall_score >= 50
        else "Likely Fake"
    )

    # Confidence Level
    distance = abs(overall_score - 50)

    if distance >= 40:
        confidence = "Very High"
    elif distance >= 25:
        confidence = "High"
    elif distance >= 10:
        confidence = "Medium"
    else:
        confidence = "Low"

    # Model Agreement
    votes = [
        lr_prob >= 50,
        dt_prob >= 50,
        gb_prob >= 50
    ]

    agreement_count = max(
        votes.count(True),
        votes.count(False)
    )
    return {
        "overall_score": round(overall_score, 2),
        "verdict": verdict,
        "confidence": confidence,
        "agreement": f"{agreement_count}/3",
        "models": {
            "logistic_regression": round(lr_prob, 2),
            "decision_tree": round(dt_prob, 2),
            "gradient_boost": round(gb_prob, 2)
        }
    }

print("Models loaded successfully")