import LayoutWrapper from "@/components/common/LayoutWrapper";
import { connectDB } from "@/lib/db";
import FooterPage from "@/lib/models/FooterPage.model";
import {
  normalizeFooterPageData,
  FOOTER_PAGE_SEED_DATA,
} from "@/lib/normalizeFooterPage";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();
  const raw = await FooterPage.findOne({ isActive: true }).lean();
  const footerData = normalizeFooterPageData(raw) || FOOTER_PAGE_SEED_DATA;
  const serialized = JSON.parse(JSON.stringify(footerData));

  return <LayoutWrapper footerData={serialized}>{children}</LayoutWrapper>;
}
