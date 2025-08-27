"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import type { MoneyTracking } from "@/services/api/money-tracking";
import {
  deleteMoneyTracking,
  getAllMoneyTracking,
} from "@/services/api/money-tracking";
import dayjs from "dayjs";
import { formatRupiah } from "@/lib/formatRupiah";
import AddMoneyTracking from "@/components/money-tracking/ModalAddMoneyTracking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import { toast } from "sonner";
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
import Image from "next/image";

export default function MoneyTrakingPage() {
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<MoneyTracking | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useQuery<
    MoneyTracking[]
  >({
    queryKey: ["money-tracking"],
    queryFn: getAllMoneyTracking,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMoneyTracking(id),
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
  return (
    <div className="p-5 ">
      <h1 className="text-2xl font-bold">Data Uang Masuk Dan Keluar</h1>
      <div className="flex gap-3 mt-5">
        <Input type="search" placeholder="Search..." className="" />
        <Button>
          <FiSearch size={20} />
        </Button>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Apply Filter</Button>
      </div>
      <Card className="p-5  mt-5">
        <div className="gap-5 flex justify-end">
          <Button className=" ">Export To Exel</Button>

          <AddMoneyTracking></AddMoneyTracking>
        </div>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[100px]">No Transaksi</TableHead>
              <TableHead>keperluan</TableHead>
              <TableHead>Jenis Transaksi</TableHead>
              <TableHead> Tanggal Transaksi </TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.transaction_no}
                </TableCell>
                <TableCell>{item.purpose}</TableCell>
                <TableCell>{item.flow_type}</TableCell>
                <TableCell>
                  {item.transaction_date
                    ? dayjs(item.transaction_date).format("DD/MM/YYYY")
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {formatRupiah(+item.amount)}
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
                            setSelectedInvoice(item);
                            setOpen(true);
                          }, 50);
                        }}
                      >
                        Detail
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => {
                          setTimeout(() => {
                            setOpenDialogDelete(true);
                            setDeleteTargetId(item.id);
                          }, 50);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detail Items</SheetTitle>
            <SheetDescription>
              Menampilkan detail untuk transaksi
            </SheetDescription>
            <SheetTitle>
              No Transaksi : {selectedInvoice?.transaction_no}
            </SheetTitle>
            <SheetDescription>
              <div>
                <strong>Keperluan : </strong> {selectedInvoice?.purpose}
              </div>
              <div>
                <strong>Jenis Transaksi : </strong> {selectedInvoice?.flow_type}
              </div>
              <div>
                <strong>Tanggal Transaksi : </strong>

                {dayjs(selectedInvoice?.transaction_date).format("DD/MM/YYYY")}
              </div>
              <div>
                <strong>Nominal : </strong>
                {formatRupiah(Number(selectedInvoice?.amount ?? 0))}
              </div>
              <div>
                <strong>Dibuat : </strong>
                {dayjs(selectedInvoice?.created_at).format("DD/MM/YYYY")}
              </div>
              <div>
                <strong>Diupdate : </strong> {selectedInvoice?.updated_at}
              </div>
              <div>
                <strong>Foto Struk : </strong>
                {selectedInvoice?.proof_url ? (
                  <div className="mt-2">
                    <Image
                      src={selectedInvoice?.proof_url || "/no-image.png"}
                      alt="Foto Struk"
                      width={400} // wajib isi width
                      height={300} // wajib isi height
                      className="max-h-52 rounded border object-contain"
                    />
                  </div>
                ) : (
                  <span className="italic text-muted-foreground ml-2">
                    Tidak ada foto
                  </span>
                )}
              </div>
            </SheetDescription>
          </SheetHeader>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
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
    </div>
  );
}
