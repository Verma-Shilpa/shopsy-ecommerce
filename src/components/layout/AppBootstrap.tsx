"use client";

import { useEffect } from "react";
import { readSession } from "@/features/auth/sessionStorage";
import { hydrateSession } from "@/features/auth/authSlice";
import { readProductPreferences } from "@/features/products/productPreferencesStorage";
import { hydrateProductPreferences } from "@/features/products/productsSlice";
import { useAppDispatch } from "@/hooks/redux";

export function AppBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateSession(readSession()));
    dispatch(hydrateProductPreferences(readProductPreferences()));
  }, [dispatch]);

  return null;
}
