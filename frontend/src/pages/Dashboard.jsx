import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import { getUserId } from "../utils/auth";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = getUserId();

  // ================= LOAD CASES =================
  const fetchCases = async () => {
    try {
      const res = await API.get(`/cases/${userId}`);
      setCases(res.data);
    } catch (err) {
      console.error("Error fetching cases");
    }
  };

  useEffect(() => {
    if (userId) fetchCases();
  }, [userId]);

  // ================= UPLOAD =================
  const uploadCase = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      await API.post("/cases/upload", formData);
      alert("Uploaded successfully");
      fetchCases();
    } catch (err) {
      alert("Upload failed");
    }
  };

  // ================= DELETE =================
  const deleteCase = async () => {
    if (!selectedCase) return;

    try {
      await API.delete(`/cases/${selectedCase._id}`);
      alert("Deleted");
      setSelectedCase(null);
      fetchCases();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= SEARCH =================
  const filteredCases = cases.filter(c =>
    c.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      
      <Sidebar cases={filteredCases} setSelectedCase={setSelectedCase} />

      <div style={{ padding: "20px", width: "100%" }}>
        
        <h2>Upload Case Document</h2>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadCase}>Upload</button>

        <br /><br />

        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {selectedCase && (
          <>
            <h3>Selected Case</h3>
            <p><b>File:</b> {selectedCase.filename}</p>

            {/* 🔥 SUMMARY */}
            <h4>AI Summary</h4>
            <div style={{ background: "#eee", padding: "10px" }}>
              {selectedCase.insights?.summary}
            </div>

            {/* 🔥 KEYWORDS */}
            <h4>Top Keywords</h4>
            <div>
              {selectedCase.insights?.keywords?.map((k, i) => (
                <span key={i} style={{
                  marginRight: "8px",
                  padding: "5px 10px",
                  background: "black",
                  color: "white",
                  borderRadius: "10px"
                }}>
                  {k}
                </span>
              ))}
            </div>

            {/* 🔥 CREDIBILITY SCORE */}
            <h4>Credibility Score</h4>
            <div style={{
              width: "200px",
              background: "#ddd",
              borderRadius: "10px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${selectedCase.insights?.credibilityScore || 0}%`,
                background: "green",
                color: "white",
                textAlign: "center"
              }}>
                {selectedCase.insights?.credibilityScore || 0}%
              </div>
            </div>

            {/* 🔥 EXTRACTED TEXT */}
            <h4>Extracted Text</h4>
            <div style={{
              background: "#f5f5f5",
              padding: "10px",
              maxHeight: "300px",
              overflow: "auto"
            }}>
              {selectedCase.extractedText}
            </div>

            <br />
            <button onClick={deleteCase}>Delete Case</button>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
