"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvoiceForm from "@/components/create-work-permit/invoiceForm";
import SuratJalanForm from "@/components/create-work-permit/SuratJalanForm";
import BeritaAcaraForm from "@/components/create-work-permit/BeritaAcaraForm";

export default function CreateWorkPermitPage() {
  const [letterType, setLetterType] = useState<string>("");
  return (
    <div className="min-h-screen  px-4 py-8 mb-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">
          Buat Surat Jalan Tugas/Invoice/Bast
        </h1>
        <Select onValueChange={(value) => setLetterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Jenis Surat" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pilih Jenis Surat</SelectLabel>
              <SelectItem value="surat-jalan">
                Surat Jalan (Untuk Barang)
              </SelectItem>
              <SelectItem value="bast">
                Berita Acara/Bast (Untuk Jasa)
              </SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {(!letterType || letterType === "") && (
        <div className="font-bold text-2xl text-center mt-10">
          Pilih Type Surat Terlebih dulu
        </div>
      )}

      {letterType === "surat-jalan" && <SuratJalanForm></SuratJalanForm>}
      {letterType === "bast" && <BeritaAcaraForm></BeritaAcaraForm>}
      {letterType === "invoice" && <InvoiceForm></InvoiceForm>}
    </div>
  );
}
