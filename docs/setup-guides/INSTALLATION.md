# H&K Clothing - Installation Guide

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **Docker Desktop**: For PostgreSQL database
- **Git**: For version control
- **npm** or **yarn**: Package managers

---

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/jayykernel/H-K-Clothing-Stich-Ledger.git
cd H-K-Clothing-Stich-Ledger
```

### 2. Install Dependencies
```bash
npm install
```

This installs dependencies for:
- Root workspace
- `apps/web` - React frontend
- `apps/mobile` - React Native mobile app
- `backend` - Node.js/Express API
- `packages/*` - Shared libraries

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
- Database credentials
- JWT secrets (change in production!)
- Port configuration

### 4. Start PostgreSQL
```bash
docker-compose up -d postgres
```

Verify PostgreSQL is running:
```bash
docker-compose ps
```

### 5. Setup Database
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 6. Start Development Server
```bash
# From root directory
npm run dev:backend
```

Server starts on `http://localhost:4000`

---

## Verify Installation

### Health Check
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-10-02T13:00:00.000Z"
}
```

### Test Registration
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hkclothing.com",
    "password": "password123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc..."
  }
}
```

---

## Project Structure

```
H-K-Clothing-Stich-Ledger/
├── apps/
│   ├── web/              # React web application
│   └── mobile/           # React Native mobile app
├── backend/              # Node.js/Express backend
│   ├── prisma/           # Database schema & migrations
│   └── src/              # Source code
│       ├── controllers/  # Route handlers
│       ├── middleware/   # Auth, validation, etc.
│       ├── routes/       # API routes
│       ├── services/     # Business logic
│       └── utils/        # Utilities
├── packages/             # Shared packages
│   ├── api-types/        # TypeScript API types
│   ├── business-logic/   # Shared business logic
│   ├── eslint-config/    # Shared ESLint config
│   ├── typescript-config/# Shared TypeScript configs
│   ├── utils/            # Shared utilities
│   └── validation/       # Zod validation schemas
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

---

## Available Scripts

### Root Level
```bash
npm run dev:backend      # Start backend in dev mode
npm run start:backend    # Start backend in production mode
npm run lint             # Lint all workspaces
npm run test             # Run all tests
```

### Backend
```bash
cd backend

npm run dev              # Start with hot reload (tsx watch)
npm run build            # Compile TypeScript
npm run start            # Run compiled server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

---

## Troubleshooting

### Docker Issues
**PostgreSQL won't start:**
```bash
# Check Docker is running
docker info

# View logs
docker-compose logs postgres

# Restart container
docker-compose restart postgres
```

**Port 5432 already in use:**
```bash
# Find process using port (Windows)
netstat -ano | findstr :5432

# Or change port in docker-compose.yml
```

### Database Issues
**Prisma client not generated:**
```bash
cd backend
npx prisma generate
```

**Migration failed:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually push schema
npx prisma db push
```

### Dependency Issues
**npm install fails:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues
**JWT secrets not working:**
- Ensure `.env` file exists in root directory
- Verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set
- Restart server after changing `.env`

---

## Environment Variables

### Required
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_ACCESS_SECRET` | Access token secret | **Change in production** |
| `JWT_REFRESH_SECRET` | Refresh token secret | **Change in production** |

### Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12` |

---

## Next Steps

After successful installation:

1. **Create Admin User**: Register first user via API
2. **Test Authentication**: Login and verify token refresh
3. **Explore API**: Check `docs/api/` for endpoint documentation
4. **Start Frontend**: Install and run `apps/web`
5. **Review Architecture**: Read `docs/architecture/IMPLEMENTATION_PLAN.md`

---

*Last Updated: 2026-10-02*
