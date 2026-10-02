# H&K Clothing Stitch Ledger — Documentation

Complete documentation for the H&K Clothing Manufacturing Management System.

---

## 📂 Folder Structure

```
docs/
├── README.md                          ← You are here
├── api/
│   └── AUTH.md                        ← Auth API endpoints reference
├── architecture/
│   └── IMPLEMENTATION_PLAN.md         ← Full system architecture & tech spec
├── guides/
│   └── DEVELOPMENT.md                 ← Coding standards & workflow guide
├── phase-tracking/
│   ├── PHASE_CHECKLIST.md             ← 8-phase development roadmap (157 tasks)
│   └── phase-0/
│       └── PROGRESS.md                ← Phase 0 status tracker
├── reference/
│   └── DATABASE.md                    ← Database schema reference
└── setup-guides/
    ├── INSTALLATION.md                ← Full installation walkthrough
    └── DOCKER.md                      ← Docker development environment guide
```

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
docker-compose up -d
cd backend && npx prisma generate && npx prisma db push
npm run dev:backend
```

Server: `http://localhost:4000` | Health: `http://localhost:4000/health`

---

## 📘 Key Documents

| Document | Description |
|----------|-------------|
| [`architecture/IMPLEMENTATION_PLAN.md`](architecture/IMPLEMENTATION_PLAN.md) | Full technical blueprint (32+ sections) |
| [`phase-tracking/PHASE_CHECKLIST.md`](phase-tracking/PHASE_CHECKLIST.md) | 8-phase roadmap with task lists |
| [`phase-tracking/phase-0/PROGRESS.md`](phase-tracking/phase-0/PROGRESS.md) | Current phase progress |
| [`setup-guides/INSTALLATION.md`](setup-guides/INSTALLATION.md) | Getting started guide |
| [`setup-guides/DOCKER.md`](setup-guides/DOCKER.md) | Docker environment guide |
| [`api/AUTH.md`](api/AUTH.md) | Authentication API reference |
| [`reference/DATABASE.md`](reference/DATABASE.md) | Database schema reference |
| [`guides/DEVELOPMENT.md`](guides/DEVELOPMENT.md) | Coding standards & workflow |

---

## 📈 Phase Progress

| Phase | Weeks | Status |
|-------|-------|--------|
| **Phase 0**: Project Setup & Authentication | Week 1 | 🟡 In Progress |
| **Phase 1**: Costing Module Core | Weeks 2–4 | ⬜ Pending |
| **Phase 2**: Order Management | Weeks 5–6 | ⬜ Pending |
| **Phase 3**: Status Follow-Up Module | Weeks 7–9 | ⬜ Pending |
| **Phase 4**: Order History & Reporting | Weeks 10–11 | ⬜ Pending |
| **Phase 5**: Mobile Application | Weeks 12–14 | ⬜ Pending |
| **Phase 6**: Security & Performance | Weeks 15–16 | ⬜ Pending |
| **Phase 7**: Testing & QA | Weeks 17–18 | ⬜ Pending |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js 18+, Express, Prisma ORM, PostgreSQL |
| **Frontend** | React 18, TypeScript, Material-UI, Redux Toolkit |
| **Mobile** | React Native + Expo, React Native Paper |
| **Auth** | JWT (15min), Refresh tokens (7d), Bcrypt |
| **Validation** | Zod (shared via monorepo) |
| **Dev Tools** | Docker, tsx, ESLint, Prettier |

---

*Last Updated: 2026-10-02*
