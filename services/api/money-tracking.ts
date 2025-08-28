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
export type MoneyTrackingMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};
export type MoneyTrackingResponse = {
  data: MoneyTracking[];
  meta: MoneyTrackingMeta;
};
export const updateMoneyTrackingSchema = createMoneyTrackingSchema.partial();

export async function getAllMoneyTracking(
  page = 1,
  search?: string,
  month?: number,
  year?: number
): Promise<MoneyTrackingResponse> {
  const res = await axiosInstance.get<MoneyTrackingResponse>(
    "/money-tracking",
    {
      params: {
        page,
        search: search?.trim() || undefined,
        month: month || undefined,
        year: year || undefined,
      },
    }
  );

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
