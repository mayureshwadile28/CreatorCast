import React from "react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Users, Shield, UserCheck, Clock, Calendar, Mail, CheckCircle2 } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  lastLogin: Date | null;
  createdAt: Date;
  bookingCount: number;
}

export default async function AdminUsersPage() {
  const usersRaw: any[] = await prisma.$queryRawUnsafe(`
    SELECT 
      u.id, 
      u.email, 
      u.name, 
      u."avatarUrl", 
      u.role, 
      u."lastLogin", 
      u."createdAt",
      count(b.id)::int as "bookingCount"
    FROM "User" u
    LEFT JOIN "Booking" b ON (b."userId" = u.id OR lower(b."clientEmail") = lower(u.email) OR lower(b."accountEmail") = lower(u.email))
    GROUP BY u.id, u.email, u.name, u."avatarUrl", u.role, u."lastLogin", u."createdAt"
    ORDER BY u."lastLogin" DESC NULLS LAST, u."createdAt" DESC
  `);

  const users: UserRow[] = usersRaw.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    avatarUrl: u.avatarUrl,
    role: u.role,
    lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
    createdAt: new Date(u.createdAt),
    bookingCount: u.bookingCount || 0,
  }));

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;
  const customerUsers = totalUsers - adminUsers;
  const googleUsers = users.filter((u) => u.avatarUrl || (u.name && u.name !== u.email.split("@")[0])).length;

  return (
    <div className="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0 md:gap-8 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white uppercase">
            User Directory &amp; Sign-In Activity
          </h1>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
            Realtime records of registered users, Google identities, and authentication activity
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono">Total Users</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-heading font-black text-white">{totalUsers}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">All database profiles</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono">Google Verified</span>
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
          </div>
          <div className="text-3xl font-heading font-black text-sky-400">{googleUsers}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">OAuth profile details gathered</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono">Customers</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-heading font-black text-emerald-400">{customerUsers}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Booking clients &amp; visitors</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono">Staff Admins</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-heading font-black text-amber-400">{adminUsers}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Elevated RBAC access</p>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="glass-card border border-white/10 overflow-hidden rounded-2xl shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-white">
            Registered Users &amp; Auth Metadata
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Synced from Supabase Auth &amp; PostgreSQL</span>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="h-12 px-4 font-medium">User Profile</th>
                <th className="h-12 px-4 font-medium">Email Address</th>
                <th className="h-12 px-4 font-medium">Role</th>
                <th className="h-12 px-4 font-medium text-center">Bookings</th>
                <th className="h-12 px-4 font-medium">Last Login</th>
                <th className="h-12 px-4 font-medium hidden sm:table-cell">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {users.map((user) => {
                const displayName = user.name || user.email.split("@")[0];
                const initials = (displayName[0] || "U").toUpperCase();
                const isGoogle = Boolean(user.avatarUrl || (user.name && user.name !== user.email.split("@")[0]));

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User Profile Cell */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0">
                            <Image
                              src={user.avatarUrl}
                              alt={displayName}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/15 flex items-center justify-center font-heading font-bold text-white text-xs shrink-0">
                            {initials}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-white text-sm">
                              {displayName}
                            </span>
                            {isGoogle && (
                              <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider text-sky-400 bg-sky-950/70 border border-sky-500/30 rounded-full">
                                Google
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-500 text-[10px] font-mono">
                            ID: {user.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email Cell */}
                    <td className="p-4 font-mono text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role Cell */}
                    <td className="p-4 whitespace-nowrap">
                      {user.role === "ADMIN" ? (
                        <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full inline-flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-400" />
                          <span>Staff Admin</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono bg-zinc-900 text-zinc-300 border border-white/10 rounded-full inline-flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-zinc-400" />
                          <span>Customer</span>
                        </span>
                      )}
                    </td>

                    {/* Bookings Count */}
                    <td className="p-4 text-center">
                      {user.bookingCount > 0 ? (
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                          {user.bookingCount}
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-mono text-xs">0</span>
                      )}
                    </td>

                    {/* Last Login Timestamp */}
                    <td className="p-4 font-mono text-zinc-400 whitespace-nowrap">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>
                            {user.lastLogin.toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">Never recorded</span>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="p-4 font-mono text-zinc-500 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span>
                          {user.createdAt.toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
