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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllDailyJobs } from "@/services/api/daily-job";

export default function DailyJobPage() {
  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["daily-jobs"],
    queryFn: () => getAllDailyJobs(month, year),
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
          <Select
            value={month?.toString()}
            onValueChange={(value) => setMonth(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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
              refetch();
            }}
          >
            Apply Filter
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setMonth(undefined);
              setYear(undefined);
              setTimeout(() => {
                refetch(); // ini akan jalan setelah state punya waktu update
              }, 100); // bisa pakai 0 atau 10–50ms jika masih belum cukup
            }}
          >
            Ke Bulan Ini
          </Button>
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
