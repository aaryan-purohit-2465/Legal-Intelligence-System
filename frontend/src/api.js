import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/apihttps://legal-intelligence-system.onrender.com/",
});

export default API;
