import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { toast } from "sonner";

export function exportInventoryToExcel(
  allData: any[],
  month?: number,
  year?: number
) {
  try {
    if (!allData || allData.length === 0) {
      toast.warning("Tidak ada data untuk diekspor!");
      return;
    }

    // 1. Format data untuk Excel
    const formattedData = allData.map((item) => ({
      "No Transaksi": item.transaction_no,
      "Nama Barang": item.name,
      "Tanggal Beli": item.bought_at
        ? dayjs(item.bought_at).format("DD/MM/YYYY")
        : "-",
      "Tanggal Jual": item.sold_at
        ? dayjs(item.sold_at).format("DD/MM/YYYY")
        : "-",
      "Rencana Penggunaan": item.planned_usage,
      Jumlah: item.quantity,
      "Harga Beli": item.buy_price,
      "Harga Jual": item.sell_price,
    }));

    // 2. Buat worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    // 3. Download file Excel
    XLSX.writeFile(
      workbook,
      `Inventory_Tracking_${month || "all"}-${year || "all"}.xlsx`
    );

    toast.success("Export Excel berhasil!");
  } catch (error) {
    console.error(error);
    toast.error("Gagal mengekspor data!");
  }
}
