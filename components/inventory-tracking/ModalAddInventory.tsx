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
import {
  createInventoryTracking,
  getAllInventoryTracking,
  InventoryTracking,
} from "@/services/api/inventory-tracking";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AddInventoryDialog() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    transaction_no: "tes",
    name: "",
    quantity: "",
    proof_url: "",
    buy_price: "",
    sell_price: "",
    planned_usage: "",
    bought_at: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const mutation = useMutation({
    mutationFn: createInventoryTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory-tracking"],
      });
      toast.success("Data berhasil ditambahkan");
      setForm({
        transaction_no: "tes",
        name: "",
        quantity: "",
        proof_url: "",
        buy_price: "",
        sell_price: "",
        planned_usage: "",
        bought_at: "",
      });
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan");
      }
    },
  });
  const { data, isLoading, isError, error, refetch } = useQuery<
    InventoryTracking[]
  >({
    queryKey: ["inventory-tracking"],
    queryFn: getAllInventoryTracking,
  });
  function handleSubmit() {
    const payload = {
      ...form,
      quantity: parseInt(form.quantity) || 0,
      buy_price: parseInt(form.buy_price) || 0,
      sell_price: parseInt(form.sell_price) || 0,
      bought_at: form.bought_at ? new Date(form.bought_at) : undefined, // ⬅️ konversi di sini
    };
    console.log(payload);
    mutation.mutate(payload);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+ Tambah Barang</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Barang</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nama Barang</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Jumlah</Label>
            <Input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Harga Beli</Label>
            <Input
              name="buy_price"
              type="number"
              value={form.buy_price}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Harga Jual</Label>
            <Input
              name="sell_price"
              type="number"
              value={form.sell_price}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Rencana Penggunaan</Label>
            <Select
              value={form.planned_usage}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, planned_usage: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih rencana penggunaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pemakaian kantor">
                  Pemakaian Kantor
                </SelectItem>
                <SelectItem value="keperluan instalasi">
                  Keperluan Instalasi
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Tanggal Pembelian</Label>
            <Input
              name="bought_at"
              type="date"
              value={form.bought_at}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
