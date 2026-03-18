import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import BreadcrumbSchema from "@/components/marketing/BreadcrumbSchema";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema />
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </>
  );
}
