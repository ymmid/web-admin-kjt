"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AttendanceUpdateDto,
  DailyStatusDto,
  getAllAttendances,
  Status,
  updateDailyJob,
} from "@/services/api/attendace-summary";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatRupiah } from "@/lib/formatRupiah";
import { toast } from "sonner";

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
  const [status, setStatus] = useState<string>("nodata");
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [dailyAttendance, setDailyAttendance] = useState<DailyStatusDto | null>(
    null,
  );

  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["attendances-summary"],
    queryFn: () => getAllAttendances({ month, year }),
  });
  const workMonth: number = data?.month || 0;
  const workYear: number = data?.year || 0;
  function countNonSundayDays(workYear: number, workMonth: number) {
    let count = 0;

    const date = new Date(workYear, workMonth - 1, 1);

    while (date.getMonth() === workMonth - 1) {
      // 0 = Minggu, 1 = Senin, dst.
      if (date.getDay() !== 0) {
        count++;
      }
      date.setDate(date.getDate() + 1);
    }

    return count;
  }
  const workDay = countNonSundayDays(workYear, workMonth);
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AttendanceUpdateDto;
    }) => updateDailyJob(id, payload),
    onSuccess: () => {
      refetch();
      toast.success("Data berhasil diperbarui");
    },
    onError: (error) => {
      toast.error("Data Gagal  diperbarui");
    },
  });

  return (
    <div className="p-5 space-y-5">
      <Sheet>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">
            Data Absensi Kehadiran Karyawan {data?.month}-{data?.year}
          </h1>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
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
                refetch();
              }}
              className="w-full md:w-auto"
            >
              Apply Filter
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMonth(undefined);
                setYear(undefined);
                setTimeout(() => {
                  refetch();
                }, 100);
              }}
              className="w-full md:w-auto"
            >
              Ke Bulan Ini
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <Legend />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-6">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-600 w-48 align-bottom">
                    Karyawan
                  </th>
                  {data?.employees[0]?.daily_status.map((entry) => (
                    <th
                      key={entry.date}
                      className="text-xs font-medium text-gray-500 text-center px-1 align-bottom"
                    >
                      {pad2(Number(entry.date.split("-")[2]))}
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
                        Rate Perbulan : {formatRupiah(+employee.salary)} <br />
                        Rate Harian: {formatRupiah(+employee.salary / workDay)}
                      </div>
                    </td>
                    {employee?.daily_status.map((day) => {
                      const st = day.status ?? "nodata";

                      return (
                        <SheetTrigger asChild key={day.date}>
                          <td className="px-1">
                            <div
                              title={`Tanggal ${pad2(Number(day.date.split("-")[2]))} | ${day.status}`}
                              className={cn(
                                "h-5 w-5 rounded-sm transition-transform hover:scale-105",
                                statusColor[st],
                              )}
                              onClick={() => {
                                setDailyAttendance(day);
                                setStatus(day.status ?? "nodata");
                                setOvertimeHours(day.overtime_hours ?? 0);
                              }}
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
                const totalOverTime = employee.daily_status.reduce(
                  (total, item) => total + (Number(item.overtime_hours) || 0),
                  0,
                );

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
                          {formatRupiah(
                            (+employee?.salary / workDay / 8) * totalOverTime +
                              (+employee?.salary / workDay) * totalPresent,
                          )}
                        </span>
                        <span>Hadir: {totalPresent}</span>
                        <span>Terlambat: {totalLate}</span>
                        <span>Sakit: {totalSick}</span>

                        <span>Izin: {totalLeave}</span>
                        <span>Alpha: {totalAlpha}</span>
                        <span>Off: {totalOff}</span>
                        <span>Data kosong: {totalNoData}</span>
                        <span>
                          lembur : {totalOverTime} jam , Total :
                          {formatRupiah(
                            (+employee?.salary / workDay / 8) * totalOverTime,
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              Total Gaji Semua Karyawan:
              <span className="font-semibold ">Rp -</span>
            </div>
            <div className="text-xs text-gray-500">
              *Simulasi kebijakan: Telat dipotong 10%, Sakit dibayar penuh,
              Izin/Alpha sesuai konfigurasi.
            </div>
          </div>
        </Card>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Attendance</SheetTitle>
            <SheetDescription>
              {`Ubah status kehadiran pada tanggal ${dailyAttendance?.date}`}
            </SheetDescription>
          </SheetHeader>

          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label>Status Kehadiran</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Hadir</SelectItem>
                  <SelectItem value="late">Terlambat</SelectItem>
                  <SelectItem value="sick">Sakit</SelectItem>
                  <SelectItem value="leave">Izin/Cuti</SelectItem>
                  <SelectItem value="alpha">Alpha</SelectItem>
                  <SelectItem value="overtime">Lembur</SelectItem>
                  <SelectItem value="off">Libur</SelectItem>
                  <SelectItem value="nodata">Tidak Ada Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === "overtime" && (
              <div className="grid gap-3">
                <Label>Jumlah Jam Lembur</Label>
                <Input
                  type="number"
                  min={0}
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="button"
                onClick={() => {
                  mutate({
                    id: dailyAttendance?.id || 0,
                    payload: {
                      status,
                      overtime_hours:
                        status === "overtime" ? overtimeHours : undefined,
                    },
                  });
                }}
              >
                Simpan
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline">Tutup</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
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
