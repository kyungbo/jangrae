import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { guides } from "@/data/guides";

export const metadata: Metadata = createMetadata(
  "장례 가이드",
  "장례 절차, 비용, 상주 예절, 상조 비교 등 장례에 관한 모든 정보를 상세하게 안내합니다.",
  "/guide"
);

export default function GuidePage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
            장례 가이드
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            장례에 관해 가장 많이 검색하는 정보를 정리했습니다. 필요한 가이드를
            선택해 주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="group block bg-white rounded-xl p-6 border border-border hover:border-navy hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-navy bg-blue-50 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-navy mb-2 group-hover:text-navy-light transition-colors">
                {guide.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {guide.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {guide.readingTime}분 읽기
                </span>
                <span>최근 업데이트: {guide.updatedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
