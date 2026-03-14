import { useState, useEffect } from "react";
import API from "../api";

function Dashboard() {

  const [file, setFile] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);

  const fetchCases = async () => {
    try {

      const res = await API.get("/cases");

      setCases(res.data);

    } catch (err) {

      console.error("Failed to fetch cases");

    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const uploadCase = async () => {

    if (!file) return alert("Select a file");

    const formData = new FormData();

    formData.append("file", file);

    try {

      await API.post("/cases/upload", formData);

      setFile(null);

      fetchCases();

    } catch (err) {

      alert("Upload failed");

    }

  };

  const deleteCase = async () => {

    if (!selectedCase) return;

    await API.delete(`/cases/${selectedCase._id}`);

    setSelectedCase(null);

    fetchCases();

  };

  return (

    <div style={{
      display: "flex",
      height: "100vh",
      background: "#020617",
      color: "white",
      fontFamily: "Poppins"
    }}>

      {/* Sidebar */}

      <div style={{
        width: "250px",
        background: "#1e293b",
        padding: "20px"
      }}>

        <h2 style={{marginBottom:"20px"}}>
          Documents
        </h2>

        {cases.length === 0 && (
          <p style={{color:"#94a3b8"}}>
            No documents yet
          </p>
        )}

        {cases.map((c)=>(
          <div
            key={c._id}
            onClick={()=>setSelectedCase(c)}
            style={{
              padding:"10px",
              marginBottom:"8px",
              background:"#334155",
              borderRadius:"6px",
              cursor:"pointer"
            }}
          >
            {c.filename}
          </div>
        ))}

      </div>


      {/* Main */}

      <div style={{
        flex:1,
        padding:"30px"
      }}>

        <h1 style={{marginBottom:"20px"}}>
          Dashboard
        </h1>


        {/* Upload */}

        <div style={{
          background:"#1e293b",
          padding:"20px",
          borderRadius:"10px",
          marginBottom:"20px"
        }}>

          <h3>Upload PDF</h3>

          <input
            type="file"
            onChange={(e)=>setFile(e.target.files[0])}
          />

          <button
            onClick={uploadCase}
            style={{
              marginLeft:"10px",
              background:"#22c55e",
              border:"none",
              padding:"8px 14px",
              borderRadius:"6px",
              color:"white",
              cursor:"pointer"
            }}
          >
            Upload
          </button>

        </div>


        {/* Selected Case */}

        {selectedCase && (

          <div style={{
            background:"#1e293b",
            padding:"20px",
            borderRadius:"10px"
          }}>

            <h2>{selectedCase.filename}</h2>

            <h3>Summary</h3>

            <p>
              {selectedCase.insights?.summary}
            </p>

            <h3>Keywords</h3>

            <div style={{
              display:"flex",
              gap:"10px",
              flexWrap:"wrap"
            }}>
              {selectedCase.insights?.keywords?.map((k,i)=>(
                <span
                  key={i}
                  style={{
                    background:"#334155",
                    padding:"5px 10px",
                    borderRadius:"20px"
                  }}
                >
                  {k}
                </span>
              ))}
            </div>

            <button
              onClick={deleteCase}
              style={{
                marginTop:"20px",
                background:"#ef4444",
                border:"none",
                padding:"8px 14px",
                borderRadius:"6px",
                color:"white",
                cursor:"pointer"
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