import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login",  {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");
      console.log(err.response?.data);
    }
  };

  return (
  <div style={{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"#020617",
    color:"white"
  }}>

    <form
      onSubmit={handleLogin}
      style={{
        background:"#1e293b",
        padding:"40px",
        borderRadius:"12px",
        width:"320px",
        display:"flex",
        flexDirection:"column",
        gap:"10px"
      }}
    >
      <h2 style={{textAlign:"center"}}>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={{padding:"8px"}}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        style={{padding:"8px"}}
      />

      <button
        style={{
          marginTop:"10px",
          background:"#22c55e",
          border:"none",
          padding:"10px",
          color:"white",
          cursor:"pointer",
          borderRadius:"6px"
        }}
      >
        Login
      </button>

    </form>

  </div>
)
}

export default Login;