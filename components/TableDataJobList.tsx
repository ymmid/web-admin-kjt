"use client";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteJobList,
  getAllJobList,
  UpdateJobList,
} from "@/services/api/job-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";
import Loading from "./Loading";
import { toast } from "sonner";
import ModalAddJobList from "./job-list/ModalAddJobList";
import { formatRupiah } from "@/lib/formatRupiah";
import ModalEditJobList from "./job-list/ModalEditJobList";

export default function TableDataJobList() {
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [editData, setEditData] = useState<UpdateJobList | null>(null);
  const {
    data: basic,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["job-list"],
    queryFn: () => getAllJobList(),
  });
  const data = basic?.data || [];
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJobList(id),
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
    <div className="p-5">
      <Card className="p-5 ">
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div className="font-bold text-2xl">Tabel Data Pekerjaan</div>
          <div className="flex gap-2 flex-wrap items-center justify-end">
            <Button variant="outline">Export Excel</Button>
            <ModalAddJobList />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[100px]">No Transaksi</TableHead>
              <TableHead>Nama Pekerjaan</TableHead>
              <TableHead>Nama PT</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead className="text-right">Riviewer</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9}>Loading...</TableCell>
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
              data.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.transaction_no}
                  </TableCell>
                  <TableCell>{invoice.job_name}</TableCell>
                  <TableCell>{invoice.company_name}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>
                    {invoice.start_date
                      ? dayjs(invoice.start_date).format("DD/MM/YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {invoice.end_date
                      ? dayjs(invoice.end_date).format("DD/MM/YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">Pak Rahmat</TableCell>
                  <TableCell className="text-right">
                    {formatRupiah(invoice.amount)}
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
                              setOpenDialogEdit(true);
                              setEditTargetId(+invoice.id);
                              setEditData(invoice);
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
      </Card>
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
      {editData && (
        <ModalEditJobList
          id={editTargetId || 0}
          data={editData}
          openDialogEdit={openDialogEdit}
          onOpenChange={setOpenDialogEdit}
        ></ModalEditJobList>
      )}
    </div>
  );
}
