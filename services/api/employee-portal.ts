import axiosInstance from "../../lib/axiosInstance";

// User
export interface User {
  id: number;
  employee_id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  deleted_at: string | null;
}

// Employee
export interface Employee {
  id: number;
  photo_url: string | null;
  nik: string;
  rfid_code: string;
  position: string;
  salary: string; // string (karena di JSON "5000000" dalam string)
  name: string;
  department: string;
  hire_date: string | null; // ISO string, nullable
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// DailyAttendance
export interface DailyAttendance {
  id: number;
  employee_id: number;
  date: string;
  time_in: string;
  time_out: string;
  total_hours: number;
  created_at: string;
}

// DailyJob
export interface DailyJob {
  id: number;
  employee_id: number;
  job_date: string;
  job_description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Main API Response
export interface EmployeePortalResponse {
  user: User;
  employee: Employee;
  dailyAttendances: DailyAttendance | null;
  dailyJob: DailyJob[];
}

export async function loginUser(payload: { email: string; password: string }) {
  const res = await axiosInstance.post("/auth/login", payload);
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

export async function getProfileEmployee(): Promise<EmployeePortalResponse> {
  const res = await axiosInstance.get("/employee-portal");
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
