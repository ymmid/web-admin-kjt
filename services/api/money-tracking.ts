import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";

export const createMoneyTrackingSchema = z.object({
  transaction_no: z.string().min(1, "No Transaksi wajib diisi"),
  purpose: z.string().min(1, "Purpose wajib diisi"),
  flow_type: z.string().min(1, "Flow type wajib diisi"),
  transaction_date: z.coerce.date(),
  amount: z.coerce.number().min(0, "Amount tidak valid"),
  proof_url: z.string().optional().or(z.literal("")),
});

export type MoneyTracking = {
  id: number;
  transaction_no: string;
  purpose: string;
  flow_type: string;
  transaction_date: string;
  amount: string;
  proof_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export const updateMoneyTrackingSchema = createMoneyTrackingSchema.partial();

export async function getAllMoneyTracking(): Promise<MoneyTracking[]> {
  const res = await axiosInstance.get("/money-tracking");
  return res.data;
}

export async function getMoneyTrackingById(id: number): Promise<MoneyTracking> {
  const res = await axiosInstance.get(`/money-tracking/${id}`);
  return res.data;
}

export async function createMoneyTracking(formData: FormData) {
  const res = await axiosInstance.post("/money-tracking", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateMoneyTracking(id: number, payload: unknown) {
  const result = updateMoneyTrackingSchema.safeParse(payload);
  if (!result.success) throw result.error;
  const res = await axiosInstance.patch(`/money-tracking/${id}`, result.data);
  return res.data;
}

export async function deleteMoneyTracking(id: number) {
  const res = await axiosInstance.delete(`/money-tracking/${id}`);
  return res.data;
}
