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

      navigate("/dashboard");

    } catch (err) {

      alert("Login failed");

    }
  };

  return (

    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#020617",
      fontFamily: "Poppins"
    }}>

      {/* Project Title */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>

        <h1 style={{
          color: "white",
          fontSize: "38px",
          fontWeight: "700",
          letterSpacing: "1px"
        }}>
          Legal Intelligence System
        </h1>

        <p style={{
          color: "#94a3b8",
          marginTop: "6px"
        }}>
          AI-powered legal document analysis
        </p>

      </div>


      {/* Login Card */}
      <div style={{
        background: "#1e293b",
        padding: "40px",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
      }}>

        <h2 style={{
          color: "white",
          textAlign: "center",
          marginBottom: "20px"
        }}>
          Login
        </h2>

        <form onSubmit={handleLogin}>

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "none"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "none"
            }}
          />

          <button style={{
            width: "100%",
            padding: "10px",
            background: "#22c55e",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}>
            Login
          </button>

        </form>


        <p style={{
          color: "white",
          textAlign: "center",
          marginTop: "15px"
        }}>
          Don't have an account?
        </p>

        <button
          onClick={()=>navigate("/register")}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "8px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Login;