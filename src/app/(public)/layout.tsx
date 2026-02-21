import LayoutWrapper from "@/components/common/LayoutWrapper";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();
  const dashboardDoc = await Dashboard.findOne({ isActive: true }).lean();
  const footer = dashboardDoc
    ? JSON.parse(JSON.stringify((dashboardDoc as any).footer || null))
    : null;

  return <LayoutWrapper footer={footer}>{children}</LayoutWrapper>;
}
