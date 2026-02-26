"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import { exportOrdersToExcel } from "@/lib/exportOrders";
import { toast } from "sonner";

const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: OrderAddress;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Detail dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (paymentStatusFilter) params.set("paymentStatus", paymentStatusFilter);
      if (paymentMethodFilter) params.set("paymentMethod", paymentMethodFilter);
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/admin/orders?${params}`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        setOrders(json.data.orders);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
      }
    } catch (err) {
      console.error("ORDERS LOAD ERROR:", err);
    }
    setLoading(false);
  }, [page, search, statusFilter, paymentStatusFilter, paymentMethodFilter, fromDate, toDate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Search with debounce handled by pressing enter or button
  function handleSearch() {
    setPage(1);
    loadOrders();
  }

  async function handleExport() {
    try {
      // Fetch all matching orders (no pagination) for export
      const params = new URLSearchParams();
      params.set("limit", "10000");
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (paymentStatusFilter) params.set("paymentStatus", paymentStatusFilter);
      if (paymentMethodFilter) params.set("paymentMethod", paymentMethodFilter);
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/admin/orders?${params}`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success && json.data.orders.length > 0) {
        await exportOrdersToExcel(json.data.orders);
        toast.success("Excel file downloaded");
      } else {
        toast.error("No orders to export");
      }
    } catch {
      toast.error("Export failed");
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${status}`);
        await loadOrders();
        // Update selected order if dialog is open
        if (selectedOrder?._id === orderId) {
          const updated = await res.json();
          setSelectedOrder(updated);
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
    setUpdating(false);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Orders Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {total} total orders
          </p>
        </div>
        <Button
          variant="outline"
          className="flex gap-2 cursor-pointer"
          onClick={handleExport}
        >
          <Download size={16} /> Export Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background text-foreground px-3 text-sm"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Payment Status */}
        <select
          value={paymentStatusFilter}
          onChange={(e) => {
            setPaymentStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background text-foreground px-3 text-sm"
        >
          <option value="">All Payment</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Payment Method */}
        <select
          value={paymentMethodFilter}
          onChange={(e) => {
            setPaymentMethodFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background text-foreground px-3 text-sm"
        >
          <option value="">All Methods</option>
          <option value="COD">COD</option>
          <option value="ONLINE">Online</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-sm text-muted-foreground">Date:</span>
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          className="w-auto"
        />
        <span className="text-sm text-muted-foreground">to</span>
        <Input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
          className="w-auto"
        />
        {(fromDate || toDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFromDate("");
              setToDate("");
              setPage(1);
            }}
            className="cursor-pointer"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          No orders found.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium">Order #</th>
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">
                  Phone
                </th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">
                  City
                </th>
                <th className="text-right p-3 font-medium">Amount</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">
                  Payment
                </th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">
                  Date
                </th>
                <th className="text-center p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-muted/30 transition"
                >
                  <td className="p-3 font-mono text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="p-3">{order.customer?.name}</td>
                  <td className="p-3 hidden md:table-cell">
                    {order.customer?.phone}
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {order.customer?.address?.city}
                  </td>
                  <td className="p-3 text-right font-medium">
                    ₹{order.total}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className="text-xs">
                      {order.paymentMethod}
                      <br />
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5 ${STATUS_COLORS[order.paymentStatus] || ""}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[order.status] || ""}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDetailOpen(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5">
              {/* Order Number */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-lg font-bold font-mono">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              {/* Customer */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Customer</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{selectedOrder.customer?.name}</p>
                  <p>{selectedOrder.customer?.email}</p>
                  <p>{selectedOrder.customer?.phone}</p>
                  <p>
                    {selectedOrder.customer?.address?.line1}
                    {selectedOrder.customer?.address?.line2 &&
                      `, ${selectedOrder.customer.address.line2}`}
                  </p>
                  <p>
                    {selectedOrder.customer?.address?.city},{" "}
                    {selectedOrder.customer?.address?.state} —{" "}
                    {selectedOrder.customer?.address?.pincode}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Items</h4>
                <div className="space-y-1">
                  {selectedOrder.items?.map((item: OrderItem, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-1 flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Status & Payment */}
              <div className="flex gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Status</h4>
                  <Badge
                    className={STATUS_COLORS[selectedOrder.status] || ""}
                    variant="secondary"
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Payment</h4>
                  <p className="text-sm">
                    {selectedOrder.paymentMethod} —{" "}
                    <Badge
                      className={
                        STATUS_COLORS[selectedOrder.paymentStatus] || ""
                      }
                      variant="secondary"
                    >
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="text-sm text-muted-foreground">
                <p>Ordered: {formatDate(selectedOrder.createdAt)}</p>
                {selectedOrder.estimatedDelivery && (
                  <p>
                    Est. Delivery:{" "}
                    {formatDate(selectedOrder.estimatedDelivery)}
                  </p>
                )}
              </div>

              {/* Update Status */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((s) => (
                    <Button
                      key={s}
                      variant={
                        selectedOrder.status === s ? "default" : "outline"
                      }
                      size="sm"
                      disabled={
                        updating || selectedOrder.status === s
                      }
                      onClick={() =>
                        updateOrderStatus(selectedOrder._id, s)
                      }
                      className="text-xs cursor-pointer"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
