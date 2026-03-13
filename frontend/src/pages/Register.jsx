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

      await API.post("/auth/register",{
        username,
        email,
        password
      });

      alert("Registration successful");

      navigate("/");

    }catch(err){

      alert("Registration failed");

    }

  }

  return(

    <div style={{
      height:"100vh",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      background:"#020617",
      fontFamily:"Poppins",
      paddingTop:"120px"
    }}>

      {/* Project Title */}

      <div style={{
        textAlign:"center",
        marginBottom:"60px"
      }}>

        <h1 style={{
          color:"white",
          fontSize:"44px",
          fontWeight:"700",
          letterSpacing:"1px"
        }}>
          Legal Intelligence System
        </h1>

        <p style={{
          color:"#94a3b8",
          marginTop:"8px",
          fontSize:"16px"
        }}>
          Create your account
        </p>

      </div>


      {/* Register Card */}

      <div style={{
        background:"#1e293b",
        padding:"45px",
        borderRadius:"14px",
        width:"420px",
        boxShadow:"0 10px 30px rgba(0,0,0,0.5)"
      }}>

        <h2 style={{
          color:"white",
          textAlign:"center",
          marginBottom:"25px"
        }}>
          Register
        </h2>

        <form onSubmit={handleRegister}>

          <input
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"12px",
              borderRadius:"6px",
              border:"none",
              fontSize:"14px"
            }}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"12px",
              borderRadius:"6px",
              border:"none",
              fontSize:"14px"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"20px",
              borderRadius:"6px",
              border:"none",
              fontSize:"14px"
            }}
          />

          <button style={{
            width:"100%",
            padding:"12px",
            background:"#22c55e",
            border:"none",
            borderRadius:"6px",
            color:"white",
            cursor:"pointer",
            fontSize:"15px"
          }}>
            Register
          </button>

        </form>

        <p style={{
          color:"white",
          textAlign:"center",
          marginTop:"18px"
        }}>
          Already have an account?
        </p>

        <button
          onClick={()=>navigate("/")}
          style={{
            width:"100%",
            padding:"12px",
            marginTop:"10px",
            background:"#3b82f6",
            border:"none",
            borderRadius:"6px",
            color:"white",
            cursor:"pointer"
          }}
        >
          Back to Login
        </button>

      </div>

    </div>

  )

}

export default Register;