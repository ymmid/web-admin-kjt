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
      refetch();
    },
    onError: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    if (isError && (error as AxiosError)?.response?.status === 401) {
      refreshMutation.mutate();
    }
    if (!isLoading && user && user.role !== "admin") {
      router.push("/employee-portal");
    }
    console.log("user", user?.role);
  }, [isError, user]);

  if (isLoading || refreshMutation.isPending)
    return <Loading label="Tunggu ya..." />;

  if (!isLoading && user && user.role !== "admin") return null;
  return <>{children}</>;
}
