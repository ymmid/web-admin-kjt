// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000,
});
console.log(process.env.NEXT_PUBLIC_API_URL);

export default axiosInstance;
