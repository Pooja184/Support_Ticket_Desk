import axios from "axios";

// create axios instance to centralize API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api/v1",
  withCredentials: true,
});

export default api;
