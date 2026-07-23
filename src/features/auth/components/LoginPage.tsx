"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShoppingBag } from "lucide-react";
import { login, selectAuth } from "@/features/auth/authSlice";
import { createSession, saveSession } from "@/features/auth/sessionStorage";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, restored } = useAppSelector(selectAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (restored && user) {
      router.replace("/products");
    }
  }, [restored, router, user]);

  function onSubmit(values: LoginFormValues) {
    const session = createSession(values.email);
    saveSession(session);
    dispatch(login(session));
    router.push("/products");
  }

  return (
    <section className="login-screen">
      <div className="login-copy">
        <h1>Shop faster with a focused product catalog.</h1>
        <p>
          Sign in with any valid email and a strong password to explore
          products, compare prices, and keep browsing your preferences
        </p>
      </div>

      <form className="login-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="login-card_header">
          <span className="brand-mark brand-mark--large">
            <ShoppingBag size={26} aria-hidden="true" />
          </span>
          <div>
            <h2>Welcome to Shopsy</h2>
          </div>
        </div>

        <label className="field" htmlFor="email">
          <span>Email</span>
          <span
            className={`input-shell ${errors.email ? "input-shell--error" : ""}`}
          >
            <Mail size={18} aria-hidden="true" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
          </span>
          {errors.email ? (
            <small className="field-error">{errors.email.message}</small>
          ) : null}
        </label>

        <label className="field" htmlFor="password">
          <span>Password</span>
          <span
            className={`input-shell ${errors.password ? "input-shell--error" : ""}`}
          >
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="At least 6 characters"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
                validate: (value) =>
                  /[A-Za-z]/.test(value) || "Include at least one letter.",
              })}
            />
          </span>
          {errors.password ? (
            <small className="field-error">{errors.password.message}</small>
          ) : null}
        </label>

        <label className="check-row">
          <input type="checkbox" {...register("remember")} />
          <span>Remember me</span>
        </label>

        <button
          className="primary-button primary-button--wide"
          type="submit"
          disabled={isSubmitting}
        >
          <LockKeyhole size={18} aria-hidden="true" />
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
