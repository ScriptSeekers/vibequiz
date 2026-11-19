import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary-purple/20 selection:text-primary-purple">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
