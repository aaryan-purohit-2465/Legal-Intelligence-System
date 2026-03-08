import { useState } from "react";
import API from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register",  {
        username,
        email,
        password,
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
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
      onSubmit={handleRegister}
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
      <h2 style={{textAlign:"center"}}>Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        style={{padding:"8px"}}
      />

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
        Register
      </button>

    </form>

  </div>
);
}

export default Register;
