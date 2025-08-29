"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { updateJobList } from "@/services/api/job-list";
import type { UpdateJobList } from "@/services/api/job-list";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

interface ModalEditEmployeeProps {
  id: number;
  data: UpdateJobList;
  openDialogEdit: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalEditJobList(props: ModalEditEmployeeProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    job_name: "",
    company_name: "",
    status: "",
    start_date: "",
    end_date: "",
    reviewer: "",
    amount: 0,
  });

  useEffect(() => {
    if (props.data) {
      setForm({
        job_name: props.data.job_name ?? "",
        company_name: props.data.company_name ?? "",
        status: props.data.status ?? "",
        start_date: props.data.end_date
          ? String(props.data.start_date).slice(0, 10)
          : "",
        end_date: props.data.end_date
          ? String(props.data.end_date).slice(0, 10)
          : "",
        reviewer: "Pak Rahmat",
        amount: props.data.amount ?? "",
      });
    }
  }, [props.data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UpdateJobList) => updateJobList(props.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-list"] });
      toast.success("Data berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi";
      toast.error(errorMessage);
    },
  });
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(form);
    setForm({
      job_name: "",
      company_name: "",
      status: "",
      start_date: "",
      end_date: "",
      reviewer: "",
      amount: 0,
    });
    props.onOpenChange(false);
  }

  return (
    <Dialog open={props.openDialogEdit} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pekerjaan</DialogTitle>
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
                  <SelectValue placeholder="Pilih reviewer" />
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

            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
