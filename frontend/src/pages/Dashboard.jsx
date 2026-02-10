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

    await API.post("/cases/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Uploaded");
    window.location.reload();
  };

  return (
    <div style={{ display: "flex" }}>

      <Sidebar setSelectedCase={setSelectedCase} />

      <div style={{ padding: "20px", flex: 1 }}>
        <h2>Upload Case Document</h2>

        <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
        <br/><br/>
        <button onClick={uploadCase}>Upload</button>

        <hr/>

        {selectedCase && (
          <div>
            <h3>Selected Case</h3>
            <p><b>File:</b> {selectedCase.filename}</p>

            <h4>Extracted Text</h4>
            <div style={{ maxHeight: "300px", overflow: "auto", background:"#eee", padding:"10px" }}>
              {selectedCase.extractedText || "No text extracted"}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;
