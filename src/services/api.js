import axios from "axios";

const API = axios.create({
  baseURL: "https://repair-system-back.vercel.app/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["token"] = token;
  }
};

export default API;
