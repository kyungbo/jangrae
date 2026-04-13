import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/constants";
import JsonLd from "@/components/seo/JsonLd";
import FuneralHallList from "@/components/funeral-halls/FuneralHallList";

export const metadata: Metadata = createMetadata(
  "지역별 장례식장 비교 (2026)",
  "전국 지역별 장례식장 정보를 한눈에 비교하세요. 빈소 임대료, 시설 유형, 연락처, 네이버맵 길찾기까지 제공합니다.",
  "/funeral-halls",
  ["장례식장", "장례식장 비교", "장례식장 비용", "지역별 장례식장", "병원 장례식장", "공설 장례식장", "장례식장 추천"]
);

export default function FuneralHallsPage() {
  return (
    <div className="py-12 px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "전국 장례식장 목록",
          description: "지역별 장례식장 정보를 비교할 수 있습니다.",
          itemListOrder: "https://schema.org/ItemListUnordered",
          numberOfItems: 17,
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
              name: "장례식장 비교",
              item: `${SITE_URL}/funeral-halls`,
            },
          ],
        }}
      />

      <div className="max-w-4xl mx-auto mb-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><a href="/" className="hover:text-navy transition-colors">홈</a></li>
            <li>/</li>
            <li className="text-navy font-medium">장례식장 비교</li>
          </ol>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
          지역별 장례식장 비교
        </h1>
        <p className="text-text-secondary leading-relaxed">
          지역과 시설 유형을 선택하여 장례식장을 비교해 보세요.
          빈소 임대료, 시설 정보, 전화 연결 및 네이버맵 길찾기를 제공합니다.
        </p>
      </div>

      <FuneralHallList />
    </div>
  );
}
