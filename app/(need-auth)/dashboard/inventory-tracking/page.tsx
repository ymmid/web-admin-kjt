"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiSearch } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getAllInventoryTracking,
  deleteInventoryTracking,
  InventoryTracking,
  updateInventoryTracking,
  getAllInventoryTrackingNoLimit,
} from "@/services/api/inventory-tracking";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatRupiah } from "@/lib/formatRupiah";
import dayjs from "dayjs";
import { useState } from "react";
import { Label } from "@/components/ui/label";
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
import ModalAddInventory from "@/components/inventory-tracking/ModalAddInventory";
import { exportInventoryToExcel } from "@/lib/exportToExelInventoryTracking";

export default function InventoryTrackingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InventoryTracking | null>(null);

  const [open, setOpen] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [form, setForm] = useState({
    id: selectedInvoice?.id,
    sold_at: "",
    sell_price: "",
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const {
    data: basic,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["inventory-tracking"],
    queryFn: () => getAllInventoryTracking(currentPage, search, month, year),
    placeholderData: (prev) => prev,
  });

  const meta = basic?.meta;
  const data = basic?.data;
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { sold_at: string | Date; sell_price: number };
    }) => updateInventoryTracking(id, payload),
    onSuccess: () => {
      refetch();
      toast.success("Data berhasil di edit");
      setForm({
        id: 0,
        sold_at: "",
        sell_price: "",
      });
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal menghapus data");
      }
    },
  });
  function handleSubmit() {
    const payload = {
      ...form,
      id: selectedInvoice?.id,
      sold_at: form.sold_at ? new Date(form.sold_at) : undefined,
      sell_price: parseInt(form.sell_price) || 0,
    };
    updateMutation.mutate({
      id: payload.id ?? 0,
      payload: {
        sold_at: payload.sold_at || "",
        sell_price: payload.sell_price || 0,
      },
    });

    console.log(payload);
    setOpen(false);
  }
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInventoryTracking(id),
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
  if (deleteMutation.isPending) {
    return <Loading />;
  }
  async function handleExportToExcel() {
    try {
      const allData = await getAllInventoryTrackingNoLimit(month, year);
      console.log(allData);
      exportInventoryToExcel(allData, month, year);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil semua data!");
    }
  }

  return (
    <div className="p-5 ">
      <h1 className="text-2xl font-bold">
        Data Pembelian Dan Penjualan Barang
      </h1>
      <div className="flex flex-col gap-3 mt-5 md:flex-row md:items-center md:gap-3">
        <Input
          type="search"
          placeholder="Search..."
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          className="w-full md:w-auto"
        />

        <Button
          onClick={() => {
            setSearch(tempSearch);
            refetch();
          }}
          className="w-full md:w-auto"
        >
          <FiSearch size={20} />
        </Button>

        <Select
          value={month?.toString()}
          onValueChange={(value) => setMonth(Number(value))}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Pilih Bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bulan</SelectLabel>
              <SelectItem value="1">Januari</SelectItem>
              <SelectItem value="2">Februari</SelectItem>
              <SelectItem value="3">Maret</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">Mei</SelectItem>
              <SelectItem value="6">Juni</SelectItem>
              <SelectItem value="7">Juli</SelectItem>
              <SelectItem value="8">Agustus</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">Oktober</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">Desember</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={year?.toString()}
          onValueChange={(value) => setYear(Number(value))}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tahun</SelectLabel>
              {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={() => {
            setCurrentPage(1);
            refetch();
            setSearch("");
          }}
          className="w-full md:w-auto"
        >
          Apply Filter
        </Button>
      </div>

      <Card className="p-5  mt-5">
        <div className="gap-5 flex flex-wrap justify-end">
          <Button onClick={handleExportToExcel}>Export To Excel</Button>

          <ModalAddInventory />
        </div>
        <AlertDialog open={openDialogDelete} onOpenChange={setOpenDialogDelete}>
          <Sheet open={open} onOpenChange={setOpen}>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[100px]">No Transaksi</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tangaal Pembelian</TableHead>
                  <TableHead> Tanggal Penjualan </TableHead>
                  <TableHead>Rencana Penggunaan</TableHead>
                  <TableHead>jumlah </TableHead>
                  <TableHead className="text-right">Harga beli</TableHead>
                  <TableHead className="text-right">Harga jual</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Loading />
                    </TableCell>
                  </TableRow>
                ) : !data || data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-6"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.transaction_no}
                      </TableCell>
                      <TableCell>{invoice.name}</TableCell>
                      <TableCell>
                        {invoice.bought_at
                          ? dayjs(invoice.bought_at).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {invoice.sold_at
                          ? dayjs(invoice.sold_at).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>{invoice.planned_usage}</TableCell>
                      <TableCell>{invoice.quantity} </TableCell>
                      <TableCell>{formatRupiah(+invoice.buy_price)}</TableCell>
                      <TableCell className="text-right">
                        {formatRupiah(+invoice.sell_price)}
                      </TableCell>
                      <TableCell className="text-right">
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
                                  setSelectedInvoice(invoice);
                                  setOpen(true);
                                }, 50);
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
                                  setDeleteTargetId(invoice.id);
                                }, 50);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      if (meta && meta.currentPage > 1) {
                        setCurrentPage(meta.currentPage - 1);
                      }
                    }}
                    className={
                      meta?.currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {/* Nomor halaman dinamis */}
                {Array.from({ length: meta?.totalPages ?? 1 }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(index + 1);
                      }}
                      isActive={meta?.currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      if (meta && meta.currentPage < meta.totalPages) {
                        setCurrentPage(meta.currentPage + 1);
                      }
                    }}
                    className={
                      meta && meta.currentPage === meta.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Tandai item ini sebagai terjual</SheetTitle>
                <SheetDescription>
                  Dengan mengklik simpan item ini otomatis ditandai sebagai
                  terjual
                </SheetDescription>
                <SheetTitle>
                  No Transaksi : {selectedInvoice?.transaction_no}
                </SheetTitle>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                  <Label htmlFor="sheet-demo-name">Harga Penjualan</Label>
                  <Input
                    name="sell_price"
                    type="number"
                    value={form.sell_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="sheet-demo-username">Tanggal Terjual</Label>
                  <Input
                    name="sold_at"
                    type="date"
                    value={form.sold_at}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => handleSubmit()}>Save changes</Button>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

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
      </Card>
    </div>
  );
}
