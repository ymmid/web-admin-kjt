"use client";

import { useMemo } from "react";
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

type JobItem = { name: string; nik: string; jobs: string[] };
type DailyData = { date: string; items: JobItem[] };

// === Hardcode data contoh (siap hingga 4 orang per hari) ===
const DATA_SOURCE: DailyData[] = [
  {
    date: "2025-08-17",
    items: [
      {
        name: "Reza",
        nik: "EMP-001",
        jobs: ["Servis mesin A", "Cek oli line 1"],
      },
      {
        name: "Rifky",
        nik: "EMP-002",
        jobs: ["Kalibrasi sensor", "Dokumentasi harian"],
      },
      // nanti tinggal tambah dua lagi untuk 4 orang/hari
      // { name: "Orang-3", nik: "EMP-003", jobs: ["..."] },
      // { name: "Orang-4", nik: "EMP-004", jobs: ["..."] },
    ],
  },
  {
    date: "2025-08-20",
    items: [
      { name: "Reza", nik: "EMP-001", jobs: ["Setup mesin CNC B"] },
      { name: "Rifky", nik: "EMP-002", jobs: ["QA sampling batch #192"] },
    ],
  },
];

function getDaysInMonth(year: number, monthIndex0: number) {
  const days: Date[] = [];
  const d = new Date(year, monthIndex0, 1);
  while (d.getMonth() === monthIndex0) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export default function DailyJobPage() {
  // Atur bulan & tahun yang ingin ditampilkan
  const year = 2025;
  const monthIndex0 = 7; // 0=Jan, jadi 7 = Agustus
  const monthName = useMemo(
    () =>
      new Date(year, monthIndex0, 1).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      }),
    [year, monthIndex0],
  );

  const days = useMemo(
    () => getDaysInMonth(year, monthIndex0),
    [year, monthIndex0],
  );

  const dataByDate = useMemo(() => {
    const map = new Map<string, JobItem[]>();
    for (const d of DATA_SOURCE) map.set(d.date, d.items);
    return map;
  }, []);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">
          Laporan Harian Pekerjaan • {monthName}
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
        {days.map((d) => {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          const key = `${yyyy}-${mm}-${dd}`;
          const items = dataByDate.get(key) ?? [];

          return (
            <Card key={key} className="border shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base font-semibold">
                  {d.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {items.length === 0 ? (
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
                      {items.slice(0, 4).map((it, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {it.name}
                          </TableCell>
                          <TableCell>{it.nik}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside space-y-1">
                              {it.jobs.map((j, i) => (
                                <li key={i} className="text-sm">
                                  {j}
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
