"use client";

import React, { useState, useActionState, useTransition } from "react";
import { login, signup, signInWithGoogle } from "@/app/actions/auth";
import { ArrowLeft, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-[#09090b]">
      <FadeIn duration={0.7} className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="text-xs text-zinc-400 hover:text-white -ml-2">
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Directory</span>
            </Link>
          </Button>
        </div>

        <Card className="p-6 sm:p-8 rounded-2xl border-zinc-850 bg-[#111114] shadow-2xl">
          {/* Header */}
          <div className="flex flex-col space-y-2 text-center mb-6">
            <span className="font-heading font-bold text-xs tracking-[0.25em] text-zinc-400 uppercase">
              CREATORCAST
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-white">
              {mode === "signin" ? "Client & Staff Access" : "Create Client Account"}
            </h1>
            <p className="text-xs text-zinc-400">
              {mode === "signin"
                ? "Sign in to track commercial inquiries or access agency administration."
                : "Register to submit brand partnership inquiries and track agreements."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`py-1.5 text-xs font-medium tracking-wide rounded-md transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-1.5 text-xs font-medium tracking-wide rounded-md transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google SSO Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isGooglePending}
            className="w-full h-11 border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 text-white font-medium text-xs mb-6"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGooglePending ? "Connecting to Google..." : "Continue with Google"}</span>
          </Button>

          {/* Google Notice if Provider Disabled */}
          {googleNotice && (
            <div className="mb-6 p-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>{googleNotice.message}</p>
            </div>
          )}

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-850" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono">
              <span className="bg-[#111114] px-2 text-zinc-500">
                Or with business credentials
              </span>
            </div>
          </div>

          {/* Forms */}
          {mode === "signin" ? (
            <form action={loginAction} className="space-y-4">
              {loginState?.error && (
                <div className="p-3 rounded-lg border border-red-900/50 bg-red-950/40 text-red-300 text-xs">
                  {loginState.error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Business Email</label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  defaultValue="admin99@creatorcast.local"
                  className="h-10 bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Password</label>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="h-10 bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoginPending}
                className="w-full h-10 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs mt-2"
              >
                {isLoginPending ? "Authenticating..." : "Sign In to Portal"}
              </Button>
            </form>
          ) : (
            <form action={signupAction} className="space-y-4">
              {signupState?.error && (
                <div className="p-3 rounded-lg border border-red-900/50 bg-red-950/40 text-red-300 text-xs">
                  {signupState.error}
                </div>
              )}
              {signupState?.success && (
                <div className="p-3 rounded-lg border border-emerald-900/50 bg-emerald-950/40 text-emerald-300 text-xs">
                  Account created successfully! Please sign in.
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Full Name</label>
                <Input
                  name="name"
                  type="text"
                  required
                  placeholder="Rahul Mehta"
                  className="h-10 bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Business Email</label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="h-10 bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Password</label>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-10 bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isSignupPending}
                className="w-full h-10 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs mt-2"
              >
                {isSignupPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-zinc-850 text-center">
            <span className="text-[11px] text-zinc-500 font-mono">
              STAFF CREDENTIALS PRE-FILLED FOR DEMO
            </span>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
