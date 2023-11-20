import axios from "axios";
import { baseUrl } from "./globals";

const Api = axios.create({
  baseURL: baseUrl,
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["X-Auth-Key"] = token;
  }
  return config;
});

export default Api;
