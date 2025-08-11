"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { saveAs } from "file-saver";

interface FormData {
  documentNumber: string;
  senderName: string;
  senderPosition: string;
  teamName: string;
  personels: string;
  jobDescription: string;
  jobLocation: string;
  departureDate: string;
  returnDate: string;
  notes: string;
}

export default function CreateWorkPermitPage() {
  const [formData, setFormData] = useState<FormData>({
    documentNumber: "",
    senderName: "",
    senderPosition: "",
    teamName: "",
    personels: "",
    jobDescription: "",
    jobLocation: "",
    departureDate: "",
    returnDate: "",
    notes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormComplete = Object.values(formData).every(
    (val) => val.trim() !== "",
  );

  const generateDocx = async () => {
    const res = await fetch("/api/generate-work-permit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      alert("Gagal generate surat.");
      return;
    }

    const blob = await res.blob();
    saveAs(blob, `Surat-Jalan-${formData.documentNumber || "Tugas"}.docx`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-4xl h-full shadow-lg border">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            📄 Buat Surat Jalan Tugas
          </h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Nomor Surat</label>
              <Input
                name="documentNumber"
                placeholder="Contoh: 001/SJ/08/2025"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Nama Penanggung Jawab
              </label>
              <Input
                name="senderName"
                placeholder="Contoh: Budi Santoso"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Jabatan</label>
              <Input
                name="senderPosition"
                placeholder="Contoh: Supervisor Lapangan"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Nama Tim</label>
              <Input
                name="teamName"
                placeholder="Contoh: Tim Maintenance Mesin"
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                Personel (pisahkan dengan koma)
              </label>
              <Textarea
                name="personels"
                placeholder="Contoh: Joko, Sari, Andi"
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Jenis Pekerjaan</label>
              <Textarea
                name="jobDescription"
                placeholder="Contoh: Perbaikan wiring panel utama di area produksi"
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Lokasi Kerja</label>
              <Input
                name="jobLocation"
                placeholder="Contoh: PT Karya Jaya Teknik, Cikarang"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Tanggal Berangkat
              </label>
              <Input type="date" name="departureDate" onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Tanggal Kembali</label>
              <Input type="date" name="returnDate" onChange={handleChange} />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Catatan Tambahan</label>
              <Textarea
                name="notes"
                placeholder="Contoh: Membawa tools sendiri"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={generateDocx}
              disabled={!isFormComplete}
              className="px-6 py-3 text-base font-semibold"
            >
              🡇 Download Surat Jalan
            </Button>
            {!isFormComplete && (
              <p className="text-sm text-red-500 mt-2">
                * Harap lengkapi semua data terlebih dahulu
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
