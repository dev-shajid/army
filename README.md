## Army App (Next.js + Supabase)

Production-ready Next.js App Router project with Supabase auth, document management (Google Drive IDs), role-based admin actions, and a global command palette.

### Tech Stack
- Next.js 16 (App Router, Server Actions, Turbopack)
- TypeScript, ESLint
- Supabase (Auth + Postgres with RLS)
- shadcn/ui + lucide-react
- pnpm

---

## Quick Start

Prerequisites:
- Node.js 18+ (20.x recommended)
- pnpm 9+
- Supabase project with keys

1) Install deps
```bash
pnpm install
```

2) Configure environment
Create `.env.local` in the project root:
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
```

3) Run the app (dev)
```bash
pnpm dev
```
Open http://localhost:3000

4) Build + start (prod)
```bash
pnpm build
pnpm start
```

Note: If Next.js warns about multiple lockfiles (pnpm vs npm), prefer pnpm and ignore the warning, or remove the extra lockfile outside this repo.

---

## Explore The App

- Command Palette: press Cmd+K (or Ctrl+K) to open. Search pages and documents. Results include page links and documents (by title and category).
- SOP Policy
	- Index: `/sop-policy/sop` (compact folders for A/Q/G Branch, CO, Staff Officer, Appointment Holders, Other)
	- Dynamic folders: `/sop-policy/sop/[slug]` where slug is one of `a-branch | q-branch | g-branch | co | staff-officer | appointment-holders | other`
	- Branch subtypes still exist at `/sop-policy/sop/{a|q|g}-branch/[type]` where type is `officer | jco | or` (pre-rendered)
- Policy: `/sop-policy/policy`
- Routine Orders: `/parts`
- Duty Roster: `/duty-roster` (+ `/duty-roster/manage` if you expose it)
- Preci: `/preci`
- Profile: `/profile`

---

## Documents (Drive Files)

Backed by a `drive_file` table in Supabase with fields:
`id, title, file_id (Google Drive), category, created_at`.

- List: `src/services/drive-file.service.ts#listDriveFiles`
- Add/Edit/Delete: admin-only (checks `user_metadata.role === 'admin'`)
- Search: debounced, top 10 results, shown in the command palette

Categories are typed in `src/types/drive.ts` as a union, e.g. `a_or, q_or, g_or, co_officer, staff_officer, appointment_holders, other_sop, policy, routine_orders, preci`.

---

## Auth & Roles

- Supabase auth is used on both client and server (`src/supabase/client.ts`, `src/supabase/server.ts`).
- Admin is determined from the authenticated user's metadata: `user.user_metadata.role === 'admin'`.
- To grant admin:
	- In Supabase Auth > Users, edit the user's metadata and set `{ "role": "admin" }`.
	- Or update via your database/users table if you mirror roles there.

Environment required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL` (used for auth redirects)

---

## Common Scripts

```bash
pnpm dev      # start dev server
pnpm build    # build for production
pnpm start    # run production build
pnpm lint     # run eslint (if configured)
```

---

## Troubleshooting

- Multiple lockfiles warning: Next.js may infer a different workspace root if you have another lockfile elsewhere. Prefer pnpm in this repo.
- Supabase keys: a wrong `NEXT_PUBLIC_SUPABASE_URL` or `PUBLISHABLE_KEY` will break auth/API calls.
- Command palette shows "No documents found": Only shown when both page and document results are empty. While searching, a "Searching files..." message appears.
- Dynamic SOP pages: we pre-render valid types via `generateStaticParams`. A bad slug or type will 404 via `notFound()`.

---

## Project Structure (high level)

```
src/
	app/
		(dashboard)/
			sop-policy/
				page.tsx                # SOP landing
				sop/
					page.tsx              # SOP folders (compact cards)
					[slug]/page.tsx       # Dynamic SOP folders (A/Q/G/CO/Staff/etc.)
					a-branch/[type]/page.tsx  # officer | jco | or
					q-branch/[type]/page.tsx  # officer | jco | or
					g-branch/[type]/page.tsx  # officer | jco | or
			duty-roster/
			parts/                    # Routine orders
			preci/
	components/
		folder-card.tsx             # Compact folder card
		command-palette.tsx         # Cmd+K global search
	services/
		drive-file.service.ts       # CRUD + search for Drive files
	supabase/
		client.ts / server.ts       # Supabase SSR clients
```

---

## Deployment

Any Node host will work. For Vercel:
1) Set env vars in your Vercel project (`NEXT_PUBLIC_*`).
2) `pnpm build` runs on CI; app uses App Router with partial prerendering.
3) Ensure Supabase URL/key match the target project.

---

Questions or bugs? Open an issue or leave a note in the repo.
