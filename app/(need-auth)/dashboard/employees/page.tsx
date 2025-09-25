"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  UpdateEmployeeDto,
} from "@/services/api/employees";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ModalAddEmployees from "@/components/employees/ModalAddEmployees";
import ModalEditEmployees from "@/components/employees/ModalEditEmployees";

type Employee = {
  id: string;
  name: string;
  nik: string;
  salary: string;
  position: string;
};

export default function EmployeeTabs() {
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [editData, setEditData] = useState<UpdateEmployeeDto | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getAllEmployees"],
    queryFn: getAllEmployees,
  });
  console.log(data);
  console.log(deleteTargetId);
  const { mutate, isPending } = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      refetch();
      toast.success("Data berhasil ditambahkan");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // Cek apakah backend kirim pesan error
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

  const columns: ColumnDef<Employee>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nama",
      },
      {
        accessorKey: "nik",
        header: "NIK",
      },
      {
        accessorKey: "position",
        header: "Jabatan",
      },
      {
        accessorKey: "salary",
        header: "Gaji",
        cell: ({ row }) =>
          `Rp ${Number(row.original.salary).toLocaleString("id-ID", {
            minimumFractionDigits: 0,
          })}`,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
                >
                  <IconDotsVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => {
                    setTimeout(() => {
                      setOpenDialogEdit(true);
                      setEditTargetId(+row.original.id);
                      setEditData(row.original);
                    }, 100);
                  }}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    setTimeout(() => {
                      setOpenDialogDelete(true);
                      setDeleteTargetId(+row.original.id);
                    }, 50);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      toast.success("Data berhasil dihapus");

      refetch();
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal menghapus data");
      }
    },
  });
  const table = useReactTable({
    data: Array.isArray(data) ? data : [], // INI KUNCI UTAMANYA!
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const rows = table?.getRowModel && table.getRowModel().rows;
  return (
    <>
      <Tabs defaultValue="employees" className="w-full flex-col gap-4 mt-5  ">
        <h1 className="text-2xl px-5 font-bold">Data Karyawan</h1>
        <div className="flex justify-end px-5">
          <ModalAddEmployees></ModalAddEmployees>
          {editData && (
            <ModalEditEmployees
              id={editTargetId || 0}
              data={editData}
              openDialogEdit={openDialogEdit}
              onOpenChange={setOpenDialogEdit}
            />
          )}
        </div>
        <TabsContent
          value="employees"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-10">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {Array.isArray(rows) && rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-10">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={Array.isArray(columns) ? columns.length : 1}
                      className="text-center"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="lainnya" className="px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
        </TabsContent>
      </Tabs>

      <AlertDialog open={openDialogDelete} onOpenChange={setOpenDialogDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTargetId !== null) {
                  deleteMutation.mutate(deleteTargetId);
                }
                setDeleteTargetId(null);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
