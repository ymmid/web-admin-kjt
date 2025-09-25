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
import { useQuery } from "@tanstack/react-query";
import {
  generateNewNumber,
  getLastNumberByScope,
} from "@/services/api/create-work-permit";
import { generateBeritaAcaraFE } from "@/lib/generateBast";
import { toast } from "sonner";

const BeritaAcaraForm = () => {
  const [form, setForm] = useState({
    recipientName: "",
    companyName: "",
    addressLine1: "",

    phoneNumber: "",
    bastNo: "",
    date: "",
    poNumber: "",
    projectNo: "",
    items: [{ deskripsi: "", qty: "", harga: "" }],
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormComplete = Object.values(form).every((val) => val !== "");
  const generateDocx = () => {};
  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm((prev) => ({ ...prev, items: newItems }));
  };
  const { data, isLoading, isFetching, isError, error, refetch, isSuccess } =
    useQuery({
      queryKey: ["bast", "last-number"],
      queryFn: () => getLastNumberByScope("bast"),
      enabled: false,
      refetchOnWindowFocus: false,
    });
  const formatInvoiceNumber = (prefix: string, now: Date, sequence: number) => {
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const padded = String(sequence).padStart(4, "0");
    return `${prefix}/BAST/${month}.${year}/${padded}`;
  };
  const handleGenerateNoBast = async () => {
    const result = await refetch();
    if (result.data) {
      const sequence = result.data.last_number + 1;

      const newInvoiceNo = formatInvoiceNumber("KJT", new Date(), sequence);
      setForm((prev) => ({ ...prev, bastNo: newInvoiceNo }));
    }
  };
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { deskripsi: "", qty: "", harga: "" }],
    }));
  };
  const handleGenerateBast = async () => {
    try {
      generateBeritaAcaraFE(form);
      await generateNewNumber("bast");
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };
  return (
    <Card className="w-full mt-5 h-full shadow-lg border">
      <CardHeader />
      <div className="text-center font-semibold text-2xl">Berita Acara</div>
      <div className="flex flex-col gap-3 px-5 md:flex-row md:gap-5 md:justify-end">
        <Button onClick={() => handleGenerateNoBast()}>
          Generate No Invoice
        </Button>
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
            <label className="block mb-1 font-medium">BAST NO</label>
            <Input
              name="bastNo"
              placeholder="Contoh: PT Mitra Teknik"
              value={form.bastNo}
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
            <label className="block mb-1 font-medium">Nomor PO</label>
            <Input
              name="poNumber"
              placeholder="Contoh: PO-00123"
              value={form.poNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Project No</label>
            <Input
              name="projectNo"
              placeholder="Contoh: PO-00123"
              value={form.projectNo}
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
            onClick={handleGenerateBast}
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

export default BeritaAcaraForm;
