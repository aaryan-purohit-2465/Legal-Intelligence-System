import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

function Dashboard() {

  const [file, setFile] = useState(null);

  const uploadCase = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123"); // temporary

    await API.post("/cases/upload", formData);
    alert("Case uploaded");
  };

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ padding: "20px" }}>
        <h2>Upload Case Document</h2>

        <input type="file"
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <br/><br/>

        <button onClick={uploadCase}>
          Upload
        </button>

      </div>

    </div>
  );
}

export default Dashboard;
