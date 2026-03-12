import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#020617"
    }}>

      <div style={{
        background: "#1e293b",
        padding: "40px",
        borderRadius: "12px",
        width: "300px"
      }}>

        <h2 style={{color:"white", textAlign:"center", marginBottom:"20px"}}>
          Login
        </h2>

        <form onSubmit={handleLogin}>

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:"10px",
              borderRadius:"6px",
              border:"none"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:"20px",
              borderRadius:"6px",
              border:"none"
            }}
          />

          <button
            style={{
              width:"100%",
              padding:"10px",
              background:"#22c55e",
              border:"none",
              borderRadius:"6px",
              color:"white",
              cursor:"pointer"
            }}
          >
            Login
          </button>

        </form>

        {/* Register Button */}
        <p style={{color:"white", marginTop:"15px", textAlign:"center"}}>
          Don't have an account?
        </p>

        <button
          onClick={()=>navigate("/register")}
          style={{
            width:"100%",
            padding:"10px",
            marginTop:"10px",
            background:"#3b82f6",
            border:"none",
            borderRadius:"6px",
            color:"white",
            cursor:"pointer"
          }}
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Login;