import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Sidebar({ setSelectedCase }) {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    API.get("/cases/123")
      .then((res) => setCases(res.data))
      .catch(() => alert("Failed to load cases"));
  }, []);

  return (
    <div
      style={{
        width: "250px",
        background: "#111",
        color: "white",
        padding: "20px",
        minHeight: "100vh"
      }}
    >
      <h3>AI Legal System</h3>

      <button onClick={logout} style={{ marginTop: "10px" }}>
        Logout
      </button>

      <h4 style={{ marginTop: "30px" }}>Case History</h4>

      {cases.map((c) => (
        <div
          key={c._id}
          onClick={() => setSelectedCase(c)}
          style={{
            cursor: "pointer",
            marginTop: "10px",
            padding: "8px",
            background: "#222",
            borderRadius: "5px"
          }}
        >
          {c.filename}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
