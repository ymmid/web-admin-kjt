import axiosInstance from "@/lib/axiosInstance"; // pastikan path-nya sesuai
type DashboardSummary = {
  totalEmployees: number; // pakai titik dua, bukan "="
  totalCustomers: number;
  totalIncome: number;
  totalExpense: number;
};
type IncomeOutcom3Month = {
  id: number;
  flow_type: string;
  transaction_date: string;
  amount: string;
};
type Data = IncomeOutcom3Month[];

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await axiosInstance.get("/dashboard/summary");
  return res.data;
}

export async function getIncomeOutcome3Month(): Promise<Data> {
  const res = await axiosInstance.get("/dashboard/income-outcome-3month");
  return res.data;
}
