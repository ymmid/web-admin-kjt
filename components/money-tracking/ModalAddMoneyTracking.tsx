"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createMoneyTracking } from "@/services/api/money-tracking"; // <-- Pake API money-tracking
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ModalAddMoneyTracking() {
  const queryClient = useQueryClient();
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    transaction_no: "tes",
    purpose: "",
    flow_type: "",
    transaction_date: "",
    amount: "",
    proof_url: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const mutation = useMutation({
    mutationFn: createMoneyTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["money-tracking"],
      });
      toast.success("Data berhasil ditambahkan");
      setForm({
        transaction_no: "tes",
        purpose: "",
        flow_type: "",
        transaction_date: "",
        amount: "",
        proof_url: "",
      });
      setOpen(false);
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan");
      }
      setOpen(false);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("transaction_no", "tes");
    formData.append("purpose", form.purpose);
    formData.append("flow_type", form.flow_type);
    formData.append("transaction_date", form.transaction_date); // "YYYY-MM-DD"
    formData.append("amount", form.amount);
    formData.append("proof_url", "");

    // **INI POIN PENTING**
    // Kirim file saja kalau ada, ga usah kirim proof_url dari FE
    if (proofFile) {
      formData.append("imageFile", proofFile); // Nama field HARUS sama dengan yang BE expect!
    }

    mutation.mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Tambah Transaksi</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Uang</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Keperluan</Label>
              <Input
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Jenis Transaksi</Label>
              <Select
                value={form.flow_type}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, flow_type: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis transaksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">income</SelectItem>
                  <SelectItem value="expense">expense</SelectItem>
                  {/* Tambah opsi cashflow type lain jika ada */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tanggal Transaksi</Label>
              <Input
                name="transaction_date"
                type="date"
                value={form.transaction_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Nominal</Label>
              <Input
                name="amount"
                type="number"
                value={form.amount}
                min={0}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Bukti (Opsional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setProofFile(file || null);

                  // Optional: Untuk local preview, bisa pakai:
                  // setForm(f => ({...f, proof_url: file ? URL.createObjectURL(file) : ""}));
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Batal
              </Button>
            </DialogClose>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
