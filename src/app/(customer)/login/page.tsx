"use client";

import React, { useState, useActionState, useTransition } from "react";
import { login, signup, signInWithGoogle } from "@/app/actions/auth";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
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
        // Next.js redirect throws NEXT_REDIRECT which is expected when redirecting
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
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      {/* Ambient background glow */}
      <div className="ambient-glow-top" />

      <FadeIn duration={0.7} className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 group px-3.5 py-1.5 rounded-full glass-pill"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Return to Directory</span>
          </Link>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
          {/* Header Title */}
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-3xl font-heading font-black tracking-tight text-white uppercase">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-xs tracking-wider text-zinc-400">
              {mode === "signin"
                ? "Access talent management and exclusive creator services."
                : "Join the CreatorCast network for inquiries and collaborations."}
            </p>
          </div>

          {/* Mode Tabs (Curved Pill Switcher) */}
          <div className="grid grid-cols-2 p-1.5 bg-black/60 border border-white/10 rounded-full mb-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`py-2 text-xs uppercase tracking-wider font-heading font-bold rounded-full transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-white text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-2 text-xs uppercase tracking-wider font-heading font-bold rounded-full transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="grid gap-6">
            {/* Google OAuth Button (Curved) */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGooglePending}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-white text-xs uppercase tracking-wider font-semibold rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-md hover:shadow-white/5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{isGooglePending ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>

            {/* Google Provider Notice (when provider is disabled in Supabase) */}
            {googleNotice && (
              <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-amber-200 text-xs space-y-2.5 backdrop-blur-md">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-heading font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                      Google Provider Configuration
                    </p>
                    <p className="text-zinc-300 leading-relaxed text-[11px]">
                      {googleNotice.isProviderDisabled ? (
                        <>
                          Google Sign-In is not enabled yet in your Supabase dashboard. To activate Google OAuth in production, toggle Google to <strong>Enabled</strong> under <em>Supabase Dashboard &gt; Authentication &gt; Providers &gt; Google</em>.
                        </>
                      ) : (
                        googleNotice.message
                      )}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-mono">
                    👉 Sign in or register with email below
                  </span>
                  <button
                    type="button"
                    onClick={() => setGoogleNotice(null)}
                    className="text-[10px] uppercase font-mono tracking-wider text-amber-400 hover:text-amber-200 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-black/90 px-3 text-zinc-500 font-mono">
                  Or with email
                </span>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {mode === "signin" && loginState?.error && (
              (loginState.isRateLimit || loginState.error.toLowerCase().includes("rate limit")) ? (
                <div className="p-4 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl text-rose-100 text-xs space-y-2.5 backdrop-blur-xl shadow-xl shadow-rose-950/50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <p className="font-heading font-black text-rose-200 uppercase tracking-wider text-xs">
                        Network Rate Limit Reached
                      </p>
                      <p className="text-zinc-200 leading-relaxed text-[11px]">
                        Supabase Free Tier limits authentication requests per IP address. If multiple accounts were tested on this network, requests are temporarily throttled.
                      </p>
                      <div className="p-2.5 bg-black/80 border border-rose-500/40 rounded-xl text-rose-200 font-mono text-[11px] space-y-1">
                        <div className="font-bold text-rose-300">💡 Recommended Solutions:</div>
                        <div>1. Switch to a <strong>different network</strong> (e.g. Mobile Hotspot / Cellular).</div>
                        <div>2. Connect through a VPN or wait 5–10 minutes.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-xl space-y-1">
                  <div>{loginState.error}</div>
                  {loginState.error.toLowerCase().includes("invalid") && (
                    <div className="text-[10px] text-zinc-400 font-mono">
                      Tip: If multiple logins were tested from this same Wi-Fi IP, try switching to a mobile hotspot.
                    </div>
                  )}
                </div>
              )
            )}

            {mode === "signup" && signupState?.error && (
              (signupState.isRateLimit || signupState.error.toLowerCase().includes("rate limit")) ? (
                <div className="p-4 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl text-rose-100 text-xs space-y-2.5 backdrop-blur-xl shadow-xl shadow-rose-950/50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <p className="font-heading font-black text-rose-200 uppercase tracking-wider text-xs">
                        Network Rate Limit Reached
                      </p>
                      <p className="text-zinc-200 leading-relaxed text-[11px]">
                        Supabase Free Tier limits new account creations from the same IP network address.
                      </p>
                      <div className="p-2.5 bg-black/80 border border-rose-500/40 rounded-xl text-rose-200 font-mono text-[11px] space-y-1">
                        <div className="font-bold text-rose-300">💡 Recommended Solution:</div>
                        <div>Please switch to a <strong>different network</strong> (such as your phone&apos;s Mobile Hotspot) to create your account immediately.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-xl">
                  {signupState.error}
                </div>
              )
            )}

            {mode === "signup" && signupState?.success && (
              <div className="p-3.5 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{signupState.success}</span>
              </div>
            )}

            {/* Sign In Form */}
            {mode === "signin" ? (
              <form action={loginAction}>
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      required
                      className="flex h-11 w-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="flex h-11 w-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoginPending}
                    className="mt-2 h-11 bg-white hover:bg-zinc-200 text-black text-xs uppercase tracking-[0.2em] font-heading font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-white/10"
                  >
                    {isLoginPending ? "Authenticating..." : "Sign In"}
                  </button>
                </div>
              </form>
            ) : (
              /* Sign Up Form */
              <form action={signupAction}>
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium" htmlFor="signup-email">
                      Work / Personal Email
                    </label>
                    <input
                      id="signup-email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      required
                      className="flex h-11 w-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium" htmlFor="signup-password">
                      Create Password
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      required
                      className="flex h-11 w-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSignupPending}
                    className="mt-2 h-11 bg-white hover:bg-zinc-200 text-black text-xs uppercase tracking-[0.2em] font-heading font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-white/10"
                  >
                    {isSignupPending ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
