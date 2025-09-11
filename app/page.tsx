"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("login berhasil", {
        description: data.message,
      });
      const role = data.role;

      if (role == "admin") {
        console.log(role);
        router.push("/dashboard");
      } else if (role === "employee" || role === "karyawan") {
        router.push("/employee-portal");
      }
    },
    onError: (error) => {
      toast.error("login Gagal", {
        description: error.message,
      });

      // notif error, alert(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    mutation.mutate(form);
  };
  return (
    <div className="w-full flex h-screen items-center">
      <Card className="w-full mx-auto h-auto max-w-sm">
        <CardHeader>
          <CardTitle>Wellcome To Kjt Web Admin</CardTitle>
          <CardDescription>Login into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  value={form.password}
                  name="password"
                  onChange={handleChange}
                  id="password"
                  placeholder="input your passsword"
                  type="password"
                  required
                />
              </div>
            </div>
            <div className="mt-10">
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span
                      className="animate-spin mr-2 inline-block"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    </span>
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
