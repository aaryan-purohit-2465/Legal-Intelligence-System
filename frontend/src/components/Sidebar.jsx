import { useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#111",
      color: "white",
      padding: "20px"
    }}>
      <h3>AI Legal System</h3>

      <button onClick={logout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
