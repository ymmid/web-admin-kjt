import axiosInstance from "@/lib/axiosInstance";
export enum Status {
  Present = "present",
  Leave = "leave",
  Sick = "sick",
  Alpha = "alpha",
  Off = "off",
  NoData = "nodata",
  Late = "late",
  Overtime = "overtime",
}

export interface DailyStatusDto {
  id: number | null;
  date: string;
  status: Status;
  overtime_hours: number;
}
export interface EmployeeDto {
  employee_id: number;
  employee_name: string;
  salary: string;
  daily_status: DailyStatusDto[];
}
export interface AttendanceRespponsetDto {
  year: number;
  month: number;
  employees: EmployeeDto[];
}
export type AttendanceUpdateDto = {
  status: string;
  overtime_hours?: number; // <- optional, bisa kosong
};
export async function getAllAttendances(params?: {
  month?: number;
  year?: number;
}) {
  const { data } = await axiosInstance.get<AttendanceRespponsetDto>(
    "/attendances",
    {
      params,
    }
  );
  return data;
}

export async function getDailyJobById(id: number) {
  const { data } = await axiosInstance.get(`/attendances/${id}`);
  return data;
}

export async function createDailyJob(payload: AttendanceRespponsetDto) {
  const { data } = await axiosInstance.post("/attendances", payload);
  return data;
}

export async function updateDailyJob(id: number, payload: AttendanceUpdateDto) {
  const { data } = await axiosInstance.patch(`/attendances/${id}`, payload);
  return data;
}

export async function deleteDailyJob(id: number) {
  const { data } = await axiosInstance.delete(`/attendances/${id}`);
  return data;
}
