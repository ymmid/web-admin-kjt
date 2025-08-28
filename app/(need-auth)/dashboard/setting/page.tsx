"use client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUsers } from "@/services/api/setting";
import { IconDotsVertical } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
export default function SettingPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-users"],
    queryFn: getAllUsers,
  });

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-2xl font-bold">Setting</h1>
      <Tabs defaultValue="account" className="">
        <TabsList>
          <TabsTrigger value="account">Users</TabsTrigger>
          <TabsTrigger value="password">Incoming Features</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="p-5  mt-5">
            <div className="gap-5 flex justify-end">
              <Button className="">+ Tambah User</Button>
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
                  <TableRow key={item.name}>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
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
    </div>
  );
}
