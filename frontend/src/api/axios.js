import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach access token
api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("authTokens"));

    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    // 🚨 IMPORTANT:
    // Let Axios decide Content-Type automatically
    // (required for FormData / file uploads)
    delete config.headers["Content-Type"];

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const tokens = JSON.parse(localStorage.getItem("authTokens"));

    if (
      error.response?.status === 401 &&
      tokens?.refresh &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}accounts/refresh/`,
          { refresh: tokens.refresh }
        );

        const newTokens = {
          ...tokens,
          access: res.data.access,
        };

        localStorage.setItem("authTokens", JSON.stringify(newTokens));
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem("authTokens");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
