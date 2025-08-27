"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllAttendances, Status } from "@/services/api/attendace-summary";
import { useQuery } from "@tanstack/react-query";
import { formatRupiah } from "@/lib/formatRupiah";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

const statusColor: Record<Status, string> = {
  present: "bg-green-600",
  late: "bg-yellow-500",
  sick: "bg-blue-500",
  leave: "bg-indigo-500",
  alpha: "bg-red-600",
  off: "bg-gray-300",
  nodata: "bg-gray-100 border border-dashed border-gray-300",
  overtime: "bg-teal-600",
};

export default function AttendancePage() {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());

  const dim = useMemo(() => daysInMonth(year, month), [year, month]);
  const days = useMemo(
    () => Array.from({ length: dim }, (_, i) => i + 1),
    [dim],
  );
  const year2 = 2025;
  const month2 = 8;
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["attendances-summary", year2, month2],
    queryFn: () => getAllAttendances({ year: year2, month: month2 }),
  });

  return (
    <div className="p-5 space-y-5">
      <Sheet>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">
            Data Absensi Kehadiran Karyawan
          </h1>
          <div className="flex items-center gap-2">
            <MonthPicker
              year={year}
              month={month}
              onChange={(y, m) => {
                setYear(y);
                setMonth(m);
              }}
            />
            <Button>Apply Filter</Button>
            <Button
              variant="outline"
              onClick={() => {
                const t = new Date();
                setYear(t.getFullYear());
                setMonth(t.getMonth());
              }}
            >
              Ke Bulan Ini
            </Button>
          </div>
        </div>
        <Card className="p-4">
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Name</Label>
                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Username</Label>
                <Input id="sheet-demo-username" defaultValue="@peduarte" />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
          <Legend />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-6">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-600 w-48 align-bottom">
                    Karyawan
                  </th>
                  {days.map((d) => (
                    <th
                      key={d}
                      className="text-xs font-medium text-gray-500 text-center px-1 align-bottom"
                    >
                      {pad2(d)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.employees.map((employee, idx) => (
                  <tr key={employee.employee_id}>
                    <td className="align-top pb-2">
                      <div className="font-medium">
                        {employee.employee_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Rate Harian: {formatRupiah(+employee.salary)}
                      </div>
                    </td>
                    {days.map((day) => {
                      const rec = employee.daily_status[day - 1];
                      const st = rec?.status ?? "nodata";
                      return (
                        <SheetTrigger asChild key={day}>
                          <td className="px-1">
                            <div
                              title={`Tanggal ${pad2(day)}| ${rec.status} `}
                              className={cn(
                                "h-5 w-5 rounded-sm transition-transform hover:scale-105",
                                statusColor[st],
                              )}
                            />
                          </td>
                        </SheetTrigger>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>{" "}
        </Card>
        <h1 className="text-2xl font-bold">Data Gaji</h1>
        <Card className="p-4">
          <table>
            <tbody>
              {data?.employees.map((employee, index) => {
                const totalPresent = employee.daily_status.filter(
                  (item) => item.status === Status.Present,
                ).length;
                const totalLeave = employee.daily_status.filter(
                  (item) => item.status === Status.Leave,
                ).length;
                const totalSick = employee.daily_status.filter(
                  (item) => item.status === Status.Sick,
                ).length;
                const totalAlpha = employee.daily_status.filter(
                  (item) => item.status === Status.Alpha,
                ).length;
                const totalOff = employee.daily_status.filter(
                  (item) => item.status === Status.Off,
                ).length;
                const totalNoData = employee.daily_status.filter(
                  (item) => item.status === Status.NoData,
                ).length;
                const totalLate = employee.daily_status.filter(
                  (item) => item.status === Status.Late,
                ).length;
                return (
                  <tr key={`sum-${employee.employee_id}`}>
                    <td className="pt-2">
                      <div className="text-sm font-semibold">
                        Total Gaji {employee.employee_name}
                      </div>
                    </td>
                    <td colSpan={employee.daily_status.length} className="pt-2">
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <span className="font-semibold">
                          {formatRupiah(Math.round(+employee?.salary))}
                        </span>
                        <span>Hadir: {totalPresent}</span>
                        <span>Terlambat: {totalLate}</span>
                        <span>Sakit: {totalSick}</span>

                        <span>Izin: {totalLeave}</span>
                        <span>Alpha: {totalAlpha}</span>
                        <span>Off: {totalOff}</span>
                        <span>Data kosong: {totalNoData}</span>
                        <span>lembur: 8 jam , Total : Rp 300.000 </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              Total Gaji Semua Karyawan:{" "}
              <span className="font-semibold ">Rp 5.000.000</span>
            </div>
            <div className="text-xs text-gray-500">
              *Simulasi kebijakan: Telat dipotong 10%, Sakit dibayar penuh,
              Izin/Alpha sesuai konfigurasi.
            </div>
          </div>
        </Card>{" "}
      </Sheet>
    </div>
  );
}

function Legend() {
  const items: { status: Status; label: string }[] = [
    { status: Status.Present, label: "Hadir" },
    { status: Status.Late, label: "Terlambat" },
    { status: Status.Sick, label: "Sakit" },
    { status: Status.Leave, label: "Izin/Cuti" },
    { status: Status.Alpha, label: "Alpha" },
    { status: Status.Off, label: "Libur/Off" },
    { status: Status.NoData, label: "Tidak Ada Data" },
    { status: Status.Overtime, label: "overtime" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
      {items.map((it) => (
        <div key={it.status} className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-sm", statusColor[it.status])} />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function MonthPicker({
  year,
  month,
  onChange,
}: {
  year: number;
  month: number;
  onChange: (y: number, m: number) => void;
}) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const years = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - 3 + i,
  );

  return (
    <div className="flex items-center gap-2">
      <Select
        value={month.toString()}
        onValueChange={(val) => onChange(year, Number(val))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Pilih bulan" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m, i) => (
            <SelectItem key={m} value={i.toString()}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year.toString()}
        onValueChange={(val) => onChange(Number(val), month)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Pilih tahun" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
