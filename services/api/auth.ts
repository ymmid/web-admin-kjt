// src/services/api/auth.ts

import axiosInstance from "../../lib/axiosInstance";

// ✅ Login: perlu withCredentials untuk menerima httpOnly cookie
export async function loginUser(payload: { email: string; password: string }) {
  const res = await axiosInstance.post("/auth/login", payload, {
    withCredentials: true,
  });
  return res.data;
}

// ❌ Register: tidak perlu credentials, kecuali server langsung set cookie
export async function registerUser(payload: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await axiosInstance.post("/auth/register", payload);
  return res.data;
}

// ✅ Get profile: perlu credentials agar cookie (token) dikirim ke backend
export async function getProfile() {
  const res = await axiosInstance.get("/auth/me", {
    withCredentials: true,
  });
  return res.data;
}

// ✅ Refresh token: perlu kirim cookie refreshToken
export async function getRefreshProfile() {
  const res = await axiosInstance.get("/auth/refresh", {
    withCredentials: true,
  });
  return res.data;
}

// ✅ Logout: perlu kirim cookie supaya backend bisa hapus
export async function logoutUser() {
  const res = await axiosInstance.post("/auth/logout", null, {
    withCredentials: true,
  });
  return res.data;
}
