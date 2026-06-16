import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeContent = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
          }),
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1>Fake News Detection</h1>

      <p>
        Analyze news articles using an ensemble of machine learning models.
      </p>

      <textarea
        placeholder="Paste article text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: "250px",
          marginTop: "20px",
          padding: "15px",
          fontSize: "16px",
          borderRadius: "10px",
          resize: "vertical",
        }}
      />

      <button
        onClick={analyzeContent}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "10px",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Content"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            border: "1px solid #444",
            borderRadius: "12px",
            textAlign: "left",
          }}
        >
          <h2>{result.verdict}</h2>

          <h3>
            Overall Score: {result.overall_score}%
          </h3>

          <hr />

          <h3>Model Breakdown</h3>

          <p>
            Logistic Regression:{" "}
            {result.models.logistic_regression}%
          </p>

          <p>
            Decision Tree:{" "}
            {result.models.decision_tree}%
          </p>

          <p>
            Gradient Boost:{" "}
            {result.models.gradient_boost}%
          </p>
        </div>
      )}
    </div>
  );
}

export default App;