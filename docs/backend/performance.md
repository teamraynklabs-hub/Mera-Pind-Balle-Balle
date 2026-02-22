# Backend Performance

## Database Performance

### Connection Pooling

```typescript
// src/lib/db/index.ts
{
  maxPoolSize: 10,        // Maximum concurrent connections
  minPoolSize: 5,         // Minimum kept alive
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  retryReads: true,
  bufferCommands: false,  // Fail fast if disconnected
  autoIndex: process.env.NODE_ENV !== "production",
  family: 4,              // IPv4 only
}
```

### Connection Caching

Singleton pattern with global cache prevents multiple connections in serverless environment:

```typescript
let cached = global.mongoose || { conn: null, promise: null };

if (cached.conn) return cached.conn;            // Reuse existing
if (mongoose.connection.readyState === 1) {      // Check active
  cached.conn = mongoose;
  return cached.conn;
}
```

### Query Optimization

- **Lean queries**: `.lean()` on read operations returns plain objects instead of Mongoose documents
- **Projection**: `.select("-password")` excludes sensitive fields
- **Indexed fields**: Queries filter on indexed fields (email, slug, isPublished, isActive)
- **Compound indexes**: Multi-field queries use compound indexes (e.g., `{ isPublished: 1, date: -1 }`)

### Aggregation

Blog tag aggregation uses MongoDB aggregation pipeline:

```typescript
Blog.aggregate([
  { $match: { isPublished: true } },
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 12 },
]);
```

## Caching Strategy

### Next.js Revalidation

```typescript
// After admin mutations
revalidatePath("/products");    // Revalidate product pages
revalidatePath("/blog");        // Revalidate blog pages
```

### Dynamic Route Config

```typescript
// Public API routes
export const dynamic = "force-dynamic";  // No caching, always fresh
```

### Static Generation

Pages with stable content are statically generated at build time. Dynamic data pages use SSR with `no-store` fetch.

## Image Optimization

### Cloudinary CDN

- Images uploaded to Cloudinary with automatic optimization
- Organized in folders: `mpbb/products`, `mpbb/blogs`, etc.
- Old images deleted on update to prevent storage bloat
- Stream-based upload (no temp files on server)

```typescript
// Upload pattern
const buffer = Buffer.from(await file.arrayBuffer());
cloudinary.uploader.upload_stream({ folder: "mpbb/products" })
  .end(buffer);
```

### Image Cleanup

```typescript
// On product/resource deletion
if (item.imageId) {
  await cloudinary.uploader.destroy(item.imageId);
}
```

## Server-Side Validation

### Price Verification

Order creation verifies prices against database to prevent manipulation:

```typescript
const dbProducts = await Product.find({
  _id: { $in: productIds },
  isActive: true,
}).lean();

// Use DB price, not client-submitted price
const verifiedItems = items.map(item => ({
  ...item,
  price: priceMap.get(item.productId).price,
}));
```

### Zod Validation

Form submissions are validated server-side with Zod schemas before database operations.

## Recommendations for Further Optimization

### Short-term

1. **Add rate limiting** on public form endpoints (contact, distributor, careers)
2. **Implement request caching** with Redis for frequently-accessed content
3. **Add response compression** via Next.js config
4. **Optimize MongoDB queries** with `.explain()` to verify index usage

### Medium-term

1. **Background processing** for image uploads (queue-based)
2. **Webhook system** for order status notifications
3. **API response pagination** standardization across all list endpoints
4. **Database read replicas** for read-heavy operations

### Long-term

1. **CDN edge caching** for public API responses
2. **Database sharding** if data grows significantly
3. **Microservice extraction** for order processing
4. **Search engine** (Elasticsearch/Meilisearch) for full-text search
