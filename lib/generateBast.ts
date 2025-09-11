// ✅ Margin halaman di-set 1 cm (567 twips) — tidak mengubah margin tabel
"use client";

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
} from "docx";
import { VerticalAlign, ShadingType } from "docx";

// -------------------------
// TYPE DEFINITIONS
// -------------------------
export type BeritaAcaraItemForm = {
  deskripsi: string;
  qty: string | number;
  harga: string | number;
};

export type BeritaAcaraForm = {
  recipientName: string; // Nama penerima
  companyName: string;
  addressLine1: string;
  phoneNumber: string;
  bastNo: string;
  date: string;
  poNumber: string;
  projectNo: string;
  items: BeritaAcaraItemForm[];
};

// -------------------------
// UTIL: helper untuk buat cell konsisten (tanpa margin sel)
// -------------------------
function createCell(textOrNumber: string | number) {
  return new TableCell({
    children: [
      new Paragraph({
        text: String(textOrNumber),
        spacing: { before: 0, after: 0 }, // nolkan jarak paragraf
      }),
    ],
  });
}

// -------------------------
// FUNCTION: generate & download Word
// -------------------------
export function generateBeritaAcaraFE(form: BeritaAcaraForm) {
  const header = new Paragraph({
    children: [
      new TextRun({
        text: "CV. Khalil Jaya Teknik",
        bold: true,
        size: 40,
        font: "Times New Roman", // <-- tambah ini
      }),
    ],
    alignment: AlignmentType.CENTER,
  });

  const alamat = new Paragraph({
    children: [
      new TextRun({
        text: "Pondok Ar-raudah 2 Blok-C.8 RT.01/RW.01, Kp.Gebang, Ds.Sukaragam, Kec.Serang Baru Cibarusah",
        size: 22,
        font: "Times New Roman", // tambahkan ini
      }),
      new TextRun({
        text: `Phone:082299645451 (e-mail : khaliljayateknik@gmail.com) Cikarang, Bekasi - Jawa Barat 17334`,
        size: 22,
        font: "Times New Roman", // tambahkan ini juga
        break: 1,
      }),
    ],
    alignment: AlignmentType.CENTER,
  });

  const underline = new Paragraph({
    border: {
      bottom: {
        color: "000000", // warna garis
        space: 1, // jarak
        style: "single", // ✅ bukan 'value'
        size: 15, // ketebalan garis (1/8 pt)
      },
    },
    children: [new TextRun("")],
  });

  const judul = new Paragraph({
    children: [
      new TextRun({
        text: "BERITA ACARA",
        bold: true,
        size: 48, // 24 pt (karena docx pakai half-points)
        underline: {}, // default underline single
        font: "Arial Nova", // font family
      }),
    ],

    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
  });

  const noBast = new Paragraph({
    children: [
      new TextRun({ text: `No. ${form.bastNo}`, size: 24, font: "Arial Nova" }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  });

  const isi1 = new Paragraph({
    children: [
      new TextRun({
        text: "Pada hari ini kedua belah pihak telah sepakat, dengan data sbb :",
        font: "Arial Nova",
      }),
    ],
    spacing: { after: 200 },
  });

  const pihakPertama = [
    new Paragraph({
      children: [
        new TextRun({ text: "•", size: 22, font: "Arial Nova" }),
        new TextRun({
          text: "  Nama\t: Rachmat Hidayat",
          size: 22,
          font: "Arial Nova",
        }),
      ],
      spacing: { after: 100 },
      indent: { left: 720 },
      tabStops: [{ type: "left", position: 2500 }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "•", size: 22, font: "Arial Nova" }),
        new TextRun({
          text: "  Alamat\t: Pondok Arraudah 2 Blok C.8 RT 001/RW001 Kec. Serang Baru Kab. Bekasi Provinsi Jawabarat 17334",
          size: 22,
          font: "Arial Nova",
        }),
      ],
      spacing: { after: 200 },
      indent: { left: 720 },
      tabStops: [{ type: "left", position: 2500 }],
    }),
  ];

  const pihakKedua = [
    // Paragraph yang pakai 'text'
    new Paragraph({
      children: [
        new TextRun({
          text: "Dalam hal ini disebut sebagai Pihak Pertama / yang menyerahkan.",
          font: "Arial Nova",
        }),
      ],
      spacing: { after: 200 },
    }),
    // Paragraph yang pakai 'children'
    new Paragraph({
      children: [
        new TextRun({ text: "•", size: 22, font: "Arial Nova" }),
        new TextRun({
          text: "  Nama\t: " + form.recipientName,
          size: 22,
          font: "Arial Nova",
        }),
      ],
      spacing: { after: 100 },
      indent: { left: 720 },
      tabStops: [{ type: "left", position: 2500 }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "•", size: 22, font: "Arial Nova" }),
        new TextRun({
          text: "  Alamat\t: " + form.addressLine1,
          size: 22,
          font: "Arial Nova",
        }),
      ],
      spacing: { after: 200 },
      indent: { left: 720 },
      tabStops: [{ type: "left", position: 2500 }],
    }),
  ];

  const penyerahan = new Paragraph({
    children: [
      new TextRun({
        text: "Dalam hal ini disebut sebagai Pihak Kedua / yang menerima. ",
        font: "Arial Nova",
      }),
      new TextRun({
        text: "Kedua belah pihak telah mengadakan serah terima pekerjaan sebagai berikut dengan hasil ",
        font: "Arial Nova",
      }),
      new TextRun({
        text: "OK", // cuma kata ini
        bold: true, // dibuat bold
        font: "Arial Nova",
      }),
    ],
    spacing: { after: 200 },
  });

  const poProject = [
    new Paragraph({
      children: [
        new TextRun({
          text: `PO No.\t\t: ${form.poNumber}`,
          font: "Arial Nova",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Project No.\t: ${form.projectNo}`,
          font: "Arial Nova",
        }),
      ],
      spacing: { after: 200 },
    }),
  ];

  // Tabel (tanpa margin cell khusus)
  const HEADER_HEIGHT = 500; // twips (≈0.88 cm). Ubah sesuai kebutuhan.

  const tabel = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // HEADER ROW
      new TableRow({
        height: { value: HEADER_HEIGHT, rule: "exact" },
        children: [
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            shading: { type: ShadingType.CLEAR, color: "auto", fill: "CCFF33" },
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "No. Part",
                    bold: true,
                    font: "Arial Nova",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            shading: { type: ShadingType.CLEAR, color: "auto", fill: "CCFF33" },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Description",
                    bold: true,
                    font: "Arial Nova",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            shading: { type: ShadingType.CLEAR, color: "auto", fill: "CCFF33" },
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Qty", bold: true, font: "Arial Nova" }),
                ],
              }),
            ],
          }),
        ],
      }),

      // DATA ROWS: semua font Arial Nova juga
      ...form.items.map(
        (item, itemIndex) =>
          new TableRow({
            height: { value: HEADER_HEIGHT, rule: "exact" },
            children: [
              // Cell 1
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "" + (itemIndex + 1),
                        font: "Arial Nova",
                      }),
                    ],
                  }),
                ],
              }),
              // Cell 2
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "  " + item.deskripsi,
                        font: "Arial Nova",
                      }),
                    ],
                  }),
                ],
              }),
              // Cell 3
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: item.qty + " Pcs",
                        font: "Arial Nova",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    ],
  });

  const footer = [
    new Paragraph({
      children: [
        new TextRun({
          text: "Demikian Berita Acara serah terima ini dibuat sebagai acuan pembuatan invoice dan proses pembayaran.",
          font: "Arial Nova",
        }),
      ],
      spacing: { before: 600, after: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "\t", font: "Arial Nova" }),
        new TextRun({
          text: "Bekasi,        /       /      ",
          font: "Arial Nova",
        }),
      ],
      tabStops: [{ type: "right", position: 9000 }],
      spacing: { after: 600 },
    }),

    // Tabel tanda tangan
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: "none" },
        bottom: { style: "none" },
        left: { style: "none" },
        right: { style: "none" },
        insideHorizontal: { style: "none" },
        insideVertical: { style: "none" },
      },
      rows: [
        // Baris 1: Pihak
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Pihak Kedua,", font: "Arial Nova" }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Pihak Pertama,", font: "Arial Nova" }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Baris 2: Yang menerima / menyerahkan
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Yang menerima,", font: "Arial Nova" }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "Yang menyerahkan,",
                      font: "Arial Nova",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Baris 3: spasi tanda tangan
        new TableRow({
          height: { value: 1000, rule: "exact" },
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "", font: "Arial Nova" })],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "", font: "Arial Nova" })],
                }),
              ],
            }),
          ],
        }),
        // Baris 4: Nama
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "(                    )",
                      font: "Arial Nova",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "(      Rachmat Hidayat      )",
                      font: "Arial Nova",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Baris 5: Jabatan
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Manager", font: "Arial Nova" }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Direktur", font: "Arial Nova" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: 24, // optional: ukuran default (12pt = 24 half-points)
          },
        },
      },
    },
    sections: [
      {
        properties: {
          // ✅ Margin halaman 1 cm di semua sisi (567 twips)
          page: {
            margin: {
              top: 1134,
              bottom: 1134,
              left: 1134,
              right: 1134,
            },
          },
        },
        children: [
          header,
          alamat,
          underline,
          judul,
          noBast,
          isi1,
          ...pihakPertama,
          ...pihakKedua,
          penyerahan,
          ...poProject,
          tabel,
          ...footer,
        ],
      },
    ],
  });

  // Generate & download di browser
  Packer.toBlob(doc).then((blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = form.bastNo + "-bast.docx";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  });
}
