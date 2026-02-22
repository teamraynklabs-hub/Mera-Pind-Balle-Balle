# Commerce Module (Cart, Orders, Checkout)

## Cart Page

### Page Purpose
Displays shopping cart contents and provides checkout functionality via a slide-out drawer.

### Route Path
`/cart`

### Required Permissions
None for viewing cart. User authentication required for checkout.

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| CartPageClient | `features/cart/CartPageClient.tsx` | Cart listing and totals |
| CheckoutDrawer | `features/cart/CheckoutDrawer.tsx` | Checkout form drawer |

### State Management
- `useCart()` context provides: `items`, `totalItems`, `totalPrice`, `removeFromCart`, `updateQuantity`, `clearCart`
- Cart persisted in `localStorage` under key `mpbb-cart`
- No API call for cart data (fully client-side)

### Validation Schema

**File**: `src/lib/validations/checkout.ts`

```typescript
checkoutSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().min(1).email(),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  line1: z.string().min(10),
  line2: z.string(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});
```

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/create` | POST | Submit order |

### Checkout Flow

```
Cart Page → Click "Checkout"
    │
    ├── Check authentication (useUserAuth.requireAuth())
    │   ├── Not logged in → Redirect to /login
    │   └── Logged in → Open CheckoutDrawer
    │
    ▼
CheckoutDrawer
    │
    ├── Fill shipping details (name, email, phone, address)
    ├── Select payment method (COD)
    ├── Review order summary
    │
    ▼
Submit Order → POST /api/orders/create
    │
    ├── Server validates prices against database
    ├── Creates Order document
    ├── Returns order confirmation
    │
    ▼
Redirect to /order-success/[orderId]
    │
    ▼
clearCart() — Empty local cart
```

### Edge Cases
- Empty cart — show "Your cart is empty" with link to products
- Unauthenticated checkout attempt — redirect to login
- Product out of stock at checkout time — server rejects order
- Network failure during order — error toast, order not placed
- Price mismatch (client vs server) — server uses database prices

---

## Order Success Page

### Page Purpose
Displays order confirmation after successful checkout.

### Route Path
`/order-success/[orderId]`

### Dynamic Parameter
`orderId: string` — The order number (format: `MPBB-YYYYMMDD-XXXX`)

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/[id]` | GET | Fetch order details |

### Content Displayed
- Order number
- Order status
- Items ordered with quantities and prices
- Shipping address
- Total amount
- Estimated delivery date

### Edge Cases
- Invalid order ID — show error
- Order belongs to different user — handled by API authorization

---

## Order Lifecycle

```
PLACED → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
                                          └→ CANCELLED

Payment: PENDING → PAID → (FAILED | REFUNDED)
```

### Server-Side Price Verification

The order creation API verifies all prices against the database to prevent client-side price manipulation:

```typescript
// Server recalculates from DB prices
const dbProducts = await Product.find({
  _id: { $in: productIds },
  isActive: true,
}).lean();

// Uses DB price, not client-submitted price
const verifiedPrice = dbProduct.price;
```

### Delivery Charge
Currently set as a configurable value. Free delivery above a certain threshold (configurable).

### Order Number Format
Auto-generated: `MPBB-YYYYMMDD-XXXX` where XXXX is a random 4-digit suffix.
