import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export interface SuratJalanItem {
  deskripsi: string;
  qty: number | string;
  harga: number | string;
}

export interface SuratJalanFormData {
  recipientName: string;
  companyName: string;
  addressLine1: string;
  phoneNumber: string;
  date: string;
  poNumber: string;

  items: SuratJalanItem[];
}

export default async function generateSuratJalanExcel(
  form: SuratJalanFormData
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Surat Jalan");
  function splitTextToLines(text: string, maxLength = 45): string[] {
    if (!text) return [""];
    const lines: string[] = [];
    let remaining = text.trim();
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        lines.push(remaining);
        break;
      }
      let splitIndex = remaining.lastIndexOf(" ", maxLength);
      if (splitIndex === -1) splitIndex = maxLength;
      lines.push(remaining.slice(0, splitIndex).trim());
      remaining = remaining.slice(splitIndex).trim();
    }
    return lines;
  }
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

  // Usage:
  const addressLines = splitTextToLines(form.addressLine1 || "-", 45);
  const addressStartRow = 6; // For example, starting at A6
  addressLines.forEach((line, idx) => {
    worksheet.getCell(`A${addressStartRow + idx}`).value = line;
  });

  // === HEADER KIRI (B4:B9) ===
  worksheet.getCell("A4").value = `Kepada : ${form.recipientName || "-"}`;
  worksheet.getCell("A5").value = form.companyName || "-";
  worksheet.getCell("A6").value = addressLines[0] || "";
  worksheet.getCell("A7").value = addressLines[1] || "";
  worksheet.getCell("A8").value = addressLines[2] || "";
  worksheet.getCell("A9").value = `PH.: ${form.phoneNumber || "-"}`;

  // === HEADER KANAN (J4:J9) + TANGGAL (M9) ===
  worksheet.getCell("H4").value = "CV. Khalil Jaya Teknik"; // Nama perusahaan pengirim, opsional, bisa tambahkan jika ada
  worksheet.getCell("H5").value =
    "Office : Pondok Arraudah 2 Blok C 8 Serang Baru"; // Alamat perusahaan pengirim (opsional)
  worksheet.getCell("H6").value = "Kab. Bekasi 17330, Indoensia";
  worksheet.getCell("H7").value = "Work Shop , Sindangmulya Cigutul No.2";
  worksheet.getCell("H8").value = "HP: 082299645451";
  worksheet.getCell("H9").value = "Tanggal    :";
  worksheet.getCell("J9").value = form.date || "-";

  // === JUDUL TENGAH (F3) ===
  const cell = worksheet.getCell("A2");
  cell.value = "Surat Jalan";
  cell.font = {
    name: "Times New Roman",
    bold: true,
    size: 36,
    underline: true,
  };

  // === HEADER TABEL (B11, E11, J11, M11) ===
  worksheet.getCell("A11").value = "No";
  worksheet.getCell("B11").value = "Deskripsi";
  worksheet.getCell("H11").value = "Quantity";
  worksheet.getCell("J11").value = "Remarks";

  const startRow = 13;
  const maxBarang = 7;
  for (let i = 0; i < maxBarang; i++) {
    const rowNum = startRow + i;
    const item = form.items[i];
    worksheet.getCell(`A${rowNum}`).value = item ? i + 1 : "";
    worksheet.getCell(`B${rowNum}`).value = item ? item.deskripsi : "";
    worksheet.getCell(`H${rowNum}`).value = item ? `  ${item.qty} Pcs` : "";

    worksheet.getCell(`J${rowNum}`).value =
      i === 0 && form.poNumber ? `  PO Number : ${form.poNumber}` : "";
  }

  worksheet.getCell("A28").value = "Catatan :";

  // === TANDA TANGAN (D31, K31, D34) ===
  worksheet.getCell("B31").value = "Pengirim";
  worksheet.getCell("I31").value = "Penerima";
  worksheet.getCell("B38").value = "Rachmat H";

  worksheet.mergeCells("A2:N2");
  worksheet.mergeCells("B11:G11");
  worksheet.mergeCells("H11:I11");
  worksheet.mergeCells("J11:N11");
  worksheet.mergeCells("A28:B28");
  worksheet.mergeCells("B31:C31");
  worksheet.mergeCells("B38:C38");
  worksheet.mergeCells("I31:K31");
  worksheet.getRow(2).height = 45;

  worksheet.getCell("A2").alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = {
        name: "Times New Roman",
        bold: true,
        size: cell.font?.size || 16, // pakai size existing atau default 12
      };
    });
  });
  worksheet.getCell("A2").font = {
    size: 36, // font size besar
    underline: true, // garis bawah
  };
  for (let row = 4; row <= 9; row++) {
    for (let col = 1; col <= 6; col++) {
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        // Baris atas
        top: row === 4 ? { style: "thin" } : undefined,
        // Baris bawah
        bottom: row === 9 ? { style: "thin" } : undefined,
        // Kolom kiri
        left: col === 1 ? { style: "thin" } : undefined,
        // Kolom kanan
        right: col === 6 ? { style: "thin" } : undefined,
      };
    }
  }
  for (let row = 11; row <= 26; row++) {
    for (let col = 1; col <= 14; col++) {
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        ...cell.border,
        top: row === 11 ? { style: "thin" } : cell.border?.top,
        bottom: row === 26 ? { style: "thin" } : cell.border?.bottom,
        left: col === 1 ? { style: "thin" } : cell.border?.left,
        right: col === 14 ? { style: "thin" } : cell.border?.right,
      };
    }
  }
  for (let row = 11; row <= 26; row++) {
    for (let col = 1; col <= 14; col++) {
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        ...cell.border,
        top: row === 10 ? { style: "thin" } : cell.border?.top,
        bottom: row === 26 ? { style: "thin" } : cell.border?.bottom,
        left: col === 8 ? { style: "thin" } : cell.border?.left,
        right: col === 14 ? { style: "thin" } : cell.border?.right,
      };
    }
  }
  for (let row = 11; row <= 26; row++) {
    for (let col = 1; col <= 14; col++) {
      const cell = worksheet.getRow(row).getCell(col);
      cell.border = {
        ...cell.border,
        top: row === 10 ? { style: "thin" } : cell.border?.top,
        bottom: row === 26 ? { style: "thin" } : cell.border?.bottom,
        left: col === 10 ? { style: "thin" } : cell.border?.left,
        right: col === 14 ? { style: "thin" } : cell.border?.right,
      };
    }
  }
  for (let row = 11; row <= 26; row++) {
    const cell = worksheet.getRow(row).getCell(1); // 1 = A
    cell.border = {
      ...cell.border,
      top: row === 11 ? { style: "thin" } : cell.border?.top,
      bottom: row === 26 ? { style: "thin" } : cell.border?.bottom,
      left: { style: "thin" },
      right: { style: "thin" },
    };
  }

  for (let row = 11; row <= 26; row++) {
    const cell = worksheet.getRow(row).getCell(1);
    cell.border = {
      ...cell.border,
      left: { style: "thin" },
      top: row === 11 ? { style: "thin" } : cell.border?.top,
      bottom: row === 26 ? { style: "thin" } : cell.border?.bottom,
    };
  }

  for (let col = 1; col <= 14; col++) {
    const cell = worksheet.getRow(11).getCell(col);
    cell.border = {
      ...cell.border,
      top: { style: "thin" },
      left: col === 1 ? { style: "thin" } : cell.border?.left,
      right: col === 14 ? { style: "thin" } : cell.border?.right,
      bottom: { style: "thin" },
    };
  }
  worksheet.getCell("A2").font = {
    name: "Times New Roman",
    bold: true,
    size: 36, // bisa kamu ganti sesuai kebutuhan
    underline: true, // kalau ingin underline, atau hapus kalau tidak perlu
  };
  for (let col = 1; col <= 14; col++) {
    // A = 1, N = 14
    const cell = worksheet.getRow(11).getCell(col);
    cell.alignment = {
      ...cell.alignment, // supaya property lain tidak hilang
      horizontal: "center",
      vertical: "middle", // opsional, biasanya biar benar-benar di tengah cell
    };
  }
  for (let row = 12; row <= 26; row++) {
    const cell = worksheet.getRow(row).getCell(1); // 1 = A
    cell.alignment = {
      ...cell.alignment, // supaya property lain tetap ada
      horizontal: "center",
      vertical: "middle", // opsional, biar benar-benar di tengah
    };
  }
  worksheet.pageSetup.margins = {
    left: 0.2, // inci, makin kecil = makin mepet tepi kertas
    right: 0.2,
    top: 0.5,
    bottom: 0.5,
    header: 0.1,
    footer: 0.1,
  };

  worksheet.pageSetup.printArea = "A1:N40";
  worksheet.pageSetup.fitToPage = true;
  worksheet.pageSetup.fitToWidth = 1;
  worksheet.pageSetup.fitToHeight = 1;
  worksheet.pageSetup.paperSize = 9;

  // === EXPORT FILE ===
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Surat-Jalan-${form.companyName || "Pelanggan"}-${form.date || "Pelanggan"}.xlsx`
  );
}
