import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

vectorizer = joblib.load(MODELS_DIR / "vectorizer.pkl")
lr = joblib.load(MODELS_DIR / "logistic.pkl")
dt = joblib.load(MODELS_DIR / "decision_tree.pkl")
rf = joblib.load(MODELS_DIR / "random_forest.pkl")
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

    # Probability of class 1 (Real News)
    lr_prob = float(lr.predict_proba(transformed_text)[0][1]) * 100
    dt_prob = float(dt.predict_proba(transformed_text)[0][1]) * 100
    rf_prob = float(rf.predict_proba(transformed_text)[0][1]) * 100
    gb_prob = float(gb.predict_proba(transformed_text)[0][1]) * 100

    # Ensemble score
    overall_score = (
        lr_prob +
        dt_prob +
        rf_prob +
        gb_prob
    ) / 4

    # Final verdict
    verdict = (
        "Likely Real"
        if overall_score >= 50
        else "Likely Fake"
    )

    return {
        "overall_score": round(overall_score, 2),
        "verdict": verdict,
        "models": {
            "logistic_regression": round(lr_prob, 2),
            "decision_tree": round(dt_prob, 2),
            "random_forest": round(rf_prob, 2),
            "gradient_boost": round(gb_prob, 2)
        }
    }

    return {
        "lr": round(lr_prob * 100, 2),
        "dt": round(dt_prob * 100, 2),
        "rf": round(rf_prob * 100, 2),
        "gb": round(gb_prob * 100, 2)
    }

print("Models loaded successfully")