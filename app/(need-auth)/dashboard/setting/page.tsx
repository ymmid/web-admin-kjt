"use client";
import ModalAddUser from "@/components/setting/ModalAddUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteUser, getAllUsers, UpdateUserDto } from "@/services/api/setting";
import { IconDotsVertical } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { useState } from "react";
import ModalEditUser from "@/components/setting/ModalEditUser";

export default function SettingPage() {
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [editData, setEditData] = useState<UpdateUserDto | null>(null);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-users"],
    queryFn: getAllUsers,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
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
  console.log(data);
  return (
    <div className="p-5 space-y-5">
      {editData && (
        <ModalEditUser
          id={editTargetId || 0}
          data={editData}
          openDialogEdit={openDialogEdit}
          onOpenChange={setOpenDialogEdit}
        />
      )}
      <h1 className="text-2xl font-bold">Setting</h1>
      <Tabs defaultValue="account" className="">
        <TabsList>
          <TabsTrigger value="account">Users</TabsTrigger>
          <TabsTrigger value="password">Incoming Features</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="p-5  mt-5">
            <div className="gap-5 flex justify-end">
              <ModalAddUser></ModalAddUser>
            </div>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[100px]">Nama</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right"> Role </TableHead>

                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.username}
                    </TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.email}</TableCell>

                    <TableCell className="text-right"> {item.role}</TableCell>
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
                                setEditTargetId(+item.id);
                                setEditData(item);
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
          </Card>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
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
    </div>
  );
}
