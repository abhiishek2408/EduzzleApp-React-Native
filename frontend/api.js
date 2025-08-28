import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://10.124.194.56:3000/api",
  withCredentials: false
});

export default API;
