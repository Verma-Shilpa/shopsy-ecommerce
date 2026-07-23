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
  const { user, hydrated } = useAppSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, router, user]);

  if (!hydrated) {
    return <StatusPanel title="Checking your session" message="Preparing your shopping workspace." />;
  }

  if (!user) {
    return <StatusPanel title="Redirecting to login" message="Please sign in to browse the product catalog." />;
  }

  return <>{children}</>;
}
