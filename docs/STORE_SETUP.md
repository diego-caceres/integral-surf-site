# Store Setup

This project now includes a lightweight Store module with cart + order creation.

## 1. Create Supabase tables

Run the SQL in `docs/sql/store_schema.sql` in your Supabase SQL editor.

## 2. Seed products

Add products to `store_products` (you can use the sample inserts from the SQL file).

Variant fields:

- `available_sizes`: text array. If this array has values, size is required when adding the product to cart.
- `available_colors`: text array. This is optional at checkout; if provided it must be one of these values.

## 3. Configure email delivery

Add these variables to your environment:

- `RESEND_API_KEY`: API key from Resend.
- `STORE_FROM_EMAIL`: sender identity configured in Resend, for example `Integral Surf <store@yourdomain.com>`.
- `STORE_ADMIN_EMAILS`: comma-separated admin recipients, for example `owner@yourdomain.com,ops@yourdomain.com`.

## 4. API endpoints

- `GET /api/store/products`: fetches active store products.
- `POST /api/store/orders`: validates cart (including size/color variants), creates order + order items, sends notification email.

## 5. Frontend route

- `/productos`: product listing, cart, and checkout form (without payment integration).
