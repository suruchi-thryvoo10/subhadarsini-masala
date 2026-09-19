# Subhadarshini Security Architecture & Hardening

## 1. Authentication & Authorization Security
- **JWT Access & Refresh Token System**: Short-lived 15-minute access tokens and 7-day refresh tokens stored securely.
- **Role-Based Access Control (RBAC)**: Enforced via `requireRole(['ADMIN', 'MANAGER'])` middleware on all sensitive endpoints.
- **Password Hashing**: Uses Bcrypt with salt factor 10 to ensure passphrases cannot be reversed.

## 2. API Abuse & Transport Protection
- **Express Rate Limiting**: Restricts general `/api` routes to 300 requests / 15 mins per IP, and `/api/v1/auth` to 30 login attempts / 15 mins per IP.
- **Helmet Headers**: Configures security headers including `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and Strict-Transport-Security.
- **CORS Configuration**: Restricts cross-origin requests to configured trusted domain origins.

## 3. Data Sanitization & Auditability
- **Zod Schema Validation**: All incoming requests are validated against strict Zod schemas before touching controller logic.
- **Administrative Audit Logs**: Any mutation (create/update/delete) on products, orders, or lab test certificates records the user identity, action type, previous value, new value, and client IP address in `auditLogs`.
