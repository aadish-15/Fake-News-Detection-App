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

const isReal = result?.verdict === "Likely Real";

const verdictColor = isReal
? "#22c55e"
: "#ef4444";

const score = result?.overall_score || 0;

const confidenceColor =
result?.confidence === "Very High"
? "#22c55e"
: result?.confidence === "High"
? "#84cc16"
: result?.confidence === "Medium"
? "#f59e0b"
: "#ef4444";

return (
<div
style={{
maxWidth: "900px",
margin: "0 auto",
padding: "40px",
textAlign: "center",
}}
> <h1>Fake News Detection</h1>

  <p>
    Analyze news articles using an ensemble of machine
    learning models.
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

  <p
    style={{
      marginTop: "10px",
      opacity: 0.7,
      fontSize: "14px",
    }}
  >
    Characters: {text.length}
  </p>

  <button
    onClick={analyzeContent}
    disabled={loading}
    style={{
      marginTop: "20px",
      padding: "12px 24px",
      fontSize: "16px",
      cursor: loading ? "not-allowed" : "pointer",
      borderRadius: "10px",
      opacity: loading ? 0.7 : 1,
    }}
  >
    {loading ? "Analyzing..." : "Analyze Content"}
  </button>

  {result && (
    <div
      style={{
        marginTop: "40px",
        padding: "30px",
        borderRadius: "16px",
        backgroundColor: "#1f2937",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        textAlign: "left",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          backgroundColor: verdictColor,
          color: "white",
          padding: "12px",
          borderRadius: "10px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "22px",
        }}
      >
        {result.verdict}
      </div>

      <div
        style={{
          marginTop: "25px",
          textAlign: "center",
        }}
      >
        <h3>Authenticity Score</h3>

        <h1
          style={{
            fontSize: "56px",
            margin: "10px 0",
            color: verdictColor,
          }}
        >
          {result.overall_score}%
        </h1>

        <p
          style={{
            fontSize: "18px",
            marginTop: "10px",
          }}
        >
          Confidence:{" "}
          <strong style={{ color: confidenceColor }}>
            {result.confidence}
          </strong>
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#374151",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            backgroundColor: verdictColor,
            transition: "width 0.5s ease",
          }}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Model Agreement:{" "}
        {result.agreement === "3/3"
          ? `All Models Agree (${result.agreement})`
          : `Partial Agreement (${result.agreement})`}
      </div>

      <h3
        style={{
          marginTop: "30px",
        }}
      >
        Model Breakdown
      </h3>

      <div
        style={{
          marginTop: "15px",
          lineHeight: "2",
        }}
      >
        <p>
          Logistic Regression:{" "}
          <strong>
            {result.models.logistic_regression}%
          </strong>
        </p>

        <p>
          Decision Tree:{" "}
          <strong>
            {result.models.decision_tree}%
          </strong>
        </p>

        <p>
          Gradient Boost:{" "}
          <strong>
            {result.models.gradient_boost}%
          </strong>
        </p>
      </div>
    </div>
  )}
</div>
);
}
export default App;