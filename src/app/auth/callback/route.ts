import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user?.email) {
      const metadata = data.user.user_metadata || {};
      const googleName =
        metadata.full_name ||
        metadata.name ||
        metadata.user_name ||
        data.user.email.split("@")[0];
      const avatarUrl = metadata.avatar_url || metadata.picture || null;

      // Upsert user in Prisma with Google name, avatar, and lastLogin
      try {
        let dbUser = await prisma.user.findUnique({
          where: { email: data.user.email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              id: data.user.id,
              email: data.user.email,
              name: googleName,
              avatarUrl: avatarUrl,
              role: Role.CUSTOMER,
              lastLogin: new Date(),
            },
          });
        } else {
          dbUser = await prisma.user.update({
            where: { email: data.user.email },
            data: {
              name: dbUser.name || googleName,
              avatarUrl: dbUser.avatarUrl || avatarUrl,
              lastLogin: new Date(),
            },
          });
        }

        if (dbUser.role === Role.ADMIN) {
          return NextResponse.redirect(`${origin}/admin`);
        } else {
          return NextResponse.redirect(`${origin}/`);
        }
      } catch (dbErr) {
        console.error("Prisma user upsert failed in callback:", dbErr);
        return NextResponse.redirect(`${origin}/`);
      }
    }
  }

  // If code exchange failed or wasn't provided, return to login with error
  return NextResponse.redirect(`${origin}/login?error=oauth_error`);
}
