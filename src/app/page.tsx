import HeroSection from "@/components/landing/HeroSection";
import QuickActions from "@/components/landing/QuickActions";
import FeaturedGuides from "@/components/landing/FeaturedGuides";
import TrustSignals from "@/components/landing/TrustSignals";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        }}
      />
      <HeroSection />
      <QuickActions />
      <TrustSignals />
      <FeaturedGuides />
    </>
  );
}
