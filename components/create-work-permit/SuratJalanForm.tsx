"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getLastNumberByScope } from "@/services/api/create-work-permit";
import { useQuery } from "@tanstack/react-query";
import generateSuratJalanExcel from "@/lib/generateSuratJalan";
import { getMonthName } from "./invoiceForm";

const SuratJalanForm = () => {
  const [form, setForm] = useState({
    recipientName: "",
    companyName: "",
    addressLine1: "",

    phoneNumber: "",
    date: "",
    poNumber: "",
    items: [{ deskripsi: "", qty: "", harga: "" }],
  });
  const { data, isLoading, isFetching, isError, error, refetch, isSuccess } =
    useQuery({
      queryKey: ["surat_jalan", "last-number"],
      queryFn: () => getLastNumberByScope("surat_jalan"),
      enabled: false,
      refetchOnWindowFocus: false,
    });
  const formatSuratJalanNumber = (
    prefix: string,
    now: Date,
    sequence: number,
  ) => {
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const padded = String(sequence).padStart(4, "0");
    return `${prefix}-${month}.${year}.${padded}`;
  };
  const handleGenerateNoSuratJalan = async () => {
    const [year, month, day] = form.date.split("-");
    form.date = `${day} ${getMonthName(Number(month))} ${year}`;
    generateSuratJalanExcel(form);
  };
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormComplete = Object.values(form).every((val) => val !== "");
  const generateDocx = () => {
    // Lakukan generate file DOCX dengan data dari `form`
    console.log("Data invoice:", form);
    // bisa lempar ke API, atau gunakan docx.js, atau SheetJS dsb
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
  return (
    <Card className="w-full mt-5 h-full shadow-lg border">
      <CardHeader />
      <div className="text-center font-semibold text-2xl">Surat Jalan</div>
      <div className="flex gap-5 justify-end px-5">
        {/* <Button onClick={() => handleGenerateNoSuratJalan()}>
          Generate No Invoice
        </Button> */}
        <Select>
          <SelectTrigger className="w-[180px]">
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
          <div>
            <label className="block mb-1 font-medium">Nama Penerima</label>
            <Input
              name="recipientName"
              placeholder="Contoh: Bapak/Ibu ... "
              value={form.recipientName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Nama PT/Customer</label>
            <Input
              name="companyName"
              placeholder="Contoh: PT Mitra Teknik"
              value={form.companyName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Alamat Tujuan </label>
            <Input
              name="addressLine1"
              placeholder="Contoh: Jl. ..."
              value={form.addressLine1}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">No. Telepon</label>
            <Input
              name="phoneNumber"
              placeholder="Contoh: 0822..."
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Tanggal</label>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Nomor Refer PO</label>
            <Input
              name="poNumber"
              placeholder="Contoh: PO-00123"
              value={form.poNumber}
              onChange={handleChange}
            />
          </div>

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
            onClick={handleGenerateNoSuratJalan}
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

export default SuratJalanForm;
