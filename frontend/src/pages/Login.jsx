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
      alignItems: "center",
      background: "#020617",
      fontFamily: "Poppins",
      paddingTop: "120px"   // pushes title slightly down from top
    }}>

      {/* Project Title */}

      <div style={{
        textAlign: "center",
        marginBottom: "60px"   // creates space between title and card
      }}>

        <h1 style={{
          color: "white",
          fontSize: "44px",
          fontWeight: "700",
          letterSpacing: "1px"
        }}>
          Legal Intelligence System
        </h1>

        <p style={{
          color: "#94a3b8",
          marginTop: "8px",
          fontSize: "16px"
        }}>
          AI-powered legal document analysis
        </p>

      </div>


      {/* Login Card */}

      <div style={{
        background: "#1e293b",
        padding: "45px",
        borderRadius: "14px",
        width: "420px",   // wider card
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>

        <h2 style={{
          color: "white",
          textAlign: "center",
          marginBottom: "25px"
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
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "6px",
              border: "none",
              fontSize: "14px"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "none",
              fontSize: "14px"
            }}
          />

          <button style={{
            width: "100%",
            padding: "12px",
            background: "#22c55e",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            fontSize: "15px"
          }}>
            Login
          </button>

        </form>


        <p style={{
          color: "white",
          textAlign: "center",
          marginTop: "18px"
        }}>
          Don't have an account?
        </p>

        <button
          onClick={()=>navigate("/register")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
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
