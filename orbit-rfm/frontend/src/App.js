// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [form, setForm] = useState({
//     gmat: "",
//     gpa: "",
//     workExp: "",
//     targetProgram: "MBA"
//   });
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Handle input changes
//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   // Submit matcher form
//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setResults([]);
//     try {
//       const res = await axios.post("http://localhost:5000/match", form);
//       setResults(res.data);
//     } catch (err) {
//       alert("Error: " + err.message);
//     }
//     setLoading(false);
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>Orbit Right Fit Matcher</h1>
//       <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
//         <label>
//           GMAT Score:&nbsp;
//           <input name="gmat" type="number" min="300" max="800" required onChange={handleChange} value={form.gmat} />
//         </label>
//         <br /><br />
//         <label>
//           GPA:&nbsp;
//           <input name="gpa" type="number" step="0.01" min="0" max="4" required onChange={handleChange} value={form.gpa} />
//         </label>
//         <br /><br />
//         <label>
//           Work Experience (years):&nbsp;
//           <input name="workExp" type="number" min="0" max="15" required onChange={handleChange} value={form.workExp} />
//         </label>
//         <br /><br />
//         <label>
//           Target Program:&nbsp;
//           <select name="targetProgram" required onChange={handleChange} value={form.targetProgram}>
//             <option value="MBA">MBA</option>
//             <option value="MS">MS</option>
//             <option value="PhD">PhD</option>
//           </select>
//         </label>
//         <br /><br />
//         <button type="submit" disabled={loading}>
//           {loading ? "Matching..." : "Find Best Colleges"}
//         </button>
//       </form>

//       {results.length > 0 && (<>
//         <h2>Best Fit Universities:</h2>
//         <table border="1" cellPadding="8">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>GMAT</th>
//               <th>GPA</th>
//               <th>Tier</th>
//               <th>Match Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.map((u) => (
//               <tr key={u.id}>
//                 <td>{u.name}</td>
//                 <td>{u.min_gmat}</td>
//                 <td>{u.min_gpa}</td>
//                 <td>{u.tier}</td>
//                 <td>{Math.round(u.matchScore)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </>)}
//     </div>
//   );
// }

// export default App;
import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [form, setForm] = useState({
    gmat: "",
    gpa: "",
    workExp: "",
    targetProgram: "MBA"
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

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

  function exportCSV() {
    fetch("http://localhost:5000/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "universities.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => alert("CSV export failed!"));
  }

  const chartData = {
    labels: results.map((u) => u.name),
    datasets: [
      {
        label: "Match Score",
        data: results.map((u) => Math.round(u.matchScore)),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 mt-10">
        <h1 className="text-2xl font-bold mb-2">Orbit Right Fit Matcher</h1>
        <p className="mb-4 text-gray-600">
          Enter your academic info to see your best match universities with scores, CSV download, and visual ranking.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium">GMAT Score</label>
            <input
              name="gmat"
              type="number"
              min="300"
              max="800"
              value={form.gmat}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">GPA (0.0-4.0)</label>
            <input
              name="gpa"
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={form.gpa}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Work Experience (years)</label>
            <input
              name="workExp"
              type="number"
              min="0"
              max="15"
              value={form.workExp}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Target Program</label>
            <select
              name="targetProgram"
              value={form.targetProgram}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full mt-1"
              required
            >
              <option value="MBA">MBA</option>
              <option value="MS">MS</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <button
            type="submit"
            className={`w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition ${loading ? "opacity-70" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Matching..." : "Find Best Fit Universities"}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Best Match Results</h2>
            <div className="overflow-x-auto">
              <table className="table-fixed w-full border border-gray-300 bg-white rounded">
                <thead>
                  <tr>
                    <th className="px-3 py-2 border">Name</th>
                    <th className="px-3 py-2 border">GMAT</th>
                    <th className="px-3 py-2 border">GPA</th>
                    <th className="px-3 py-2 border">Tier</th>
                    <th className="px-3 py-2 border">Match Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((u) => (
                    <tr key={u.id}>
                      <td className="px-3 py-2 border">{u.name}</td>
                      <td className="px-3 py-2 border">{u.min_gmat}</td>
                      <td className="px-3 py-2 border">{u.min_gpa}</td>
                      <td className="px-3 py-2 border">{u.tier}</td>
                      <td className="px-3 py-2 border">{Math.round(u.matchScore)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={exportCSV}
                className="mt-4 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-bold"
              >
                Export Results as CSV
              </button>
              <div style={{ marginTop: 32 }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="text-xs mt-6 text-gray-400">
        © {new Date().getFullYear()} Orbit College Matcher
      </footer>
    </div>
  );
}

export default App;
