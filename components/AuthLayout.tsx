"use client";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfile, getRefreshProfile } from "@/services/api/auth";
import { useEffect } from "react";
import type { AxiosError } from "axios";
import Loading from "@/components/Loading";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  const refreshMutation = useMutation({
    mutationFn: getRefreshProfile,
    onSuccess: () => {
      // Kalau refresh sukses, retry profile
      refetch();
    },
    onError: () => {
      // Kalau gagal refresh, redirect ke login
      router.push("/");
    },
  });

  // 3. Kalau error 401 (unauthorized), coba refresh
  useEffect(() => {
    if (isError && (error as AxiosError)?.response?.status === 401) {
      refreshMutation.mutate();
    }
  }, [isError]);

  // 4. Loading spinner
  if (isLoading || refreshMutation.isPending)
    return <Loading label="Tunggu ya..." />;

  // 5. Kalau sudah ada data user, render children/layout
  if (user) return <>{children}</>;

  // 6. Default: return null (atau bisa tambahkan loader/error UI)
  return null;
}
