# Subhadarshini Production Deployment Guide

## Docker Compose Deployment

The platform is fully containerized and orchestrated via `docker-compose.yml`.

### Prerequisites
- Docker Engine 24.0+
- Docker Compose 2.20+

### Steps
1. Clone the repository and configure `.env` variables:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Build and launch the cluster:
   ```bash
   docker-compose up --build -d
   ```
3. Seed the initial production database:
   ```bash
   docker exec -it subhadarshini_backend_1 npm run seed
   ```
4. Verify running services:
   ```bash
   docker-compose ps
   ```

### Architecture Components
- **Nginx Load Balancer** (`Port 80`): Serves Vite production build and routes `/api/*` to `backend1`, `backend2`, `backend3`.
- **Stateless Express Backend Cluster**: 3 containers listening on `5000`.
- **Redis Service**: Caches queries and rate limiting counters.
- **MongoDB Service**: Persistent database with named docker volume `mongo_data`.
