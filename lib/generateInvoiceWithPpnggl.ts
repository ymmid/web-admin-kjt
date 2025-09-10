import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TEMPLATE_URL = "/template/template-invoice.xlsx";

export interface InvoiceItem {
  deskripsi: string;
  qty: number | string;
  harga: number | string;
}

export interface InvoiceFormData {
  namaPt: string;
  alamatCell1: string;
  noTelpPt: string;
  npwpPt: string;
  noInvoice: string;
  fakturPajak: string;
  tanggal: string;
  purchaseOrder: string;
  jatuhTempo: string;
  terbilang: string;
  includePpn: boolean;
  items: InvoiceItem[];
}

export async function generateInvoice(form: InvoiceFormData) {
  const response = await fetch(TEMPLATE_URL);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const result: Record<string, any> = { ...form };
    if (Array.isArray(form.items)) {
      form.items.forEach((item, idx) => {
        Object.entries(item).forEach(([key, value]) => {
          // Jika key qty/harga, konversi ke number
          const isNumberField = key == "qty" || key == "harga";
          const finalValue = isNumberField ? Number(value) : value;
          if (idx === 0) {
            result[key] = finalValue;
          } else {
            result[`${key}${idx + 1}`] = finalValue;
          }
        });
      });
    }
    console.log(result);
    Object.keys(worksheet).forEach((cell) => {
      if (
        worksheet[cell]?.v &&
        typeof worksheet[cell].v === "string" &&
        worksheet[cell].v.includes("{{") &&
        worksheet[cell].v.includes("}}")
      ) {
        // Proses replace tanpa String()
        const replacedValue = worksheet[cell].v.replace(
          /{{\s*([\w\d_]+)\s*}}/g,
          (_: string, key: string) => {
            if (key in result) {
              return result[key]; // return number kalau aslinya number
            }
            return `{{${key}}}`;
          }
        );

        // Cek apakah placeholder mengandung key harga (harga, harga2, harga3, dst.)
        const hargaKeyMatch = worksheet[cell].v.match(/{{\s*harga\d*\s*}}/);

        if (
          typeof replacedValue === "number" ||
          (!isNaN(Number(replacedValue)) && replacedValue.trim() !== "")
        ) {
          worksheet[cell].v = Number(replacedValue);
          worksheet[cell].t = "n";
          // Kalau key = harga/harga2/harga3, set format ribuan Indonesia tanpa simbol
          if (hargaKeyMatch) {
            worksheet[cell].z = "#,##0"; // Format ribuan Indo tanpa desimal, tanpa simbol
          }
        } else {
          worksheet[cell].v = replacedValue;
          worksheet[cell].t = "s";
        }
      }
    });
  });

  const outWb = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  const blob = new Blob([outWb], { type: "application/octet-stream" });
  saveAs(blob, `${form.noInvoice || "Invoice"}.xlsx`);
}
