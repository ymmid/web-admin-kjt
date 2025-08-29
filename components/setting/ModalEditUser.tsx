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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { updateUser, UpdateUserDto } from "@/services/api/setting";

interface ModalEditUserProps {
  id: number;
  data: UpdateUserDto;
  openDialogEdit: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalEditUser(props: ModalEditUserProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateUserDto>({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (props.data) {
      console.log(props.data);
      setForm({
        name: props.data.name ?? "",
        username: props.data.username ?? "",
        email: props.data.email ?? "",
        password: props.data.password ?? "",
        role: props.data.role ?? "",
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
    mutationFn: (payload: UpdateUserDto) => updateUser(props.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      toast.success("User berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi";
      toast.error(errorMessage);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Buat salinan form tanpa field kosong
    const filteredForm = Object.fromEntries(
      Object.entries(form).filter(([_, value]) => value !== ""),
    ) as Partial<UpdateUserDto>; // Tipe bisa partial, karena field yang kosong di-skip

    mutate(filteredForm);

    // Reset & tutup modal
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "",
    });
    props.onOpenChange(false);
  }

  return (
    <Dialog open={props.openDialogEdit} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nama</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Username</Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, role: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="employee">karyawan</SelectItem>
                </SelectContent>
              </Select>
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
