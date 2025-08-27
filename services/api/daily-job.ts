import axiosInstance from "@/lib/axiosInstance";
export type DailyJobData = {
  date: string;
  items: DailyJobPersonItem[];
};
export type CreateDailyJobDto = {
  employee_id: number;
  job_date: string; // ISO date
  job_description: string;
};

export type DailyJobPersonItem = {
  name: string;
  nik: string;
  jobs: DailyJobItem[];
};

export type DailyJobItem = {
  id: number;
  job_description: string;
};

export type DailyJobDataArray = DailyJobData[];

export async function getAllDailyJobs(params?: {
  month?: number;
  year?: number;
}): Promise<DailyJobDataArray> {
  const { data } = await axiosInstance.get("/daily-job", { params });
  return data;
}

export async function getDailyJobById(id: number): Promise<DailyJobData> {
  const { data } = await axiosInstance.get(`/daily-job/${id}`);
  return data;
}

export async function createDailyJob(payload: CreateDailyJobDto) {
  const { data } = await axiosInstance.post("/daily-job", payload);
  return data;
}

export async function updateDailyJob(
  id: number,
  payload: Partial<DailyJobData>
): Promise<DailyJobData> {
  const { data } = await axiosInstance.patch(`/daily-job/${id}`, payload);
  return data;
}

export async function deleteDailyJob(id: number) {
  const { data } = await axiosInstance.delete(`/daily-job/${id}`);
  return data;
}
