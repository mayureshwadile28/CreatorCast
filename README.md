# CreatorCast — Modern Talent Representation & Booking Platform

CreatorCast is an ultra-premium, full-stack talent representation and booking management system built for high-profile creators, musicians, keynote speakers, and entertainment talent.

---

## 🌟 Key Features

### 🎭 Customer & Client Experience
- **Obsidian Luxury Design**: Custom dark aesthetic with neon violet & electric indigo ambient lighting.
- **Dynamic Talent Roster**: Category-based filtering (`ALL`, `CREATOR`, `MUSICIAN`, `SPEAKER`, `ACTOR`) with live metrics and reach indicators.
- **Dedicated Artist Showcases**: Bespoke profile pages (`/artists/[id]`) featuring high-resolution portraits, biographical archives, and animated KPI counters.
- **Commercial Inquiry Workflow**: Interactive booking modal with calendar date selection, Indian Rupee (`₹`) budget tiers, and auto-populated Google account credentials.
- **Client Booking Dashboard**: Live status tracking (`In Agency Review`, `Confirmed`, `Declined`) at `/my-bookings`.

### 🛡️ Agency Staff Portal
- **Executive Operations Desk**: Real-time platform metrics (Total Talent, Verified Clients, Staff Administrators, Active Inquiries).
- **Roster Management**: Full control to add new talent with custom portrait URLs, bios, taglines, and up to 3 custom animated KPI counters, or safely remove roster profiles.
- **Commercial Engagement Review**: Review incoming commercial requests, verify budgets and dates, and update statuses directly in PostgreSQL.
- **User Activity Audit**: Directory of registered users, Google identities, and authentication timestamps.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Styling & Motion**: Tailwind CSS, Glassmorphism, and Framer Motion
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL) with `@supabase/ssr`
- **ORM**: [Prisma](https://www.prisma.io/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/mayureshwadile28/CreatorCast.git

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
