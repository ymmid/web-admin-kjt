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

// Backend Response Type
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

// GET all
export async function getAllInventoryTracking(): Promise<InventoryTracking[]> {
  const res = await axiosInstance.get("/inventory-tracking");
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
