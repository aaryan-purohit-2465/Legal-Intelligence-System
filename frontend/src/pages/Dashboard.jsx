import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

function Dashboard() {

  const [file, setFile] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const uploadCase = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123");

    await API.post("/cases/upload", formData);
    alert("Case uploaded");
    window.location.reload();
  };

  const deleteCase = async () => {
    if (!selectedCase) return;

    await API.delete(`/cases/${selectedCase._id}`);
    alert("Case deleted");

    setSelectedCase(null);
    window.location.reload();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setSelectedCase={setSelectedCase} />

      <div style={{ padding: "20px", width: "100%" }}>
        <h2>Upload Case Document</h2>

        <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <br/><br/>

        <button onClick={uploadCase}>Upload</button>

        {selectedCase && (
          <>
            <hr/>

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
            <p style={{ background:"#eee", padding:"10px" }}>
              {selectedCase.insights.summary}
            </p>

            <h4>Keywords</h4>
            {selectedCase.insights.keywords.map((k,i)=>(
              <span key={i} style={{
                background:"#111",
                color:"white",
                padding:"5px 10px",
                margin:"5px",
                borderRadius:"20px",
                fontSize:"12px"
              }}>
                {k}
              </span>
            ))}

            <h4>Extracted Text</h4>
            <div style={{
              background:"#f4f4f4",
              padding:"15px",
              maxHeight:"300px",
              overflowY:"scroll"
            }}>
              {selectedCase.extractedText}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
