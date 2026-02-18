import { cn } from "@/lib/utils";

export default function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("container mx-auto px-4 py-12", className)}>
      {children}
    </main>
  );
}
