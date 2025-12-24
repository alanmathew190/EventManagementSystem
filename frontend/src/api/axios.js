import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// 🔐 Attach access token automatically
api.interceptors.request.use(
  (config) => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));

    if (authTokens?.access) {
      config.headers.Authorization = `Bearer ${authTokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
