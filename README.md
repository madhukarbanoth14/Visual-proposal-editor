# Propose — Visual Proposal Builder

Repository: [github.com/madhukarbanoth14/Visual-proposal-editor](https://github.com/madhukarbanoth14/Visual-proposal-editor)

A production-ready, premium dynamic Quotation / Proposal Builder for wedding photography and videography businesses (and other service businesses).

## Features

- **Multi-step quotation builder** with live preview (11 steps)
- **Dynamic pricing engine** with GST, discounts, and payment schedules
- **Reusable libraries** for services, deliverables, albums, and terms
- **6 proposal themes** (Luxury, Editorial, Classic, Modern, Minimal, Traditional)
- **Client-facing proposal view** — luxury editorial experience
- **PDF generation** via @react-pdf/renderer
- **Drag & drop** event ordering
- **Auto-save** with draft persistence
- **Sample seed data** based on reference quotation (Sanghavi & Mani Kiran)

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Prisma + SQLite**
- **Zustand** (builder state)
- **@react-pdf/renderer** (PDF)
- **@dnd-kit** (drag & drop)
- **Framer Motion** (animations)

## Getting Started

```bash
git clone https://github.com/madhukarbanoth14/Visual-proposal-editor.git
cd Visual-proposal-editor
npm install
cp .env.example .env
npm run db:push
npm run dev
npm run test:app   # optional: run 22 smoke tests
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview and stats |
| `/quotations` | Quotation list |
| `/quotations/new` | Create new quotation |
| `/quotations/:id/edit` | Multi-step builder |
| `/quotations/:id/preview` | Full preview |
| `/quotations/:id/client-view` | Client-facing proposal |
| `/templates` | Theme gallery |
| `/services` | Service library |
| `/deliverables` | Deliverable library |
| `/albums` | Album library |
| `/settings/branding` | Brand settings |
| `/settings/terms` | Default terms |

## Architecture

```
src/
├── app/                    # Next.js App Router pages & API
├── components/
│   ├── builder/            # Builder steps & shell
│   ├── proposal/           # Proposal rendering (web)
│   ├── pdf/                # PDF document components
│   ├── ui/                 # Reusable UI primitives
│   └── layout/             # App layout & sidebar
├── lib/
│   ├── pricing.ts          # Pricing engine
│   ├── seed-data.ts        # Sample/default data
│   ├── quotation-service.ts
│   └── db.ts               # Prisma client & seeding
├── store/
│   └── builder-store.ts    # Zustand store
└── types/
    └── quotation.ts        # TypeScript types
```

## Sample Data

The seed quotation includes:
- Client: Sanghavi & Mani Kiran
- Events: Engagement, Cocktail, Haldi, Mehindi, Wedding, Bharaath, Reception
- Services: Candid/Traditional Photographers, Cinematic/Traditional Videographers, Drone, Live Streaming
- Albums: Premium leather albums (2×)
- Payment: 30% / 60% / 10%
- GST: 18%
- Total: ₹5,50,000

All values are fully editable — nothing is hardcoded in UI components.
