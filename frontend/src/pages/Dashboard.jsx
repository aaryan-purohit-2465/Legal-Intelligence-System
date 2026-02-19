import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import { getUserId } from "../utils/auth";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = getUserId();

  const uploadCase = async () => {
  if (!file) return alert("Select a file first");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);

  try {
    const res = await API.post("/cases/upload", formData);
    alert("Case uploaded successfully");

    // Refresh sidebar data without reload
    setSelectedCase(res.data.case || null);
    setFile(null);
  } catch (err) {
    alert("Upload failed");
  }
};


  const deleteCase = async () => {
    if (!selectedCase) return;

    try {
      await API.delete(`/cases/${selectedCase._id}`);
      alert("Case deleted");
      setSelectedCase(null);
      window.location.reload();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const highlightText = (text) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        setSelectedCase={setSelectedCase}
        setSearchTerm={setSearchTerm}
      />

      <div style={{ padding: "20px", width: "100%" }}>
        <h2>Upload Case Document</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button onClick={uploadCase}>Upload</button>

        {selectedCase && (
          <>
            <hr />

            <h3>{selectedCase.filename}</h3>

            <button
              onClick={deleteCase}
              style={{
                background: "red",
                color: "white",
                padding: "6px 12px",
                border: "none",
                cursor: "pointer",
                marginBottom: "15px"
              }}
            >
              Delete Case
            </button>

            <h4>Summary</h4>
            <p style={{ background: "#eee", padding: "10px" }}>
              {selectedCase.insights?.summary}
            </p>

            <h4>Keywords</h4>
            <div>
              {selectedCase.insights?.keywords?.map((k, i) => (
                <span
                  key={i}
                  style={{
                    background: "#111",
                    color: "white",
                    padding: "5px 10px",
                    margin: "5px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}
                >
                  {k}
                </span>
              ))}
            </div>

            <h4>Extracted Text</h4>
            <div
              style={{
                background: "#f4f4f4",
                padding: "15px",
                maxHeight: "300px",
                overflowY: "scroll"
              }}
              dangerouslySetInnerHTML={{
                __html: highlightText(selectedCase.extractedText || "")
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
