import React, { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    gmat: "",
    gpa: "",
    workExp: "",
    targetProgram: "MBA"
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit matcher form
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      const res = await axios.post("http://localhost:5000/match", form);
      setResults(res.data);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Orbit Right Fit Matcher</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <label>
          GMAT Score:&nbsp;
          <input name="gmat" type="number" min="300" max="800" required onChange={handleChange} value={form.gmat} />
        </label>
        <br /><br />
        <label>
          GPA:&nbsp;
          <input name="gpa" type="number" step="0.01" min="0" max="4" required onChange={handleChange} value={form.gpa} />
        </label>
        <br /><br />
        <label>
          Work Experience (years):&nbsp;
          <input name="workExp" type="number" min="0" max="15" required onChange={handleChange} value={form.workExp} />
        </label>
        <br /><br />
        <label>
          Target Program:&nbsp;
          <select name="targetProgram" required onChange={handleChange} value={form.targetProgram}>
            <option value="MBA">MBA</option>
            <option value="MS">MS</option>
            <option value="PhD">PhD</option>
          </select>
        </label>
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Matching..." : "Find Best Colleges"}
        </button>
      </form>

      {results.length > 0 && (<>
        <h2>Best Fit Universities:</h2>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>GMAT</th>
              <th>GPA</th>
              <th>Tier</th>
              <th>Match Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.min_gmat}</td>
                <td>{u.min_gpa}</td>
                <td>{u.tier}</td>
                <td>{Math.round(u.matchScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>)}
    </div>
  );
}

export default App;
