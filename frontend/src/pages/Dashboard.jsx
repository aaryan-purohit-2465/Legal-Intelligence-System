import { useState, useEffect } from "react";
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
    alert("Case uploaded successfully");
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
            <h3>Selected Case</h3>
            <p><strong>File:</strong> {selectedCase.filename}</p>

            <h4>AI Summary</h4>
            <div style={{ background:"#eee", padding:"10px", borderRadius:"5px" }}>
              {selectedCase.insights?.summary}
            </div>

            <h4>Top Keywords</h4>
            <div style={{ marginBottom:"10px" }}>
              {selectedCase.insights?.keywords?.map((k,i)=>(
                <span key={i} style={{
                  display:"inline-block",
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
            </div>

            <h4>Extracted Text</h4>
            <div style={{
              background:"#f5f5f5",
              padding:"15px",
              borderRadius:"5px",
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
