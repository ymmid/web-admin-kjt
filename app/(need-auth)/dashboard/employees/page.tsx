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
import { useMemo } from "react";
import { IconDotsVertical } from "@tabler/icons-react";

type Employee = {
  id: string;
  name: string;
  nik: string;
  salary: number;
  position: string;
};

export default function EmployeeTabs() {
  const data: Employee[] = useMemo(
    () => [
      {
        id: "1",
        name: "Andi Setiawan",
        nik: "19820314",
        salary: 7500000,
        position: "Staff IT",
      },
      {
        id: "2",
        name: "Siti Aminah",
        nik: "19850421",
        salary: 6500000,
        position: "HRD",
      },
      {
        id: "3",
        name: "Budi Santoso",
        nik: "19790917",
        salary: 12000000,
        position: "Manager",
      },
      {
        id: "4",
        name: "Dewi Lestari",
        nik: "19900112",
        salary: 8500000,
        position: "Marketing",
      },
      {
        id: "5",
        name: "Agus Pratama",
        nik: "19950205",
        salary: 7000000,
        position: "Support",
      },
    ],
    [],
  );

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
          `Rp ${row.original.salary.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
          })}`,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const employee = row.original;
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
                <DropdownMenuItem>Edit</DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
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

  const table = useReactTable<Employee>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Tabs defaultValue="employees" className="w-full flex-col gap-4 mt-5  ">
      <h1 className="text-2xl px-5 font-bold">Data Karyawan</h1>
      <div className="flex justify-end px-5">
        <Button>+ Tambah Karyawan</Button>
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
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
                  <TableCell colSpan={columns.length} className="text-center">
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
  );
}
