import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const uploadCase = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123");

    try {
      await API.post("/cases/upload", formData);
      alert("Case uploaded successfully");
      window.location.reload();
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setSelectedCase={setSelectedCase} />

      <div style={{ padding: "30px", flex: 1 }}>
        <h2>Upload Case Document</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button onClick={uploadCase}>
          Upload
        </button>

        {selectedCase && (
          <div style={{ marginTop: "40px" }}>
            <hr />
            <h3>Selected Case</h3>

            <p><strong>File:</strong> {selectedCase.filename}</p>

            <h4>AI Keywords</h4>
            <div style={{ marginBottom: "20px" }}>
              {selectedCase.insights?.keywords?.map((word, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    background: "#222",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "15px",
                    marginRight: "8px",
                    marginBottom: "8px",
                    fontSize: "14px"
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            <h4>Extracted Text</h4>
            <div
              style={{
                background: "#f5f5f5",
                padding: "15px",
                borderRadius: "8px",
                maxHeight: "300px",
                overflowY: "auto",
                whiteSpace: "pre-wrap"
              }}
            >
              {selectedCase.extractedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
