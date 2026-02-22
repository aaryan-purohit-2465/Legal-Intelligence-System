import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);

  const fetchCases = async () => {
    const res = await API.get("/cases/123");
    setCases(res.data);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const uploadCase = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123");

    await API.post("/cases/upload", formData);
    fetchCases();
  };

  const deleteCase = async () => {
    if (!selectedCase) return;

    await API.delete(`/cases/${selectedCase._id}`);
    setSelectedCase(null);
    fetchCases();
  };

  // 📊 Stats Calculations
  const totalDocs = cases.length;
  const avgScore =
    cases.length > 0
      ? Math.round(
          cases.reduce(
            (acc, c) => acc + (c.insights?.credibilityScore || 0),
            0
          ) / cases.length
        )
      : 0;

  const highRisk = cases.filter(
    (c) => (c.insights?.credibilityScore || 0) < 40
  ).length;

  const getScoreColor = (score) => {
    if (score < 40) return "#ef4444";
    if (score < 70) return "#facc15";
    return "#22c55e";
  };

  return (
    <div style={{ display: "flex", background: "#020617", minHeight: "100vh" }}>
      <Sidebar setSelectedCase={setSelectedCase} />

      <div style={{ flex: 1, padding: "30px", color: "white" }}>
        <h1>Dashboard</h1>

        {/* 📊 Stats Section */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          {[ 
            { label: "Total Documents", value: totalDocs },
            { label: "Average Score", value: avgScore + "%" },
            { label: "High Risk Docs", value: highRisk }
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                flex: 1,
                transition: "0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <h4>{stat.label}</h4>
              <h2>{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Upload */}
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px"
          }}
        >
          <h3>Upload Document</h3>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
            onClick={uploadCase}
            style={{
              marginLeft: "10px",
              background: "#22c55e",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer"
            }}
          >
            Upload
          </button>
        </div>

        {/* Selected Case */}
        {selectedCase && (
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <h3>{selectedCase.filename}</h3>

            <h4>Credibility Score</h4>
            <div
              style={{
                height: "20px",
                width: "200px",
                background: "#334155",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${selectedCase.insights?.credibilityScore || 0}%`,
                  background: getScoreColor(
                    selectedCase.insights?.credibilityScore || 0
                  ),
                  height: "100%",
                  transition: "0.5s"
                }}
              ></div>
            </div>

            <h4>Summary</h4>
            <p>{selectedCase.insights?.summary}</p>

            <h4>Keywords</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selectedCase.insights?.keywords?.map((k, i) => (
                <span
                  key={i}
                  style={{
                    background: "#334155",
                    padding: "6px 10px",
                    borderRadius: "20px"
                  }}
                >
                  {k}
                </span>
              ))}
            </div>

            <button
              onClick={deleteCase}
              style={{
                marginTop: "20px",
                background: "#ef4444",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer"
              }}
            >
              Delete Case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;