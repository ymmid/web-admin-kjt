"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllDailyJobs } from "@/services/api/daily-job";

export default function DailyJobPage() {
  const [filter, setFilter] = useState({
    search: "",
    status: "",
    month: "",
    year: "",
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["daily-jobs", filter],
    queryFn: ({ queryKey }) => getAllDailyJobs(),
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">
          Laporan Harian Pekerjaan •{" "}
          {data?.[0] &&
            (() => {
              const [year, month] = data[0].date.split("-");
              return ` ${month}-${year}`;
            })()}
        </h1>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button>Apply Filter</Button>
          <Button variant="outline"> Ke Bulan Ini</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
        {data?.map((items) => {
          return (
            <Card key={items.date} className="border shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base font-semibold">
                  {items.date}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {items.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada data.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[32%]">Nama</TableHead>
                        <TableHead className="w-[20%]">NIK</TableHead>
                        <TableHead>Pekerjaan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.items.slice(0, 4).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.nik}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside space-y-1">
                              {item.jobs.map((j, i) => (
                                <li key={i} className="text-sm">
                                  {j.job_description}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
