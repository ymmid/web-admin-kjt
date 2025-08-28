import axiosInstance from "@/lib/axiosInstance";
import { z, ZodError } from "zod";

// Zod Schemas
export const createInventoryTrackingSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  transaction_no: z.string().min(1, "No Transaksi wajib diisi"),
  quantity: z.number().int().min(1, "Minimal 1"),
  proof_url: z.string().url().optional().or(z.literal("")),
  buy_price: z.number().min(0, "Harga beli tidak valid"),
  sell_price: z.number().min(0).optional(),
  planned_usage: z.string().min(1),
  bought_at: z.coerce.date(),
  sold_at: z.coerce.date().optional().nullable(),
});

export const updateInventoryTrackingSchema =
  createInventoryTrackingSchema.partial();

// Infer Type from Schema
export type CreateInventoryTracking = z.infer<
  typeof createInventoryTrackingSchema
>;
export type UpdateInventoryTracking = z.infer<
  typeof updateInventoryTrackingSchema
>;

export type InventoryTracking = {
  id: number;
  transaction_no: string;
  name: string;
  quantity: number;
  proof_url: string;
  buy_price: string;
  sell_price: string;
  planned_usage: string;
  bought_at: string;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type InventoryMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};
export type InventoryTrackingResponse = {
  data: InventoryTracking[];
  meta: InventoryMeta;
};

export async function getAllInventoryTracking(
  page = 1,
  search?: string,
  month?: number,
  year?: number
): Promise<InventoryTrackingResponse> {
  const res = await axiosInstance.get<InventoryTrackingResponse>(
    "/inventory-tracking",
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
export async function getAllInventoryTrackingNoLimit(
  month?: number,
  year?: number
): Promise<InventoryTracking[]> {
  const res = await axiosInstance.get<InventoryTracking[]>(
    "/inventory-tracking/all",
    {
      params: {
        month: month || undefined,
        year: year || undefined,
      },
    }
  );
  return res.data;
}
// GET by ID
export async function getInventoryTrackingById(
  id: number
): Promise<InventoryTracking> {
  const res = await axiosInstance.get(`/inventory-tracking/${id}`);
  return res.data;
}

// CREATE
export async function createInventoryTracking(payload: unknown) {
  const result = createInventoryTrackingSchema.safeParse(payload);
  if (!result.success) throw result.error;

  const res = await axiosInstance.post("/inventory-tracking", result.data);
  return res.data;
}

// UPDATE
export async function updateInventoryTracking(id: number, payload: unknown) {
  const result = updateInventoryTrackingSchema.safeParse(payload);
  if (!result.success) throw result.error;

  const res = await axiosInstance.patch(
    `/inventory-tracking/${id}`,
    result.data
  );
  return res.data;
}

// DELETE
export async function deleteInventoryTracking(id: number) {
  const res = await axiosInstance.delete(`/inventory-tracking/${id}`);
  return res.data;
}
