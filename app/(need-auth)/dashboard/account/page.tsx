"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile } from "@/services/api/auth";
import { useQuery } from "@tanstack/react-query";

type Role = "SUPERADMIN" | "ADMIN" | "STAFF" | "EMPLOYEE";

type Me = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  employee?: { id: string; name: string } | null;
};

type EmployeeOption = { id: string; name: string };

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form: profile
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // form: password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  // employment link
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [linkSaving, setLinkSaving] = useState(false);

  // === bootstrap data (ganti endpoint sesuai API-mu) ===
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // GET current user
        const r = await fetch("/api/me", { cache: "no-store" });
        const data = (await r.json()) as Me;
        if (!alive) return;
        setMe(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setIsEmployee(!!data.employee);
        setEmployeeId(data.employee?.id);
      } catch {
        // noop: tampilkan kosong saja
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-users"],
    queryFn: getProfile,
  });

  // fetch pilihan karyawan hanya saat diperlukan
  useEffect(() => {
    if (!isEmployee) return;
    if (employees.length > 0) return;
    (async () => {
      try {
        // tampilkan hanya karyawan yang belum tertaut (recommended)
        const r = await fetch("/api/employees?available=1", {
          cache: "no-store",
        });
        const data = (await r.json()) as EmployeeOption[];
        setEmployees(data);
      } catch {
        // noop
      }
    })();
  }, [isEmployee, employees.length]);

  const employeeLabel = useMemo(() => {
    if (!isEmployee) return "Not linked";
    const current =
      employees.find((e) => e.id === employeeId) ?? me?.employee ?? null;
    return current ? `${current.name}` : "Select employee…";
  }, [isEmployee, employeeId, employees, me]);

  async function onSaveProfile() {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
    } finally {
      setSaving(false);
    }
  }

  async function onChangePassword() {
    if (!newPwd || newPwd.length < 8)
      return alert("Password minimal 8 karakter.");
    if (newPwd !== confirmPwd) return alert("Konfirmasi password tidak cocok.");
    setPwdSaving(true);
    try {
      await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      alert("Password updated.");
    } finally {
      setPwdSaving(false);
    }
  }

  async function onSaveEmployment() {
    setLinkSaving(true);
    try {
      if (!isEmployee) {
        // unlink
        await fetch("/api/profile/link-employee", {
          method: "DELETE",
        });
        setEmployeeId(undefined);
      } else {
        if (!employeeId && !me?.employee?.id) {
          alert("Pilih karyawan terlebih dahulu.");
          return;
        }
        await fetch("/api/profile/link-employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeId: employeeId ?? me?.employee?.id }),
        });
      }
      alert("Employment link saved.");
    } finally {
      setLinkSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-5 space-y-5">
        <div className="h-7 w-56 rounded bg-muted" />
        <div className="h-40 w-full rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile" className="mt-4">
          <Card className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={data.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={me?.email ?? ""}
                  placeholder={data.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder={data.role}
                  value={me?.role ?? ""}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={onSaveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* PASSWORD */}
        <TabsContent value="password" className="mt-4">
          <Card className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="min 8 chars"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="repeat new password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={onChangePassword} disabled={pwdSaving}>
                {pwdSaving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="mt-4">
          <Card className="p-4 space-y-4">
            {isEmployee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pilih Karyawan</Label>
                  <Select
                    value={employeeId ?? me?.employee?.id ?? ""}
                    onValueChange={(val) => setEmployeeId(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={employeeLabel} />
                    </SelectTrigger>
                    <SelectContent>
                      {(me?.employee ? [me.employee, ...employees] : employees)
                        .filter(
                          // hindari duplikat di list
                          (e, idx, arr) =>
                            arr.findIndex((x) => x.id === e.id) === idx,
                        )
                        .map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={employeeLabel} disabled />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={onSaveEmployment} disabled={linkSaving}>
                {linkSaving ? "Saving..." : "Save Employment"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
