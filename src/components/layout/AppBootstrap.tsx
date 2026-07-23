"use client";

import { useEffect } from "react";
import { readSession } from "@/features/auth/sessionStorage";
import { restoreSession } from "@/features/auth/authSlice";
import { readProductPreferences } from "@/features/products/productPreferencesStorage";
import { restoreProductPreferences } from "@/features/products/productsSlice";
import { useAppDispatch } from "@/hooks/redux";

export function AppBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession(readSession()));
    dispatch(restoreProductPreferences(readProductPreferences()));
  }, [dispatch]);

  return null;
}
