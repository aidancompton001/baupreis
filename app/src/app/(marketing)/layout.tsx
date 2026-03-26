import MarketingFooter from "@/components/marketing/MarketingFooter";
import BreadcrumbSchema from "@/components/marketing/BreadcrumbSchema";

/* MarketingHeader REMOVED — UnifiedHeader is now in root layout */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-14">
      <BreadcrumbSchema />
      {children}
      <MarketingFooter />
    </div>
  );
}
