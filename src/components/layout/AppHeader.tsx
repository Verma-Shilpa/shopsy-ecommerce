"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, ShoppingBag } from "lucide-react";
import { clearSession } from "@/features/auth/sessionStorage";
import { logout, selectCurrentUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

export function AppHeader() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    dispatch(logout());
    router.push("/login");
  }

  return (
    <header className="app-header">
      <Link className="brand" href="/products" aria-label="Shopsy products">
        <span className="brand-mark">
          <ShoppingBag size={20} aria-hidden="true" />
        </span>
        <span>Shopsy</span>
      </Link>

      <nav className="header-actions" aria-label="Primary navigation">
        {user ? (
          <>
            <span className="user-chip" title={user.email}>
              {user.name}
            </span>
            <button
              className="icon-button"
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </>
        ) : (
          <Link className="text-button" href="/login">
            <LogIn size={18} aria-hidden="true" />
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
