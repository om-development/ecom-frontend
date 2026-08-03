"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/Redux/hooks";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const isAdmin = user?.role === "admin";
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin-login");
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) return null;
  return <>{children}</>;
}