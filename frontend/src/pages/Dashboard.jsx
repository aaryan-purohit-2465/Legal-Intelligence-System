import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const uploadCase = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123");

    await API.post("/cases/upload", formData);
    window.location.reload();
  };

  const deleteCase = async () => {
    if (!selectedCase) return;

    await API.delete(`/cases/${selectedCase._id}`);
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", background: "#020617", minHeight: "100vh" }}>

      <Sidebar setSelectedCase={setSelectedCase} />

      <div style={{
        flex: 1,
        padding: "30px",
        color: "white"
      }}>

        <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

        {/* Upload Box */}
        <div style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px"
        }}>
          <h3>Upload Document</h3>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={uploadCase} style={{
            marginLeft: "10px",
            background: "#22c55e",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}>
            Upload
          </button>
        </div>

        {/* Case Display */}
        {selectedCase && (
          <div style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px"
          }}>
            <h3>{selectedCase.filename}</h3>

            <h4 style={{ marginTop: "15px" }}>Summary</h4>
            <p>{selectedCase.insights?.summary}</p>

            <h4>Keywords</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {selectedCase.insights?.keywords?.map((k, i) => (
                <span key={i} style={{
                  background: "#334155",
                  padding: "6px 10px",
                  borderRadius: "20px",
                  fontSize: "12px"
                }}>
                  {k}
                </span>
              ))}
            </div>

            <h4 style={{ marginTop: "15px" }}>Extracted Text</h4>
            <p style={{
              background: "#020617",
              padding: "10px",
              borderRadius: "8px",
              maxHeight: "200px",
              overflow: "auto"
            }}>
              {selectedCase.extractedText}
            </p>

            <button onClick={deleteCase} style={{
              marginTop: "15px",
              background: "#ef4444",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer"
            }}>
              Delete Case
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;