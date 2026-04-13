import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import QuickActions from "@/components/landing/QuickActions";
import FeaturedGuides from "@/components/landing/FeaturedGuides";
import TrustSignals from "@/components/landing/TrustSignals";
import JsonLd from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = createMetadata(
  "장례 정보 안내 - 비용, 절차, 전문가 매칭",
  "장례 비용 계산기, 사망 직후 체크리스트, 초보 상주 가이드까지. 처음 장례를 치르는 분들을 위한 신뢰할 수 있는 정보를 제공합니다.",
  "",
  ["장례", "장례 비용", "장례 절차", "장례식장", "상조", "처음장례", "장례 준비", "사망 직후 할 일"]
);

export default function Home() {
  return (
    <>
      {/* WebSite 스키마 */}
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
            url: SITE_URL,
          },
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/guide?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      {/* Organization 스키마 */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          foundingDate: "2026",
          areaServed: {
            "@type": "Country",
            name: "KR",
          },
          serviceType: [
            "장례 정보 안내",
            "장례 비용 계산",
            "장례 전문가 매칭",
          ],
        }}
      />
      <HeroSection />
      <QuickActions />
      <TrustSignals />
      <FeaturedGuides />
    </>
  );
}
