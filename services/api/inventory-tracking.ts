import axiosInstance from "@/lib/axiosInstance";

export async function getAllInventoryTracking() {
  const res = await axiosInstance.get("/inventory-tracking");
  return res.data;
}

export async function getInventoryTrackingById(id: number) {
  const res = await axiosInstance.get(`/inventory-tracking/${id}`);
  return res.data;
}

export async function createInventoryTracking(payload: {
  item_name: string;
  quantity: number;
  date: string;
}) {
  const res = await axiosInstance.post("/inventory-tracking", payload);
  return res.data;
}

export async function updateInventoryTracking(
  id: number,
  payload: {
    item_name?: string;
    quantity?: number;
    date?: string;
  }
) {
  const res = await axiosInstance.patch(`/inventory-tracking/${id}`, payload);
  return res.data;
}

export async function deleteInventoryTracking(id: number) {
  const res = await axiosInstance.delete(`/inventory-tracking/${id}`);
  return res.data;
}
