import axios from "axios";

const API = axios.create({
  baseURL: "https://legal-intelligence-system.onrender.com",
});

export default API;