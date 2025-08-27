import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";

export const createJobListSchema = z.object({
  job_name: z.string().min(1, "Nama pekerjaan wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().optional(),
});

export type JobList = {
  id: number;
  transaction_no: string;
  job_name: string;
  company_name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const updateJobListSchema = createJobListSchema.partial();

export async function getAllJobList(params?: {
  search?: string;
  status?: string;
  company_name?: string;
  start_date_from?: string;
  start_date_to?: string;
  skip?: number;
  take?: number;
}): Promise<JobList[]> {
  const res = await axiosInstance.get("/job-list", { params });
  return res.data;
}

export async function getJobListById(id: number): Promise<JobList> {
  const res = await axiosInstance.get(`/job-list/${id}`);
  return res.data;
}

export async function createJobList(payload: unknown) {
  const result = createJobListSchema.safeParse(payload);
  if (!result.success) throw result.error;
  const res = await axiosInstance.post("/job-list", result.data);
  return res.data;
}

export async function updateJobList(id: number, payload: unknown) {
  const result = updateJobListSchema.safeParse(payload);
  if (!result.success) throw result.error;
  const res = await axiosInstance.patch(`/job-list/${id}`, result.data);
  return res.data;
}

export async function deleteJobList(id: number) {
  const res = await axiosInstance.delete(`/job-list/${id}`);
  return res.data;
}
