import { useState } from "react";
import axios from "axios";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async () => {
    if (!resumeFile || !job) {
      alert("Please upload resume and enter job description");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_text", job);

    try {
     const res = await axios.post(
  "https://jobnest-backend-du73.onrender.com/api/ml/match",
  formData
      );

      setResult(res.data);
    } catch (err) {
      console.error("REACT ERROR:", err.response?.data || err.message);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>JobNest – Resume Matcher</h2>

      {/* Resume Upload */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setResumeFile(e.target.files[0])}
      />

      <br /><br />

      {/* Job Description */}
      <textarea
        placeholder="Paste Job Description"
        rows="6"
        style={{ width: "100%" }}
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />

      <br /><br />

      <button onClick={submitHandler} disabled={loading}>
        {loading ? "Checking..." : "Check Match"}
      </button>

      <br /><br />

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Result */}
      {result && (
        <div>
          <h3>Match Score: {result.match_score_percent}%</h3>

          <h4>Missing Skills:</h4>
          {result.missing_skills?.length === 0 ? (
            <p>No missing skills 🎉</p>
          ) : (
            <ul>
              {result.missing_skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
