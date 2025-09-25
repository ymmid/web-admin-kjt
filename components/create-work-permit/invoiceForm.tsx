"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  generateNewNumber,
  getLastNumberByScope,
} from "@/services/api/create-work-permit";
import { toast } from "sonner";

import { generateInvoiceExcel } from "@/lib/generateInvoice";
import { generateInvoiceExcelWithPpn } from "@/lib/generateInvoiceWithPpn";

const InvoiceForm = () => {
  const [form, setForm] = useState({
    namaPt: "",
    alamatCell1: "",
    noTelpPt: "",
    npwpPt: "",
    noInvoice: "",
    fakturPajak: "",
    tanggal: "",
    purchaseOrder: "",
    jatuhTempo: "",
    terbilang: "",
    includePpn: false,
    items: [{ deskripsi: "", qty: "", harga: "" }],
  });

  const formatInvoiceNumber = (prefix: string, now: Date, sequence: number) => {
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const padded = String(sequence).padStart(4, "0");
    return `${prefix}-${month}.${year}.${padded}`;
  };
  const { data, isLoading, isFetching, isError, error, refetch, isSuccess } =
    useQuery({
      queryKey: ["invoice", "last-number"],
      queryFn: () => getLastNumberByScope("invoice"),
      enabled: false,
      refetchOnWindowFocus: false,
    });
  const handleGenerateNoInvoice = async () => {
    const result = await refetch();
    if (result.data) {
      const sequence = result.data.last_number + 1;

      const newInvoiceNo = formatInvoiceNumber("KJT", new Date(), sequence);
      setForm((prev) => ({ ...prev, noInvoice: newInvoiceNo }));
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormComplete = Object.values(form).every(
    (val) => val !== "" && val !== undefined && val !== null,
  );

  const handleCheckboxChange = (name: string, value: boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { deskripsi: "", qty: "", harga: "" }],
    }));
  };

  const handlDonwloadPermit = async () => {
    try {
      await generateNewNumber("invoice");

      const [year, month, day] = form.tanggal.split("-");
      form.tanggal = `${day} ${getMonthName(Number(month))} ${year}`;
      if (form.includePpn) {
        generateInvoiceExcelWithPpn(form);
      } else {
        generateInvoiceExcel(form);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };
  return (
    <Card className="w-full mt-5 h-full shadow-lg border ">
      <CardHeader />
      <div className="text-center font-semibold text-2xl">Invoice</div>
      <div className="flex flex-col gap-3 px-5 md:flex-row md:gap-5 md:justify-end">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includePpn"
            checked={form.includePpn}
            onCheckedChange={(checked) =>
              handleCheckboxChange("includePpn", !!checked)
            }
          />
          <label htmlFor="includePpn" className="text-sm font-medium">
            Sertakan PPH23 2% untuk barang
          </label>
        </div>
        <Button onClick={() => handleGenerateNoInvoice()}>
          Generate No Invoice
        </Button>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Pilih Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pilih Template</SelectLabel>
              <SelectItem value="tanpa template">Tanpa Template</SelectItem>
              <SelectItem value="surat Jalan">PT Yamaha</SelectItem>
              <SelectItem value="bast">PT JFE</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Perusahaan */}
          <div>
            <label className="block mb-1 font-medium">
              Nama Perusahaan (Customer)
            </label>
            <Input
              name="namaPt"
              placeholder="Contoh: PT Mitra Teknik"
              onChange={handleChange}
              value={form.namaPt}
            />
          </div>

          {/* Nomor Invoice */}
          <div>
            <label className="block mb-1 font-medium">Nomor Invoice</label>
            <Input
              name="noInvoice"
              placeholder="Contoh: 12345"
              onChange={handleChange}
              value={form.noInvoice}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Alamat</label>
            <Input
              name="alamatCell1"
              placeholder="Contoh: Jl. Jababeka Raya No. 5"
              onChange={handleChange}
              value={form.alamatCell1}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Nomor Telepon Perusahaan Tujuan
            </label>
            <Input
              name="noTelpPt"
              placeholder="Contoh: 021-12345678"
              onChange={handleChange}
              value={form.noTelpPt}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              NPWP Perusahaan Tujuan
            </label>
            <Input
              name="npwpPt"
              placeholder="Contoh: 01.234.567.8-901.000"
              onChange={handleChange}
              value={form.npwpPt}
            />
          </div>

          {/* Faktur Pajak & Tanggal */}
          <div>
            <label className="block mb-1 font-medium">Nomor Faktur Pajak</label>
            <Input
              name="fakturPajak"
              placeholder="Contoh: 010.000-21.12345678"
              onChange={handleChange}
              value={form.fakturPajak}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Tanggal Invoice</label>
            <Input
              type="date"
              name="tanggal"
              onChange={handleChange}
              required
              value={form.tanggal}
            />
          </div>

          {/* PO & Jatuh Tempo */}
          <div>
            <label className="block mb-1 font-medium">
              Nomor Purchase Order
            </label>
            <Input
              name="purchaseOrder"
              placeholder="Contoh: PO-00123"
              onChange={handleChange}
              value={form.purchaseOrder}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Jatuh Tempo (Hari)</label>
            <Input
              name="jatuhTempo"
              type="number"
              placeholder="Contoh: 30"
              onChange={handleChange}
              value={form.jatuhTempo}
            />
          </div>
          <div></div>
          {form.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-4 rounded-md mb-4"
            >
              <div className="md:col-span-3">
                <label className="block mb-1 font-medium">
                  Nama Item {index + 1}
                </label>
                <Textarea
                  placeholder="Contoh: Jasa Instalasi Panel Listrik"
                  value={item.deskripsi}
                  onChange={(e) =>
                    handleItemChange(index, "deskripsi", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Qty</label>
                <Input
                  type="number"
                  placeholder="Contoh: 1"
                  value={item.qty}
                  onChange={(e) =>
                    handleItemChange(index, "qty", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Harga Satuan</label>
                <Input
                  type="number"
                  placeholder="Contoh: 15000000"
                  value={item.harga}
                  onChange={(e) =>
                    handleItemChange(index, "harga", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <Button type="button" onClick={addItem}>
              + Tambah Item
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={handlDonwloadPermit}
            disabled={!isFormComplete}
            className="px-6 py-3 text-base font-semibold"
          >
            🡇 Download Invoice
          </Button>
          {!isFormComplete && (
            <p className="text-sm text-red-500 mt-2">
              * Harap lengkapi semua data terlebih dahulu
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export function getMonthName(bulan: number): string {
  const namaBulan = [
    "", // biar index 1 = Januari
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  // Validasi agar tetap aman
  if (bulan < 1 || bulan > 12) return "";
  return namaBulan[bulan];
}
export default InvoiceForm;
