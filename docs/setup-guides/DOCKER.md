# Docker Setup Guide

## Overview

The development environment uses Docker Compose to run PostgreSQL locally.

---

## Services

### PostgreSQL 15
- **Container:** `hk-clothing-postgres`
- **Port:** `5432`
- **Database:** `hkclothing`
- **Credentials:** See `.env.example`

---

## Commands

### Start Services
```bash
# Start PostgreSQL in background
docker-compose up -d

# Or start with logs visible
docker-compose up
```

### Stop Services
```bash
# Stop containers (keeps data)
docker-compose stop

# Stop and remove containers (keeps data via volume)
docker-compose down

# Stop and DELETE all data
docker-compose down -v
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Access Database CLI
```bash
docker exec -it hk-clothing-postgres psql -U hkclothing -d hkclothing
```

### Reset Database
```bash
# Remove volume (deletes all data)
docker-compose down -v

# Restart fresh
docker-compose up -d

# Re-run migrations
cd backend && npx prisma db push
```

---

## Useful SQL Commands

Once inside `psql`:
```sql
-- List tables
\dt

-- Show table schema
\d "User"
\d "RefreshToken"

-- Count users
SELECT COUNT(*) FROM "User";

-- List all users
SELECT id, email, name, role, "isActive" FROM "User";

-- Delete all refresh tokens
DELETE FROM "RefreshToken";
```

---

## Production Notes

For production deployments:
- Use managed PostgreSQL (AWS RDS, Azure Database, Supabase)
- Enable SSL connections
- Configure connection pooling
- Set up automated backups
- Use strong, rotated credentials

---

*Last Updated: 2026-10-02*