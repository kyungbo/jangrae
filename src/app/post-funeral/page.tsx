import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import JsonLd from "@/components/seo/JsonLd";
import PostFuneralInteractive from "@/components/post-funeral/PostFuneralInteractive";

export const metadata: Metadata = createMetadata(
  "장례 후 행정절차 체크리스트 (2026)",
  "장례 후 해야 할 행정절차를 한눈에 확인하세요. 사망신고, 상속재산 조회, 보험 청구, 연금, 금융 정리, 상속세 신고까지 유형별 맞춤 체크리스트.",
  "/post-funeral",
  ["장례 후 행정절차", "사망신고", "상속재산 조회", "유족연금", "상속세 신고", "보험 청구", "사후 행정", "장례 후 할일"]
);

export default function PostFuneralPage() {
  return (
    <div className="py-12 px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "장례 후 행정절차 체크리스트",
          description: "장례 후 해야 할 행정절차를 유형별로 안내합니다.",
          step: [
            {
              "@type": "HowToStep",
              name: "사망신고",
              text: "주민센터 또는 시·구청에 사망신고서를 제출합니다. 사망 후 1개월 이내에 처리해야 합니다.",
            },
            {
              "@type": "HowToStep",
              name: "상속재산 조회",
              text: "안심상속 원스톱 서비스를 통해 고인의 금융자산, 부동산, 세금, 연금 등을 한 번에 조회합니다.",
            },
            {
              "@type": "HowToStep",
              name: "보험 및 연금 청구",
              text: "고인의 보험 가입 내역을 확인하고 사망보험금 및 유족연금을 청구합니다.",
            },
            {
              "@type": "HowToStep",
              name: "금융·부동산 정리",
              text: "은행 계좌, 신용카드, 부동산 상속 등기, 자동차 명의 이전을 처리합니다.",
            },
            {
              "@type": "HowToStep",
              name: "상속세 신고",
              text: "상속 개시일로부터 6개월 이내에 상속세를 신고·납부합니다.",
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
              name: "장례 후 행정절차",
              item: `${SITE_URL}/post-funeral`,
            },
          ],
        }}
      />

      <div className="max-w-3xl mx-auto mb-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><a href="/" className="hover:text-navy transition-colors">홈</a></li>
            <li>/</li>
            <li className="text-navy font-medium">장례 후 행정절차</li>
          </ol>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
          장례 후 행정절차 체크리스트
        </h1>
        <p className="text-text-secondary leading-relaxed mb-2">
          장례가 끝난 후에도 처리해야 할 행정 업무가 많습니다.
          고인과의 관계에 따라 해당되는 절차만 필터링하여 하나씩 체크해 보세요.
        </p>
        <p className="text-sm text-accent font-medium">
          체크한 내용은 페이지를 벗어나면 초기화됩니다. 필요하시면 스크린샷으로 저장해 주세요.
        </p>
      </div>

      <PostFuneralInteractive />
    </div>
  );
}
