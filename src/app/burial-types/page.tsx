import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import JsonLd from "@/components/seo/JsonLd";
import BurialTypeSelector from "@/components/burial-types/BurialTypeSelector";

export const metadata: Metadata = createMetadata(
  "장례 방식 비교 가이드 (2026)",
  "화장, 매장, 자연장, 해양장, 납골당 등 장례 방식별 절차·비용·장단점을 한눈에 비교하세요. 나에게 맞는 장례 방식을 찾아보세요.",
  "/burial-types",
  ["장례 방식", "화장", "매장", "자연장", "해양장", "납골당", "수목장", "바다장", "장례 비교", "장례 절차"]
);

export default function BurialTypesPage() {
  return (
    <div className="py-12 px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "화장과 매장의 차이는 무엇인가요?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "화장은 시신을 화장장에서 소각 후 유골을 납골당, 자연장 등에 안치하는 방식이며, 매장은 묘지에 시신을 안장하는 전통적인 방식입니다. 현재 한국에서는 약 90% 이상이 화장을 선택합니다.",
              },
            },
            {
              "@type": "Question",
              name: "해양장(바다장)은 어떻게 하나요?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "해양장은 화장 후 유골을 분쇄하여 바다에 산포하는 방식입니다. 장사 등에 관한 법률에 따라 해안에서 5km 이상 떨어진 해역에서 실시해야 하며, 별도의 허가는 필요하지 않습니다.",
              },
            },
            {
              "@type": "Question",
              name: "자연장이란 무엇인가요?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "자연장은 화장 후 유골을 분쇄하여 잔디, 나무 아래 등 자연에 묻는 환경친화적 장례 방식입니다. 수목장이 대표적이며, 별도의 묘비 없이 자연에 되돌리는 것이 특징입니다.",
              },
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "홈",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "장례 방식 비교",
              item: `${SITE_URL}/burial-types`,
            },
          ],
        }}
      />

      <div className="max-w-3xl mx-auto mb-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><a href="/" className="hover:text-navy transition-colors">홈</a></li>
            <li>/</li>
            <li className="text-navy font-medium">장례 방식 비교</li>
          </ol>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
          장례 방식 비교 가이드
        </h1>
        <p className="text-text-secondary leading-relaxed mb-2">
          화장, 매장, 자연장, 해양장, 납골당 등 다양한 장례 방식의 절차와 비용, 장단점을 비교해 보세요.
        </p>
        <p className="text-sm text-text-secondary">
          아래에서 장례 방식을 선택하시면 상세 정보를 확인하실 수 있습니다.
        </p>
      </div>

      <BurialTypeSelector />
    </div>
  );
}
