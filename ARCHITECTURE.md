# Subhadarshini Architecture Specification

## 1. High Level System Architecture

```
                       [ Clients / Browsers ]
                                 │
                       [ Nginx Reverse Proxy ]
                   (Port 80 / SSL / Brotli / Static)
                                 │
           ┌─────────────────────┼─────────────────────┐
           ▼                     ▼                     ▼
   [ Backend Node-1 ]    [ Backend Node-2 ]    [ Backend Node-3 ]
   (Port 5000)           (Port 5000)           (Port 5000)
           │                     │                     │
           └─────────────────────┼─────────────────────┘
                                 │
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   [ Redis 7 Cache & Store ]                 [ MongoDB 7 Cluster ]
 (Query Cache, Rate Limits,               (Users, Products, Orders,
   Token Invalidation)                      Batches, Audit Logs)
```

## 2. Component Design Principles

1. **Modular Monolith Layering**:
   - `Controllers`: Handle HTTP req/res, request validation, and response formatting.
   - `Services / Models`: Implement MongoDB schema validation, queries, and transactions.
   - `Middlewares`: Handle JWT authentication, RBAC authorization, rate limiting, and global error handling.

2. **Multi-Layer Caching Strategy**:
   - `GET /api/v1/products`: Cached in Redis (`products:*`) for 300 seconds.
   - `GET /api/v1/categories`: Cached in Redis (`categories:all`) for 1800 seconds.
   - **Cache Invalidation**: Triggered automatically when an Admin mutates a product or category via `deleteCachePattern`.
   - **Graceful Fallback**: In-memory Map fallback when Redis is unreachable.

3. **Stateless Backend Nodes**:
   - All session state is stored either in JWT tokens or Redis key-value pairs, allowing seamless load balancing across `backend1`, `backend2`, and `backend3`.
