import axiosInstance from "../../lib/axiosInstance";

export async function loginUser(payload: { email: string; password: string }) {
  const res = await axiosInstance.post("/auth/login", payload, {
    withCredentials: true,
  });
  return res.data;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await axiosInstance.post("/auth/register", payload);
  return res.data;
}

export async function getProfile() {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
}
export async function getRefreshProfile() {
  const res = await axiosInstance.get("/auth/refresh");
  return res.data;
}
export async function logoutUser() {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
}
