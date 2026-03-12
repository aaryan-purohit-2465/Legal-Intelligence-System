import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() {

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();

    if(!username || !email || !password){
      alert("Please fill all fields");
      return;
    }

    try{

      const res = await API.post("/auth/register",{
        username,
        email,
        password
      });

      alert(res.data.message);

      navigate("/");

    }catch(err){

      alert("Registration failed");

    }

  }

  return(

    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#020617"
    }}>

      <div style={{
        background:"#1e293b",
        padding:"40px",
        borderRadius:"12px",
        width:"300px"
      }}>

        <h2 style={{color:"white", textAlign:"center", marginBottom:"20px"}}>
          Register
        </h2>

        <form onSubmit={handleRegister}>

          <input
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:"10px",
              borderRadius:"6px",
              border:"none"
            }}
          />

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
            Register
          </button>

        </form>

      </div>

    </div>

  )

}

export default Register;