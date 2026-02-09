import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

function Dashboard() {

  const [file, setFile] = useState(null);

  const uploadCase = async () => {

    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123");

    try {
      const res = await API.post("/cases/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log(res.data);
      alert("Case uploaded successfully");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ padding: "20px" }}>
        <h2>Upload Case Document</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button onClick={uploadCase}>
          Upload
        </button>

      </div>

    </div>
  );
}

export default Dashboard;
