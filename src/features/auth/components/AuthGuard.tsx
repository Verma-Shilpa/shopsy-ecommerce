"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StatusPanel } from "@/components/ui/StatusPanel";
import { selectAuth } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks/redux";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, restored } = useAppSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (restored && !user) {
      router.replace("/login");
    }
  }, [restored, router, user]);

  if (!restored) {
    return (
      <StatusPanel
        title="Checking your session"
        message="Preparing your shopping experience."
      />
    );
  }

  if (!user) {
    return (
      <StatusPanel
        title="Redirecting to login"
        message="Please sign in to browse the product catalog."
        onAction={() => router.push("/login")}
        actionLabel="Login"
      />
    );
  }

  return <>{children}</>;
}
