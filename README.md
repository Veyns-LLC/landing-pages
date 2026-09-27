# Veyns — Landing Pages

React + Vite + Tailwind v4. Two independent landing pages built from one repo as
separate Vite entries, so neither ships the other's JavaScript:

| Path         | Page                | Entry                     |
| ------------ | ------------------- | ------------------------- |
| `/`          | Early-cohort waitlist | `index.html`            |
| `/affiliate` | Affiliate programme   | `affiliate/index.html`  |

## Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:5173
```

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the Vite dev server            |
| `npm run build`     | Production build into `dist/`        |
| `npm run preview`   | Serve the production build locally   |
| `npm run typecheck` | Run `tsc --noEmit`                   |

## Deploying

Deployed on **Netlify**; `netlify.toml` pins the build explicitly rather than
relying on framework auto-detection.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`
- **Node version:** 20

> Do not add a `pnpm-workspace.yaml` back. Netlify treats it as a monorepo
> signal, switches the package manager to pnpm despite `package-lock.json`,
> and its Vite detection can then fall back to publishing the repo root —
> which serves the source `index.html` and its `/src/main.tsx` script tag,
> giving a blank white page with a 200 status.

A Vercel adapter (`api/subscribe.ts` + `vercel.json`) is kept alongside the
Netlify one so the site can move hosts; both call the same `api/_loops.ts`.

## Environment variables

Copy `.env.example` to `.env.local` and fill it in. On Netlify, set the same keys under
**Site configuration → Environment variables**, then redeploy.

| Variable                 | Required | Description                                             |
| ------------------------ | -------- | ------------------------------------------------------- |
| `LOOPS_API_KEY`          | yes      | Loops API key. Read server-side by `/api/subscribe`.     |
| `LOOPS_MAILING_LIST_ID`  | no       | If set, waitlist contacts are added to this Loops list.  |
| `LOOPS_AFFILIATE_LIST_ID`| no       | Overrides the affiliate list id, which is otherwise defaulted in code. |

Neither is prefixed `VITE_`, so neither is inlined into the client bundle. Never
add a `VITE_` prefix to an API key — anything prefixed `VITE_` ships to the browser.

## Waitlist / Loops integration

Both forms post to `POST /api/subscribe` with the secret key held server-side.
The `audience` field in the request body picks the mailing list and metadata; it
defaults to the waitlist, so the waitlist form sends no `audience` at all.

```
src/app/components/WaitlistForm.tsx      (audience: waitlist — the default)
src/affiliate/loops.ts                   (audience: "affiliate")
          │  POST /api/subscribe
          ▼
netlify.toml  /api/*  →  /.netlify/functions/:splat
          │
netlify/functions/subscribe.ts   (Netlify adapter — live)
api/subscribe.ts                 (Vercel adapter — standby)
          │
          ▼
api/_loops.ts  ──→  app.loops.so/api/v1/contacts/{create,update}
```

- Waitlist contacts are tagged `source: "waitlist-landing-page"`,
  `userGroup: "early-cohort"`; affiliate contacts `source:
  "affiliate-landing-page"`, `userGroup: "affiliate-waitlist"` plus a first name.
- The waitlist uses `contacts/create`, where an email already in Loops returns
  **409** — reported to the visitor as success, since they are on the list either way.
- The affiliate audience uses `contacts/update`, which upserts. Many affiliate
  signups are already contacts from the waitlist, and `contacts/create` would
  answer 409 for them **without ever adding the affiliate mailing list**. Loops
  merges `mailingLists` rather than replacing it, so existing memberships survive.
- A hidden honeypot field (`company`) silently absorbs bot submissions.
- `npm run dev` serves the same route through a dev-only Vite middleware
  (see `devSubscribeApi` in `vite.config.ts`), so no Netlify CLI is needed locally.

## Project layout

```
index.html                  # waitlist page — document head, SEO + OG tags
affiliate/index.html        # affiliate page — its own head, SEO + OG tags
public/                     # static assets copied verbatim (favicon)
src/
  main.tsx                  # waitlist entry point
  app/App.tsx               # waitlist page composition
  app/components/           # page sections (Hero, Problem, Process, Waitlist…)
  app/components/ui/        # shadcn/ui primitives
  imports/                  # Figma-exported logo + image assets
  styles/                   # fonts, Tailwind entry, design tokens
  affiliate/                # affiliate page — entry, page, styles, submit helper
```

The affiliate page keeps its own Tailwind entry scoped with `@source` to
`src/affiliate/`, so its bundle carries only its own utilities and none of the
shadcn theme. Its brand tokens are namespaced (`--color-veyns`), so the two
pages' themes do not collide.

Original design: [Figma](https://www.figma.com/design/vagnRoYRRMA6hcT3Vj1ixA/Landing-Page-for-Email-Subscribers)
