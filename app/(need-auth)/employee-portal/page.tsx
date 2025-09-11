"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CheckCircle2, Lock, LogIn, LogOut, Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfileEmployee } from "@/services/api/employee-portal";
import { createDailyJob } from "@/services/api/daily-job";
import { toast } from "sonner";
import {
  AttendanceUpdateDto,
  updateDailyJob,
} from "@/services/api/attendace-summary";

function fmtDateHeader(d: Date) {
  const id = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
  return id;
}
function fmtMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}j ${String(m).padStart(2, "0")}m`;
}
function uid() {
  return crypto.randomUUID();
}

type ActivityCategory =
  | "CNC_SETUP"
  | "QC"
  | "PURCHASING"
  | "MAINTENANCE"
  | "OTHER";
type ActivityItem = {
  id: string;
  date: string;
  category: ActivityCategory;
  description: string;
  qty?: number | null;
  attachments?: number | null;
  createdAt: string;
};
type OvertimeItem = {
  id: string;
  date: string;
  durationMinutes: number;
  description?: string | null;
  createdAt: string;
};
type AttendanceStatus = {
  checkInAt: string | null; // ISO
  checkOutAt: string | null; // ISO
  workDurationMinutes: number;
  overtimeMinutes: number;
};

const CATEGORY_OPTIONS: { value: ActivityCategory; label: string }[] = [
  { value: "CNC_SETUP", label: "CNC / Setup" },
  { value: "QC", label: "QC" },
  { value: "PURCHASING", label: "Purchasing" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OTHER", label: "Lainnya" },
];

export default function PortalPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profile-employee"],
    queryFn: getProfileEmployee,
    retry: false,
  });
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(
    () =>
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
        .toISOString()
        .slice(0, 10),
    [today],
  );

  const [name] = useState("Rifky Rifaldy");
  const [attendance, setAttendance] = useState<AttendanceStatus>({
    checkInAt: null,
    checkOutAt: null,
    workDurationMinutes: 480, // target 8 jam (estimasi)
    overtimeMinutes: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [overtimes, setOvertimes] = useState<OvertimeItem[]>([]);
  const [cutoffPassed] = useState(false); // ganti true untuk simulasi melewati 23:59

  const isCheckedIn = !!attendance.checkInAt;
  const isCheckedOut = !!attendance.checkOutAt;
  const isLocked = !isCheckedIn || cutoffPassed;

  // ==== Dialog states: Add Pekerjaan ====
  const [openAddWork, setOpenAddWork] = useState(false);
  const [actCategory, setActCategory] = useState<ActivityCategory>("QC");
  const [actDesc, setActDesc] = useState("");
  const [actQty, setActQty] = useState<string>("");

  // ==== Dialog states: Tambah Lembur ====
  const [openOT, setOpenOT] = useState(false);
  const [otHours, setOtHours] = useState<string>("0");
  const [otMinutes, setOtMinutes] = useState<string>("30");
  const [otDesc, setOtDesc] = useState("");

  function handleCheckIn() {
    if (isCheckedIn) return;
    setAttendance((a) => ({ ...a, checkInAt: new Date().toISOString() }));
  }
  function handleCheckOut() {
    if (!isCheckedIn || isCheckedOut) return;
    setAttendance((a) => ({ ...a, checkOutAt: new Date().toISOString() }));
  }

  const { mutate, isSuccess } = useMutation({
    mutationFn: createDailyJob,
    onSuccess: () => {
      toast.success("Pekerjaan harian berhasil disimpan!");
      refetch();
    },
    onError: () => {
      toast.error("Gagal menyimpan pekerjaan harian. Silakan coba lagi.");
    },
  });

  const handleCreateJob = () => {
    mutate({
      job_description: actDesc,
      job_date: new Date().toISOString(),

      employee_id: data?.employee?.id || 0,
    });
    setOpenAddWork(false);
  };
  type UpdateDailyJobArg = {
    id: number;
    payload: AttendanceUpdateDto;
  };

  const { mutate: createOT } = useMutation<unknown, unknown, UpdateDailyJobArg>(
    {
      mutationFn: ({ id, payload }) => updateDailyJob(id, payload),
      onSuccess: () => {
        toast.success("Update berhasil!");
        setOpenOT(false);
        refetch();
      },
      onError: () => {
        toast.error("Gagal update data!");
      },
    },
  );

  const handleCreateOverTime = () => {
    console.log(Number(otHours) + Number(otMinutes) / 60);
    createOT({
      id: data?.attendanceSummary?.id || 0,
      payload: {
        status: "overtime",
        overtime_hours: Number(otHours) + Number(otMinutes) / 60,
        note_overtime: otDesc,
      },
    });
  };

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-bold">
        Kegiatan Harian — {fmtDateHeader(today)}
      </h1>

      {/* Identitas & Status */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={data?.employee?.photo_url || ""} src="" />
              <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="text-lg font-semibold">{data?.user?.name}</div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  {data?.dailyAttendances?.time_in ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Masuk:
                      {new Date(
                        data?.dailyAttendances?.time_in,
                      ).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Belum check-in
                    </>
                  )}
                </span>
                <Separator
                  orientation="vertical"
                  className="hidden h-4 md:block"
                />
                <span className="inline-flex items-center gap-1">
                  {data?.dailyAttendances?.time_out ? (
                    <>
                      <LogOut className="h-4 w-4" />
                      Pulang:{" "}
                      {new Date(
                        data?.dailyAttendances?.time_out,
                      ).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Pulang: —
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Stat
            label="Jam Kerja Hari Ini"
            value={data?.dailyAttendances?.total_hours || "00:00"}
          />

          <Stat label="Total Kegiatan" value={String(activities.length)} />
          <Stat
            label="Status Input"
            value={!data?.dailyAttendances?.time_in ? "Terkunci" : "Terbuka"}
          />
        </div>
      </Card>

      {!data?.dailyAttendances?.time_in && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Belum check-in</AlertTitle>
          <AlertDescription>
            Silakan <strong>check-in</strong> untuk mulai menambahkan
            pekerjaan/lembur hari ini.
          </AlertDescription>
        </Alert>
      )}
      {!data?.dailyAttendances?.time_in && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Periode input terkunci</AlertTitle>
          <AlertDescription>
            Kamu sudah check-out atau cut-off hari ini telah lewat. Tambah data
            sudah dinonaktifkan.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-4 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold">Kegiatan Hari Ini</div>
          <div className="flex gap-2">
            <Dialog open={openAddWork} onOpenChange={setOpenAddWork}>
              <DialogTrigger asChild>
                <Button
                  disabled={!data?.dailyAttendances?.time_in}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Pekerjaan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Pekerjaan</DialogTitle>
                  <DialogDescription>
                    Catat pekerjaan untuk tanggal <b>{todayStr}</b>. (Tanpa jam
                    per item)
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Deskripsi</Label>
                    <Textarea
                      value={actDesc}
                      onChange={(e) => setActDesc(e.target.value)}
                      placeholder="Tuliskan deskripsi singkat pekerjaan..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateJob}
                    disabled={actDesc.trim().length < 3}
                  >
                    Simpan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openOT} onOpenChange={setOpenOT}>
              <DialogTrigger asChild>
                <Button
                  disabled={!data?.dailyAttendances?.time_in}
                  variant="outline"
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Lembur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Lembur</DialogTitle>
                  <DialogDescription>
                    Masukkan durasi lembur untuk tanggal <b>{todayStr}</b>.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Jam</Label>
                      <Input
                        type="number"
                        min={0}
                        value={otHours}
                        onChange={(e) => setOtHours(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Menit</Label>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        value={otMinutes}
                        onChange={(e) => setOtMinutes(e.target.value)}
                        placeholder="30"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Deskripsi (opsional)</Label>
                    <Textarea
                      value={otDesc}
                      onChange={(e) => setOtDesc(e.target.value)}
                      placeholder="Contoh: rekap & pengepakan akhir"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateOverTime}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {data?.dailyJob?.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Belum ada kegiatan untuk hari ini.
          </div>
        ) : (
          <div className="grid gap-3">
            {data?.dailyJob?.map((a) => (
              <Card key={a.id} className="p-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pekerjaan harian</Badge>
                    <span className="text-xs text-muted-foreground">
                      dibuat{" "}
                      {new Date(a.job_date).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-sm">{a.job_description}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Lembur Hari Ini</div>
          <div className="text-sm text-muted-foreground">
            Total: <b>{fmtMinutes(attendance.overtimeMinutes)}</b>
          </div>
        </div>
        {data?.attendanceSummary?.overtime_hours == null ? (
          <div className="text-sm text-muted-foreground">
            Belum ada entri lembur.
          </div>
        ) : (
          <div className="grid gap-3">
            <Card className="px-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Data Lembur</Badge>
                  <span className="text-xs text-muted-foreground">
                    dibuat
                    {new Date(
                      data?.attendanceSummary?.updated_at,
                    ).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-sm">
                  {" "}
                  Total Lembur : {data?.attendanceSummary?.overtime_hours} Jam
                </div>
                <div className="text-sm">
                  {data?.attendanceSummary?.note_overtime}
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        {icon ? <span>{icon}</span> : null}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
