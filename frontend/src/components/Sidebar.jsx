import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Sidebar({ setSelectedCase }) {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");

  const userId = "123"; // temporary

  const fetchCases = async () => {
    const res = await API.get(`/cases/${userId}`);
    setCases(res.data);
  };

  const searchCases = async () => {
    if (!search) return fetchCases();

    const res = await API.get(`/cases/search/${userId}/${search}`);
    setCases(res.data);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ width: "260px", background: "#111", color: "white", padding: "20px" }}>
      <h3>AI Legal System</h3>

      <button onClick={logout}>Logout</button>

      <hr />

      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
      />

      <button onClick={searchCases} style={{ width: "100%" }}>
        Search
      </button>

      <h4 style={{ marginTop: "20px" }}>Case History</h4>

      {cases.map((c) => (
        <div
          key={c._id}
          style={{
            padding: "8px",
            marginBottom: "6px",
            background: "#222",
            cursor: "pointer",
            borderRadius: "6px"
          }}
          onClick={() => setSelectedCase(c)}
        >
          {c.filename}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
