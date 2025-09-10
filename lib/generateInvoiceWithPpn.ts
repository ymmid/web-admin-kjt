import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Worksheet } from "exceljs";
import numberToWords from "./numberToWords";
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

function handleAlamat(
  worksheet: Worksheet,
  cellAddress: string,
  alamat: string
): void {
  const MAX_CHAR = 49;

  // Ekstrak kolom dan baris dari cellAddress (misal: "C12")
  const match = cellAddress.match(/^([A-Z]+)(\d+)$/i);
  if (!match) throw new Error("Alamat cell tidak valid, contoh: C12");

  const col = match[1].toUpperCase();
  const row = parseInt(match[2], 10);

  if (alamat.length > MAX_CHAR) {
    const baris1: string = alamat.substring(0, MAX_CHAR);
    const baris2: string = alamat.substring(MAX_CHAR);

    worksheet.getCell(`${col}${row}`).value = baris1;
    worksheet.getCell(`${col}${row + 1}`).value = baris2;
  } else {
    worksheet.getCell(cellAddress).value = alamat;
    worksheet.getCell(`${col}${row + 1}`).value = ""; // Bersihkan cell bawahnya
  }
}
export async function generateInvoiceExcelWithPpn(form: InvoiceFormData) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Invoice");

  worksheet.getColumn("A").width = 50;

  // Helper: Konversi kolom dari huruf ke angka
  const getColumnNumber = (cellAddress: string): number => {
    const match = cellAddress.match(/([A-Z]+)[0-9]+/);
    if (!match) throw new Error("Invalid cell address: " + cellAddress);
    const letters = match[1];
    let number = 0;
    for (let i = 0; i < letters.length; i++) {
      number *= 26;
      number += letters.charCodeAt(i) - 64;
    }
    return number;
  };

  const applyBorderToRange = (
    worksheet: ExcelJS.Worksheet,
    startCell: string,
    endCell: string
  ) => {
    const start = worksheet.getCell(startCell);
    const end = worksheet.getCell(endCell);
    const startRow = Number(start.row);
    const endRow = Number(end.row);
    const startCol = getColumnNumber(startCell);
    const endCol = getColumnNumber(endCell);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }
  };

  const merge = (
    cell: string,
    value: string,
    style?: Partial<ExcelJS.Style>
  ) => {
    worksheet.mergeCells(cell);
    const cellRef = worksheet.getCell(cell.split(":")[0]);
    cellRef.value = value;
    cellRef.style = {
      alignment: { vertical: "middle", horizontal: "left", wrapText: true },
      font: { size: 10 },
      ...style,
    };
  };
  worksheet.getColumn("A").width = 4.81;
  worksheet.getColumn("B").width = 4.81;
  worksheet.getColumn("C").width = 4.81;
  worksheet.getColumn("J").width = 19;
  worksheet.getColumn("K").width = 22;
  worksheet.getRow(8).height = 29;

  // === CV Info

  worksheet.getCell("A1").value = "CV. KHALIL JAYA TEKNIK";
  worksheet.getCell("A1").font = { bold: true, size: 12 };
  worksheet.getCell("A2").value =
    "PERUMAHAN AR RAUDAH 2 BLOK C NO 8 RT.001 RW.001";
  worksheet.getCell("A3").value = "SUKARAGAM, SERANG BARU";
  worksheet.getCell("A4").value = "KAB. BEKASI, JAWA BARAT";
  worksheet.getCell("A5").value = "Telp";
  worksheet.getCell("A6").value = "NPWP";
  worksheet.getCell("C5").value = ": 082299645451";
  worksheet.getCell("C6").value = ": 935815662413000 / 0935815662413000";

  merge("A8:K8", "INVOICE", {
    font: { bold: true, size: 16 },
    alignment: { horizontal: "center", vertical: "middle" },
  });

  applyBorderToRange(worksheet, "A8", "I8");

  worksheet.getCell("A10").value = "Customer:";
  worksheet.getCell("A11").value = form.namaPt;
  worksheet.getCell("A11").font = { size: 12, bold: true };
  handleAlamat(worksheet, "A12", form.alamatCell1);

  worksheet.getCell("A15").value = "Telp";
  worksheet.getCell("A16").value = "NPWP";
  worksheet.getCell("C15").value = `: ${form.noTelpPt}`;
  worksheet.getCell("C16").value = `: ${form.npwpPt}`;

  worksheet.getCell("J10").value = "Invoice No";

  worksheet.getCell("J11").value = "Faktur Pajak No";

  worksheet.getCell("J12").value = "Date";

  worksheet.getCell("J13").value = "Purchase Order";

  worksheet.getCell("J14").value = "Jatuh Tempo";

  worksheet.getCell("K10").value = `: ${form.noInvoice}`;
  worksheet.getCell("K11").value = `: ${form.fakturPajak}`;
  worksheet.getCell("K12").value = `: ${form.tanggal}`;
  worksheet.getCell("K13").value = `: ${form.purchaseOrder}`;
  worksheet.getCell("K14").value = `: ${form.jatuhTempo} Hari`;

  worksheet.mergeCells("B18:G18"); // Merge Description di B18 sampai E18

  worksheet.getCell("A18").value = "No";
  worksheet.getCell("B18").value = "Description";
  worksheet.getCell("H18").value = "QTY";
  worksheet.getCell("I18").value = "Unit";
  worksheet.getCell("J18").value = "Unit Price";
  worksheet.getCell("K18").value = "Total (Rp)";

  // Styling semua cell header di baris 18
  ["A18", "B18", "F18", "G18", "H18", "I18", "J18", "K18"].forEach(
    (address) => {
      const cell = worksheet.getCell(address);
      cell.font = { bold: true };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    }
  );

  let total = 0;
  const startDataRow = 19;
  form.items.forEach((item, idx) => {
    const itemTotal = Number(item.qty) * Number(item.harga);
    total += itemTotal;
    const row = worksheet.getRow(startDataRow + idx);
    row.getCell(1).value = idx + 1;
    row.getCell(3).value = item.deskripsi;
    row.getCell(8).value = +item.qty;
    row.getCell(9).value = "Set";
    row.getCell(10).value = +item.harga;
    row.getCell(11).value = itemTotal;
  });

  // Setelah data items, hitung baris total:
  const afterLastItemRow = startDataRow + form.items.length;

  // Sub Total
  worksheet.getCell(`J28`).value = "Sub Total";
  worksheet.getCell(`K28}`).value = total;

  // PPN
  const ppnAmount = form.includePpn ? total * 0.11 : 0;
  worksheet.getCell(`J29}`).value = "PPN 11%";
  worksheet.getCell(`K29`).value = ppnAmount;

  // Grand Total

  worksheet.getCell(`J30`).value = "PPH23 2%";
  worksheet.getCell("K30").value = { formula: "-K28*2%" };
  worksheet.getCell(`J31`).value = "Grand Total";
  worksheet.getCell("K31").value = { formula: "SUM(K28:K29:K30)" };

  for (let row = 19; row <= 27; row++) {
    for (let col = 1; col <= 11; col++) {
      // 1 = A, ..., 11 = K
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        top: row === 19 ? { style: "thin" } : undefined,
        bottom: row === 27 ? { style: "thin" } : undefined,
        left:
          col === 1 || col === 8 || col === 9 || col === 10 || col === 11
            ? { style: "thin" }
            : undefined,
        right: col === 1 || col === 11 ? { style: "thin" } : undefined, // border kanan juga di kolom A & K
      };
    }
  }
  for (let row = 28; row <= 30; row++) {
    for (let col = 10; col <= 11; col++) {
      // 10 = J, 11 = K
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }
  for (let row = 9; row <= 17; row++) {
    for (let col = 1; col <= 11; col++) {
      // 1 = A, 11 = K
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        top: row === 9 ? { style: "thin" } : undefined,
        bottom: row === 17 ? { style: "thin" } : undefined,
        left: col === 1 ? { style: "thin" } : undefined,
        right: col === 11 ? { style: "thin" } : undefined,
      };
    }
  }
  for (let row = 34; row <= 36; row++) {
    for (let col = 1; col <= 11; col++) {
      // 1 = A, 11 = K
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        top: row === 34 ? { style: "thin" } : undefined,
        bottom: row === 36 ? { style: "thin" } : undefined,
        left: col === 1 ? { style: "thin" } : undefined,
        right: col === 11 ? { style: "thin" } : undefined,
      };
    }
  }
  worksheet.getCell("J31").font = { bold: true };
  worksheet.getCell("K31").font = { bold: true };
  const borderStyle = {
    top: { style: "thin" as ExcelJS.BorderStyle },
    left: { style: "thin" as ExcelJS.BorderStyle },
    bottom: { style: "thin" as ExcelJS.BorderStyle },
    right: { style: "thin" as ExcelJS.BorderStyle },
  };
  worksheet.getCell("J31").border = borderStyle;
  worksheet.getCell("K31").border = borderStyle;
  worksheet.getCell("K31").numFmt = "#,##0";

  for (let row = 39; row <= 45; row++) {
    for (let col = 1; col <= 10; col++) {
      // 1 = A, 10 = J
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        top: row === 39 ? { style: "thin" } : undefined,
        bottom: row === 45 ? { style: "thin" } : undefined,
        left: col === 1 ? { style: "thin" } : undefined,
        right: col === 10 ? { style: "thin" } : undefined,
      };
    }
  }

  // Formatting number format "Rp" untuk kolom F (total)
  [
    `F${afterLastItemRow}`,
    `F${afterLastItemRow + 1}`,
    `F${afterLastItemRow + 2}`,
  ].forEach((address) => {
    worksheet.getCell(address).numFmt = '"Rp"#,##0';
  });
  worksheet.getCell("D35").value = numberToWords(
    Math.round(total + (total * 11) / 100 + (total * -2) / 100)
  );

  worksheet.getCell("B40").value = "Pembayaran di transfer ke :";
  worksheet.getCell("B41").value = "CV. KHALIL JAYA TEKNIK";
  worksheet.getCell("B42").value = "Bank Permata";
  worksheet.getCell("B43").value =
    "Jl. Jababeka Raya Ruko Komersial Blk. B No.5";
  worksheet.getCell("B44").value = "Account No : 00975873528";
  worksheet.getCell("B44").font = { bold: true };

  worksheet.getCell("J47").value = `Cikarang, ${form.tanggal}`;

  // Baris kosong? Lewati, atau biarkan tanpa diisi

  worksheet.getCell("J57").value = "RACHMAT HIDAYAT";
  worksheet.getCell("J57").border = {
    bottom: { style: "thin" },
  };
  worksheet.getCell("J57").font = { bold: true };
  worksheet.getCell("J58").alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  worksheet.getCell("J58").value = "Direktur";

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      const currentFont = cell.font ?? {};
      const alreadySetSize = typeof currentFont.size === "number";
      cell.font = {
        ...currentFont,
        name: "Arial",
        size: alreadySetSize ? currentFont.size : 10,
      };
    });
  });
  for (let row = 19; row <= 27; row++) {
    worksheet.getCell(`I${row}`).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  }
  for (let row = 19; row <= 27; row++) {
    worksheet.getCell(`J${row}`).numFmt = "#,##0"; // Format ribuan tanpa simbol
    worksheet.getCell(`K${row}`).numFmt = "#,##0"; // Format ribuan tanpa simbol
  }

  worksheet.pageSetup = {
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    printArea: "A1:K62",
    paperSize: 9, // 9 = A4 di Excel
    orientation: "portrait", // atau 'landscape' kalau mau lebar
    margins: {
      left: 0.5,
      right: 0.5,
      top: 0.5,
      bottom: 0.5,
      header: 0.3,
      footer: 0.3,
    },
  };
  for (let row = 19; row <= 27; row++) {
    worksheet.getCell(`A${row}`).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  }
  for (let row = 28; row <= 30; row++) {
    worksheet.getCell(`K${row}`).numFmt = "#,##0"; // Format ribuan tanpa simbol
  }

  worksheet.getCell("K28").value = { formula: "K28*11%" };
  worksheet.getCell("K29").value = { formula: "K28*11%" };
  worksheet.getCell("K28").value = { formula: "SUM(K19:K27)" };
  worksheet.getCell("A35").value = "Terbilang #";
  worksheet.getCell("A35").font = { bold: true };
  worksheet.getCell("D35").font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `invoice-${form.noInvoice}.xlsx`);
}
