import * as XLSX from "xlsx";

export function exportOrdersToExcel(orders: any[], filename = "orders") {
  const data = orders.map((order) => ({
    "Order #": order.orderNumber,
    Customer: order.customer?.name || "",
    Email: order.customer?.email || "",
    Phone: order.customer?.phone || "",
    City: order.customer?.address?.city || "",
    State: order.customer?.address?.state || "",
    Items: order.items?.length || 0,
    "Total (₹)": order.total,
    "Payment Method": order.paymentMethod,
    "Payment Status": order.paymentStatus,
    "Order Status": order.status,
    "Order Date": new Date(order.createdAt).toLocaleDateString("en-IN"),
    "Estimated Delivery": order.estimatedDelivery
      ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN")
      : "",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  XLSX.writeFile(wb, `${filename}-${Date.now()}.xlsx`);
}
