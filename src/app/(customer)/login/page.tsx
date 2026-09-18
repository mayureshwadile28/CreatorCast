"use client";

import React, { useState, useActionState, useTransition } from "react";
import { login, signup, signInWithGoogle } from "@/app/actions/auth";
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Shield } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion-client";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null);
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [googleNotice, setGoogleNotice] = useState<{
    message: string;
    isProviderDisabled?: boolean;
  } | null>(null);

  const handleGoogleSignIn = () => {
    setGoogleNotice(null);
    startGoogleTransition(async () => {
      try {
        const res = await signInWithGoogle();
        if (res?.error) {
          setGoogleNotice({
            message: res.error,
            isProviderDisabled: res.isProviderDisabled,
          });
        }
      } catch (err: any) {
        if (err?.message?.includes("NEXT_REDIRECT")) {
          throw err;
        }
        setGoogleNotice({
          message: err?.message || "Failed to initiate Google authentication.",
        });
      }
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-[#07080b]">
      {/* Ambient background glows */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-side" />

      <FadeIn duration={0.7} className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 group px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-indigo-400" />
            <span>Back to Creators</span>
          </Link>
        </div>

        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="flex flex-col space-y-2 text-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 mx-auto flex items-center justify-center text-white font-black text-lg mb-1 shadow-lg shadow-indigo-500/30">
              C
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white uppercase">
              {mode === "signin" ? "Client Portal" : "Create Account"}
            </h1>
            <p className="text-xs text-zinc-400">
              {mode === "signin"
                ? "Sign in to track your creator bookings or access staff controls."
                : "Create an account to submit inquiries and reserve creator talent."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#090c14] border border-white/10 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="grid gap-5">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGooglePending}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-500/40 text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>
                {isGooglePending ? "Connecting to Google..." : "Continue with Google"}
              </span>
            </button>

            {/* Google Notice */}
            {googleNotice && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs space-y-2 backdrop-blur-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    {googleNotice.message}
                  </p>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-[#0b0e16] px-3 text-zinc-500 font-mono">
                  Or with email
                </span>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {mode === "signin" && loginState?.error && (
              <div className="p-3.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-xl space-y-1">
                <div>{loginState.error}</div>
                {loginState.error.toLowerCase().includes("invalid") && (
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Note: Staff credentials: admin99@creatorcast.local
                  </div>
                )}
              </div>
            )}

            {mode === "signup" && signupState?.error && (
              <div className="p-3.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-xl">
                {signupState.error}
              </div>
            )}

            {mode === "signup" && signupState?.success && (
              <div className="p-3.5 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Account created! You can now sign in below.</span>
              </div>
            )}

            {/* Form */}
            <form action={mode === "signin" ? loginAction : signupAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoginPending || isSignupPending}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
              >
                {mode === "signin"
                  ? isLoginPending
                    ? "Signing In..."
                    : "Sign In"
                  : isSignupPending
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
