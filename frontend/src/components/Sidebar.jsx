import { useEffect, useState } from "react";
import API from "../api";
import { FileText, LogOut } from "lucide-react";

function Sidebar({ setSelectedCase }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    API.get("/cases/123").then((res) => setCases(res.data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{
      width: "260px",
      height: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "20px",
      display: "flex",
      flexDirection: "column"
    }}>

      <h2 style={{ marginBottom: "20px" }}>⚖️ AI Legal</h2>

      <button onClick={logout} style={{
        background: "#ef4444",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        marginBottom: "20px"
      }}>
        <LogOut size={16} /> Logout
      </button>

      <h4 style={{ marginBottom: "10px" }}>Documents</h4>

      <div style={{ overflowY: "auto" }}>
        {cases.map((c) => (
          <div
            key={c._id}
            onClick={() => setSelectedCase(c)}
            style={{
              padding: "10px",
              marginBottom: "10px",
              background: "#1e293b",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <FileText size={16} />
            <span style={{ fontSize: "13px" }}>
              {c.filename}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Sidebar;