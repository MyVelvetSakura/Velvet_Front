import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const hadToken = !!localStorage.getItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      if (hadToken && window.location.pathname !== "/home") {
        window.location.href = "/home";
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;