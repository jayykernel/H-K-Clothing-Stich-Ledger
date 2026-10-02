# Authentication API

Base URL: `http://localhost:4000/api/auth`

---

## Endpoints

### POST /register

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "ADMIN"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address (unique) |
| `password` | string | Yes | Min 6 characters |
| `name` | string | Yes | Min 2 characters |
| `role` | string | No | Default: `VIEWER` |

**Roles:** `ADMIN`, `MANAGER`, `MERCHANDISER`, `OPERATOR`, `VIEWER`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-10-02T12:00:00.000Z",
      "updatedAt": "2026-10-02T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Set-Cookie:**
```
refreshToken=eyJhbGciOiJIUzI1NiIs...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

**Errors:**
- `409 Conflict` - Email already registered
- `400 Bad Request` - Validation error

---

### POST /login

Authenticate and receive tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Set-Cookie:** Same as /register

**Errors:**
- `401 Unauthorized` - Invalid credentials or inactive account

---

### POST /logout

Clear refresh token and logout.

**Headers:** (Optional) Authorization with Bearer token

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Clear-Cookie:** `refreshToken=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`

---

### POST /refresh-token

Refresh access token using refresh token cookie.

**Request:** (Empty body)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Set-Cookie:** New refresh token (rotated)

**Errors:**
- `401 Unauthorized` - Missing, invalid, or expired refresh token

---

## Protected Routes

Use access token in Authorization header for protected endpoints.

### Authorization Header

```
Authorization: Bearer <access_token>
```

### Example Request
```bash
curl -X GET http://localhost:4000/api/protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Token Details

### Access Token
- **Type:** JWT
- **Expiry:** 15 minutes
- **Payload:**
  ```json
  {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "ADMIN"
  }
  ```

### Refresh Token
- **Type:** JWT
- **Expiry:** 7 days
- **Storage:** HTTP-only cookie
- **Rotation:** New token issued on each use

---

## Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- (And other Helmet.js security headers)

---

*Last Updated: 2026-10-02*