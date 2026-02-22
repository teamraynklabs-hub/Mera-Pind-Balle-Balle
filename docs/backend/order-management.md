# Order Management

## Overview

The order management system handles the complete lifecycle from cart checkout to delivery, including payment tracking and admin management.

## Order Lifecycle

```
PLACED → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
                                          └→ CANCELLED

Payment: PENDING → PAID → (FAILED | REFUNDED)
```

## Order Creation Flow

### Step 1: Cart Checkout

```
Client (CheckoutDrawer)
    │
    ├── Validate user authentication (requireAuth)
    ├── Collect shipping details (Zod validation)
    ├── Submit cart items + customer data
    │
    ▼
POST /api/orders/create
```

### Step 2: Server Validation

```typescript
// 1. Verify authentication
const user = await getUserFromCookie();
if (!user) return 401;

// 2. Validate request body
const { customer, items, paymentMethod } = body;

// 3. Verify product prices from database
const productIds = items.map(i => i.productId);
const dbProducts = await Product.find({
  _id: { $in: productIds },
  isActive: true,
}).lean();

// 4. Recalculate totals using DB prices (NOT client prices)
const verifiedItems = items.map(item => {
  const dbProduct = priceMap.get(item.productId);
  return { ...item, price: dbProduct.price };
});

const subtotal = verifiedItems.reduce(
  (sum, item) => sum + item.price * item.quantity, 0
);
```

### Step 3: Order Creation

```typescript
// Generate unique order number
const orderNumber = `MPBB-${dateStr}-${random4Digits}`;

// Set estimated delivery (+8 days)
const estimatedDelivery = new Date();
estimatedDelivery.setDate(estimatedDelivery.getDate() + 8);

// Create order document
const order = await Order.create({
  userId: user.userId,
  orderNumber,
  customer,
  items: verifiedItems,
  subtotal,
  deliveryCharge,
  total: subtotal + deliveryCharge,
  paymentMethod,
  paymentStatus: "PENDING",
  status: "PLACED",
  estimatedDelivery,
});
```

### Step 4: Confirmation

```
← Return { success: true, data: order }
    │
    ▼
Client redirects to /order-success/[orderNumber]
    │
    ▼
Client clears cart (clearCart())
```

## Order Number Format

```
MPBB-YYYYMMDD-XXXX

MPBB     → System prefix
YYYYMMDD → Date (e.g., 20260222)
XXXX     → Random 4-digit suffix
```

## Admin Order Management

### List Orders

```
GET /api/admin/orders
    │
    Query params:
    ├── status: "PLACED" | "CONFIRMED" | ... | "CANCELLED"
    ├── paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
    ├── from: "YYYY-MM-DD" (date range start)
    ├── to: "YYYY-MM-DD" (date range end)
    ├── search: "customer name or order number"
    ├── page: number
    └── limit: number (default: 20)
```

### Update Order

```
PUT /api/admin/orders/[id]
    │
    Body: { status, paymentStatus, notes }
    │
    ├── Update order document
    ├── If status === "DELIVERED": set deliveredAt = new Date()
    │
    └── Return updated order
```

### Delete Order

```
DELETE /api/admin/orders/[id]
    │
    └── Order.findByIdAndDelete(id)
```

### Export Orders

**File**: `src/lib/exportOrders.ts`

Exports filtered orders to Excel (XLSX format) for reporting:
- Customer details
- Order items
- Payment information
- Delivery status

## Data Model

```typescript
Order {
  userId: ObjectId,           // Links to User
  orderNumber: String,        // Unique, indexed
  customer: {
    name, email, phone,
    address: { line1, line2, city, state, pincode }
  },
  items: [{
    productId: ObjectId,
    name, price, quantity, image
  }],
  subtotal: Number,
  deliveryCharge: Number,
  total: Number,
  paymentMethod: "COD" | "ONLINE",
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
  status: "PLACED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  estimatedDelivery: Date,
  deliveredAt: Date,
  notes: String,
}
```

## Payment Integration

### Current: Cash on Delivery (COD)

Default payment method. Payment status set to `PENDING` on creation, manually updated by admin.

### Prepared: Razorpay (Online)

Schema includes Razorpay fields but integration is not yet active:

```typescript
razorpayOrderId: String,
razorpayPaymentId: String,
razorpaySignature: String,
```

### Future Integration Steps

1. Create Razorpay order on checkout
2. Client-side payment flow with Razorpay SDK
3. Webhook handler for payment confirmation
4. Verify payment signature server-side
5. Update `paymentStatus` to "PAID" on success

## Security Measures

- **Price verification**: Server recalculates from database prices
- **Authentication**: User must be logged in to place orders
- **Order isolation**: Users can only view their own orders
- **Admin authorization**: Only admins can update/delete orders
- **Order number uniqueness**: Prevents duplicate orders
