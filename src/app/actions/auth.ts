"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function signup(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    const msg = error.message?.toLowerCase() || "";
    const isRateLimit =
      msg.includes("rate limit") ||
      msg.includes("too many requests") ||
      msg.includes("over_request_rate_limit") ||
      (error as any).status === 429;

    return {
      error: isRateLimit
        ? "Network Rate Limit Reached: Supabase free tier limits account creations from the same IP address. Please try connecting to a different network (e.g. mobile hotspot) or wait a few minutes."
        : error.message,
      isRateLimit,
    };
  }

  // Ensure new user exists in Prisma with CUSTOMER role and lastLogin
  await prisma.user.upsert({
    where: { email },
    update: { lastLogin: new Date() },
    create: {
      email,
      name: email.split("@")[0],
      role: Role.CUSTOMER,
      lastLogin: new Date(),
    },
  });

  // If session is active (no email confirmation needed), sign in and redirect
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  return { success: "Account created successfully! You can now sign in below." };
}

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: (formData.get("email") as string)?.trim(),
    password: formData.get("password") as string,
  };

  if (!data.email || !data.password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const msg = error.message?.toLowerCase() || "";
    const isRateLimit =
      msg.includes("rate limit") ||
      msg.includes("too many requests") ||
      msg.includes("over_request_rate_limit") ||
      (error as any).status === 429;

    return {
      error: isRateLimit
        ? "Network Rate Limit Reached: Supabase free tier limits sign-in attempts per IP address. Please connect to a different network (e.g. mobile hotspot) or wait a few minutes."
        : error.message,
      isRateLimit,
    };
  }

  // Update lastLogin in database
  try {
    await prisma.user.update({
      where: { email: data.email },
      data: { lastLogin: new Date() },
    });
  } catch {
    // User might not exist yet in Prisma if created outside
  }

  // Check role in database
  const userRecord = await prisma.user.findUnique({
    where: { email: data.email },
  });

  revalidatePath("/", "layout");

  // Route staff to /admin, customers to /
  if (userRecord?.role === Role.ADMIN) {
    redirect("/admin");
  } else {
    redirect("/");
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    // Production preflight check: catch disabled or unconfigured OAuth provider before sending user to raw JSON error
    try {
      const check = await fetch(data.url, { redirect: "manual" });
      if (check.status >= 400) {
        let errorMessage = "Google OAuth provider is not enabled in your Supabase project.";
        try {
          const body = await check.json();
          if (body?.msg) {
            errorMessage = body.msg;
          }
        } catch {
          // ignore json parse error
        }
        return {
          error: errorMessage,
          isProviderDisabled: true,
        };
      }
    } catch {
      // If preflight network fetch fails or isn't possible, proceed
    }

    redirect(data.url);
  }

  return { error: "Failed to initiate Google authentication." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

