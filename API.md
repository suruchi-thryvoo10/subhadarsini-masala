# Subhadarshini REST API Reference

Base Endpoint: `/api/v1`

## Auth Routes (`/api/v1/auth`)
- `POST /register`: Create new customer account.
- `POST /login`: Authenticate user and receive access & refresh tokens.
- `GET /me`: Fetch authenticated profile info (Requires Bearer token).
- `PUT /profile`: Update profile info & address book.

## Products & Catalog (`/api/v1/products`)
- `GET /`: Retrieve published products (Supports `category`, `search`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`).
- `GET /:slug`: Fetch product detail and related items by URL slug.

## Quality & Traceability (`/api/v1/quality`)
- `GET /verify/:batchNumber`: Public lab test verification lookup returning purity score, moisture, microbial check, certificate number, and mfg date.

## Recipes & AI Assistant (`/api/v1/recipes`)
- `GET /`: List heritage recipes with required Subhadarshini spice product linkages.
- `POST /ai-assistant`: Input available ingredients string (e.g. "chicken, onion, tomato") to receive AI recipe suggestions paired with Subhadarshini spice product recommendations.

## Orders & Checkout (`/api/v1/orders`)
- `POST /create`: Create order, reserve inventory stock, and generate Razorpay payment reference.
- `GET /track/:orderNumber`: Public order tracking status and delivery timeline.
- `GET /my-orders`: Retrieve logged-in customer's order history.

## Dealers & B2B Wholesale (`/api/v1/dealers`, `/api/v1/enquiries`)
- `GET /dealers`: Search retail partner stores by state, city, or pincode.
- `POST /enquiries`: Submit B2B bulk wholesale order inquiries.

## Admin Management (`/api/v1/admin`) — Protected by RBAC
- `GET /dashboard-stats`: Metrics overview (Revenue, total orders, low stock items, customers).
- `GET /products`, `POST /products`, `PUT /products/:id`: Admin product management.
- `GET /orders`, `PUT /orders/:id/status`: Update order fulfillment status.
- `GET /batches`, `POST /batches`: Issue new quality certificates.
- `GET /audit-logs`: View administrative action logs.
