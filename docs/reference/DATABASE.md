# Database Schema Reference

## User Table

Stores user accounts for authentication.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `String` | No | `cuid()` | Primary key |
| `email` | `String` | No | - | Unique email address |
| `password` | `String` | No | - | Bcrypt hashed password |
| `name` | `String` | No | - | Display name |
| `role` | `Role` | No | `VIEWER` | User role/permission level |
| `isActive` | `Boolean` | No | `true` | Account active status |
| `createdAt` | `DateTime` | No | `now()` | Creation timestamp |
| `updatedAt` | `DateTime` | No | - | Last update timestamp |

### Indexes
- `email` - Unique index for login lookups
- `role` - Index for role-based queries

---

## RefreshToken Table

Stores JWT refresh tokens for token rotation.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `String` | No | `cuid()` | Primary key |
| `token` | `String` | No | - | Unique JWT refresh token |
| `userId` | `String` | No | - | Foreign key to User |
| `expiresAt` | `DateTime` | No | - | Token expiration |
| `createdAt` | `DateTime` | No | `now()` | Creation timestamp |

### Indexes
- `token` - Unique index for token lookups
- `userId` - Index for user token queries

### Relationships
- `user` → `User.id` (Cascade delete)

---

## Role Enum

```prisma
enum Role {
  ADMIN
  MANAGER
  MERCHANDISER
  OPERATOR
  VIEWER
}
```

### Role Permissions

| Role | Description | Access Level |
|------|-------------|--------------|
| `ADMIN` | Full system access | All endpoints |
| `MANAGER` | Manage orders and users | Read/Write most, no user mgmt |
| `MERCHANDISER` | Costing and orders | Read/Write costing, orders |
| `OPERATOR` | Day-to-day operations | Limited write access |
| `VIEWER` | Read-only access | Read-only |

---

## Future Tables (Phase 1+)

| Table | Description | Phase |
|-------|-------------|-------|
| `Style` | Garment style definitions | 1 |
| `Fabric` | Fabric types and prices | 1 |
| `Component` | Garment components | 1 |
| `CostingRecord` | Cost calculation records | 1 |
| `Order` | Customer orders | 2 |
| `OrderItem` | Order line items | 2 |
| `WorkflowTask` | Order workflow tasks | 3 |
| `AuditLog` | System audit trail | 4 |

---

## Database Connections

### Development
```env
DATABASE_URL="postgresql://hkclothing:hkclothing123@localhost:5432/hkclothing?schema=public"
```

### Prisma Commands
```bash
npx prisma generate    # Generate client
npx prisma db push     # Push schema changes
npx prisma migrate dev # Run migrations
npx prisma studio      # Open database UI
```

---

*Last Updated: 2026-10-02*