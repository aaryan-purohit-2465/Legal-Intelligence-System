import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Sidebar({ setSelectedCase }) {
function Sidebar() {

  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    API.get("/cases/123")
      .then(res => setCases(res.data));
  }, []);

  return (
    <div style={{ width: "250px", background:"#111", color:"white", padding:"20px" }}>
    <div style={{ width: "220px", background:"#111", color:"white", padding:"20px" }}>
      <h3>AI Legal System</h3>

      <button onClick={logout}>Logout</button>

      <h4 style={{ marginTop: "20px" }}>Case History</h4>

      {cases.map(c => (
        <div
          key={c._id}
          style={{ cursor: "pointer", marginBottom: "10px" }}
          onClick={() => setSelectedCase(c)}
        >
      <h4 style={{ marginTop: "20px" }}>History</h4>

      {cases.map(c => (
        <div key={c._id}>
          {c.filename}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
