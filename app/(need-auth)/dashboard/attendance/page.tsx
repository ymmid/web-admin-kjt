"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
type Status =
  | "present"
  | "late"
  | "sick"
  | "leave"
  | "alpha"
  | "off"
  | "nodata";

interface DayRecord {
  date: string; // YYYY-MM-DD
  status: Status;
  in?: string; // HH:mm
  out?: string; // HH:mm
  note?: string;
}

interface Employee {
  id: string;
  name: string;
  dailyRate: number;
  records: DayRecord[];
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function makeDateStr(year: number, monthIndex0: number, day: number) {
  return `${year}-${pad2(monthIndex0 + 1)}-${pad2(day)}`;
}

function sampleStatus(day: number): Status {
  if ([6, 7, 13, 14, 20, 21, 27, 28].includes(day)) return "off"; // weekend
  if ([10].includes(day)) return "leave";
  if ([3, 18, 31].includes(day)) return "late";
  if ([5].includes(day)) return "sick";
  if ([23].includes(day)) return "alpha";
  return "present";
}

function buildEmployee(
  id: string,
  name: string,
  dailyRate: number,
  year: number,
  monthIndex0: number,
): Employee {
  const dim = daysInMonth(year, monthIndex0);
  const records: DayRecord[] = Array.from({ length: dim }, (_, i) => {
    const d = i + 1;
    const st = sampleStatus((d + (id.charCodeAt(0) % 3)) % 31 || d); // vary per employee
    return {
      date: makeDateStr(year, monthIndex0, d),
      status: st,
      in:
        st === "present" || st === "late"
          ? st === "late"
            ? "09:15"
            : "08:00"
          : undefined,
      out: st === "present" || st === "late" ? "17:00" : undefined,
      note:
        st === "leave"
          ? "Izin seharian"
          : st === "sick"
            ? "Sakit (surat dokter)"
            : st === "alpha"
              ? "Tanpa keterangan"
              : undefined,
    } as DayRecord;
  });
  return { id, name, dailyRate, records };
}

const PENALTY = {
  late: 0.1, // 10% potong harian jika terlambat (contoh)
  alpha: 1.0, // potong penuh satu hari
  leave: 0.0, // tidak dibayar/tergantung kebijakan; contoh: 0 (unpaid)
  sick: 0.0, // dibayar penuh (contoh)
  off: 0.0, // libur: tidak dihitung
  nodata: 0.0,
  present: 0.0,
};

function summarizeEmployee(emp: Employee) {
  let present = 0,
    late = 0,
    sick = 0,
    leave = 0,
    alpha = 0,
    off = 0,
    nodata = 0,
    paidDays = 0,
    total = 0;

  for (const r of emp.records) {
    switch (r.status) {
      case "present":
        present++;
        paidDays += 1;
        total += emp.dailyRate;
        break;
      case "late":
        late++;
        paidDays += 1;
        total += emp.dailyRate * (1 - PENALTY.late);
        break;
      case "sick":
        sick++;
        paidDays += 1; // paid
        total += emp.dailyRate * (1 - PENALTY.sick);
        break;
      case "leave":
        leave++;
        // unpaid in this policy
        total += emp.dailyRate * (1 - PENALTY.leave);
        break;
      case "alpha":
        alpha++;
        total += emp.dailyRate * (1 - PENALTY.alpha);
        break;
      case "off":
        off++;
        break;
      case "nodata":
        nodata++;
        break;
    }
  }

  return {
    present,
    late,
    sick,
    leave,
    alpha,
    off,

    nodata,
    paidDays,
    total,
  };
}

const STATUS_LABEL: Record<Status, string> = {
  present: "Hadir",
  late: "Terlambat",
  sick: "Sakit",
  leave: "Izin/Cuti",
  alpha: "Alpha",
  off: "Libur/Off",
  nodata: "Tidak Ada Data",
};

const STATUS_CLASS: Record<Status, string> = {
  present: "bg-green-600",
  late: "bg-yellow-500",
  sick: "bg-blue-500",
  leave: "bg-indigo-500",
  alpha: "bg-red-600",
  off: "bg-gray-300",
  nodata: "bg-gray-100 border border-dashed border-gray-300",
};

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AttendancePage() {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());

  const dim = useMemo(() => daysInMonth(year, month), [year, month]);
  const days = useMemo(
    () => Array.from({ length: dim }, (_, i) => i + 1),
    [dim],
  );

  const employees = useMemo(() => {
    return [
      buildEmployee("A", "Rifky R.", 180_000, year, month),
      buildEmployee("B", "Andi Saputra", 200_000, year, month),
      buildEmployee("C", "Sinta Putri", 175_000, year, month),
      buildEmployee("D", "Budi K.", 185_000, year, month),
    ];
  }, [year, month]);

  const summaries = employees.map((e) => summarizeEmployee(e));
  const totalPayroll = summaries.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Data Absensi Kehadiran Karyawan</h1>
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
              {employees.map((emp, idx) => (
                <tr key={emp.id}>
                  <td className="align-top pb-2">
                    <div className="font-medium">{emp.name}</div>
                    <div className="text-xs text-gray-500">
                      Rate Harian: {rupiah(emp.dailyRate)}
                    </div>
                  </td>
                  {days.map((d) => {
                    const rec = emp.records[d - 1];
                    const st = rec?.status ?? "nodata";
                    return (
                      <td key={d} className="px-1">
                        <div
                          title={`Tanggal ${pad2(d)} — ${STATUS_LABEL[st]}${rec?.in ? ` | In ${rec.in}` : ""}${rec?.out ? ` | Out ${rec.out}` : ""}${rec?.note ? ` | ${rec.note}` : ""}`}
                          className={cn(
                            "h-5 w-5 rounded-sm transition-transform hover:scale-105",
                            STATUS_CLASS[st],
                          )}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <h1 className="text-2xl font-bold">Data Gaji</h1>
      <Card className="p-4">
        <table>
          <tbody>
            {employees.map((emp, i) => {
              const s = summaries[i];
              return (
                <tr key={`sum-${emp.id}`}>
                  <td className="pt-2">
                    <div className="text-sm font-semibold">
                      Total Gaji {emp.name}
                    </div>
                  </td>
                  <td colSpan={days.length} className="pt-2">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <span className="font-semibold">
                        {rupiah(Math.round(s.total))}
                      </span>
                      <span>Hadir: {s.present}</span>
                      <span>Terlambat: {s.late}</span>
                      <span>Sakit: {s.sick}</span>
                      <span>Izin: {s.leave}</span>
                      <span>Alpha: {s.alpha}</span>
                      <span>Off: {s.off}</span>
                      <span>Data kosong: {s.nodata}</span>
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
            <span className="font-semibold ">
              {rupiah(Math.round(totalPayroll))}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            *Simulasi kebijakan: Telat dipotong 10%, Sakit dibayar penuh,
            Izin/Alpha sesuai konfigurasi.
          </div>
        </div>
      </Card>
    </div>
  );
}

function Legend() {
  const items: { status: Status; label: string }[] = [
    { status: "present", label: "Hadir" },
    { status: "late", label: "Terlambat" },
    { status: "sick", label: "Sakit" },
    { status: "leave", label: "Izin/Cuti" },
    { status: "alpha", label: "Alpha" },
    { status: "off", label: "Libur/Off" },
    { status: "nodata", label: "Tidak Ada Data" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
      {items.map((it) => (
        <div key={it.status} className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-sm", STATUS_CLASS[it.status])} />
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
