import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://eduzzleapp-react-native.onrender.com/api",
  withCredentials: false
});

export default API;
