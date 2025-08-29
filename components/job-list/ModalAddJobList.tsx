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
// <-- Pake API money-tracking
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createJobList } from "@/services/api/job-list";

export default function ModalAddJobList() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    job_name: "",
    company_name: "",
    status: "",
    start_date: "",
    end_date: "",
    reviewer: "",
    amount: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const mutation = useMutation({
    mutationFn: createJobList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["job-list"],
      });
      toast.success("Data berhasil ditambahkan");
      setForm({
        job_name: "",
        company_name: "",
        status: "",
        start_date: "",
        end_date: "",
        reviewer: "",
        amount: "",
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

    mutation.mutate(form);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Tambah Pekerjaan</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Uang</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nama Pekerjaan</Label>
              <Input
                name="job_name"
                value={form.job_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Nama Perusahaan</Label>
              <Input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In_Process">In Process</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Tanggal Mulai</Label>
              <Input
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Tanggal Selesai</Label>
              <Input
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Reviewer</Label>
              <Select
                value={form.reviewer}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, reviewer: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pak Rahmat">Pak Rahmat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Nominal</Label>
              <Input
                name="amount"
                type="number"
                min={0}
                value={form.amount}
                onChange={handleChange}
                required
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
