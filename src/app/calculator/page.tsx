import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = createMetadata(
  "장례 비용 계산기",
  "조문객 수, 지역, 장례 방식에 따른 예상 장례 비용을 계산해 보세요. 투명한 비용 정보를 제공합니다.",
  "/calculator"
);

export default function CalculatorPage() {
  return (
    <div className="py-12 px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "장례 비용은 얼마나 드나요?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "장례 비용은 지역, 조문객 수, 장례 유형에 따라 약 500만 원~2,000만 원 이상까지 다양합니다. 주요 비용 항목은 장례식장 시설비, 음식비, 상조/의전 비용, 화장/장지 비용입니다.",
              },
            },
            {
              "@type": "Question",
              name: "상조 가입이 필요한가요?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "상조 서비스는 관, 수의, 도우미 등을 패키지로 제공하여 편리하지만, 해약 환급률이 낮을 수 있습니다. 가입 전 서비스 내용과 환급 조건을 반드시 확인하세요.",
              },
            },
          ],
        }}
      />
      <CalculatorForm />
    </div>
  );
}
