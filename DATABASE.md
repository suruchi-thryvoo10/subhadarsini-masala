# Subhadarshini MongoDB Database Schema Documentation

## Primary Collections & Indexes

1. **`users`**:
   - `email`: `String`, unique, indexed.
   - `passwordHash`: `String` (Bcrypt salted).
   - `role`: `Enum` (`CUSTOMER`, `ADMIN`, `MANAGER`, `CONTENT_MANAGER`, `INVENTORY_MANAGER`).
   - `addresses`: `Array<{ label, name, phone, street, city, state, pincode }>`

2. **`products`**:
   - `name`: `String`, text index.
   - `slug`: `String`, unique index.
   - `category`: `ObjectId` reference to `Category`.
   - `variants`: `Array<{ size, unit, price, discountPrice, sku, stock }>`
   - `ingredients`: `Array<String>`, text index.
   - `nutritionalInfo`: `{ energy, protein, carbs, fat, sodium }`

3. **`categories`**:
   - `name`: `String`.
   - `slug`: `String`, unique index.
   - `sortOrder`: `Number`.

4. **`batches`**:
   - `batchNumber`: `String`, unique index.
   - `product`: `ObjectId` reference to `Product`.
   - `qualityReport`: `{ purityScore, moistureLevel, microbialCheck, labCertifiedBy, certificateNumber }`

5. **`orders`**:
   - `orderNumber`: `String`, unique index.
   - `user`: `ObjectId` reference (optional for guest checkout).
   - `items`: `Array<{ product, name, sku, variantSize, quantity, unitPrice, totalPrice }>`
   - `orderStatus`: `Enum` (`PENDING`, `CONFIRMED`, `PROCESSING`, `PACKED`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `REFUNDED`).
   - `trackingHistory`: `Array<{ status, timestamp, note }>`

6. **`auditLogs`**:
   - `user`: `ObjectId` reference.
   - `userEmail`: `String`.
   - `action`: `String` (e.g. `CREATE_PRODUCT`, `UPDATE_ORDER_STATUS`).
   - `entity`: `String`.
   - `previousValue`: `Mixed`.
   - `newValue`: `Mixed`.
   - `ipAddress`: `String`.
