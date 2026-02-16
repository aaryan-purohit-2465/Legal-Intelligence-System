import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Sidebar({ setSelectedCase }) {

  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");

  const userId = "123";

  const fetchCases = async () => {
    const res = await API.get(`/cases/${userId}`);
    setCases(res.data);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleSearch = async () => {
    if (!search) return fetchCases();

    const res = await API.get(`/cases/search/${userId}/${search}`);
    setCases(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ width: "250px", background: "#111", color: "white", padding: "20px" }}>
      <h3>AI Legal System</h3>
      <button onClick={logout}>Logout</button>

      <h4 style={{ marginTop: "20px" }}>Search</h4>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search inside PDFs..."
        style={{ width: "100%", padding: "5px" }}
      />
      <button onClick={handleSearch} style={{ marginTop: "5px" }}>
        Search
      </button>

      <h4 style={{ marginTop: "20px" }}>Case History</h4>

      {cases.map((c) => (
        <div
          key={c._id}
          style={{
            background: "#222",
            padding: "8px",
            marginBottom: "8px",
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
