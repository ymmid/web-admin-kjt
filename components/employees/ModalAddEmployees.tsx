import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AlertDialogHeader } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/services/api/employees";
import { toast } from "sonner";
import { AxiosError } from "axios";

const ModalAddEmployees = () => {
  const [form, setForm] = useState({
    name: "",
    nik: "",
    rfid_code: "",
    position: "",
    department: "",

    salary: "",
    hire_date: "",
    imageFile: undefined,
  });

  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
      toast.success("Data berhasil ditambahkan");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi";
      toast.error(errorMessage);
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    const payload = {
      ...form,
      hire_date: new Date(form.hire_date).toISOString(),
    };
    mutate(payload);
    setForm({
      name: "",
      nik: "",
      rfid_code: "",
      position: "",
      department: "",
      salary: "",
      hire_date: "",
      imageFile: undefined,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+ Tambah Karyawan</Button>
      </DialogTrigger>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Tambah Karyawan</DialogTitle>
          <DialogDescription>
            Isi data karyawan dengan lengkap.
          </DialogDescription>
        </AlertDialogHeader>
        <form
          className="space-y-3 mt-3"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <Label htmlFor="name">Nama*</Label>
            <Input
              id="name"
              name="name"
              className="mt-2"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="nik">NIK*</Label>
            <Input
              id="nik"
              name="nik"
              className="mt-2"
              value={form.nik || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="rfid_code">RFID Code*</Label>
            <Input
              id="rfid_code"
              name="rfid_code"
              className="mt-2"
              value={form.rfid_code || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="position">Posisi*</Label>
            <Input
              id="position"
              name="position"
              className="mt-2"
              value={form.position || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">Departemen*</Label>
            <Input
              id="department"
              name="department"
              className="mt-2"
              value={form.department || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="salary">Gaji</Label>
            <Input
              id="salary"
              name="salary"
              className="mt-2"
              type="number"
              value={form.salary || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="hire_date">Tanggal Masuk</Label>
            <Input
              id="hire_date"
              name="hire_date"
              type="date"
              className="mt-2"
              value={form.hire_date || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="imageFile">Foto Profil</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Simpan</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddEmployees;
