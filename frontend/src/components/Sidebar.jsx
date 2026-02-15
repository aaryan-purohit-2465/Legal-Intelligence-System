import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Sidebar({ onSelectCase }) {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/cases/123")
      .then(res => setCases(res.data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      width: "250px",
      background: "#111",
      color: "white",
      padding: "20px"
    }}>
      <h3>AI Legal System</h3>

      <button onClick={logout}>Logout</button>

      <h4 style={{ marginTop: "20px" }}>
        Case History
      </h4>

      {cases.map((c) => (
        <div
          key={c._id}
          style={{
            background: "#222",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
          onClick={() => onSelectCase(c)}
        >
          {c.filename}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
