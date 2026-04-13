import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { mockExperts } from "@/data/experts/mock-experts";
import { Star, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "장례 전문가 찾기",
  "지역 기반으로 신뢰할 수 있는 장례 전문가를 찾아보세요. 장례지도사, 상조 상담사 등 전문가 정보를 제공합니다.",
  "/experts",
  ["장의사", "장례지도사", "상조 상담", "장례 전문가", "장례식장 추천"]
);

export default function ExpertsPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Notice Banner */}
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-10 text-center">
          <p className="text-accent font-semibold mb-1">
            전문가 매칭 서비스 준비 중
          </p>
          <p className="text-sm text-text-secondary">
            현재 전문가 정보를 수집하고 검증하고 있습니다. 곧 정식 서비스를
            만나보실 수 있습니다.
          </p>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
            장례 전문가 찾기
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            지역 기반으로 신뢰할 수 있는 장례 전문가를 연결해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockExperts.map((expert) => (
            <div
              key={expert.id}
              className="bg-white rounded-xl border border-border p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-navy">{expert.name}</h3>
                  <p className="text-sm text-text-secondary">
                    {expert.specialty}
                  </p>
                </div>
                {expert.available ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-success bg-green-50 px-2 py-1 rounded">
                    <Clock size={12} />
                    즉시 상담 가능
                  </span>
                ) : (
                  <span className="text-xs font-medium text-text-secondary bg-gray-100 px-2 py-1 rounded">
                    상담 예약 필요
                  </span>
                )}
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {expert.bio}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {expert.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-warning fill-warning" />
                    {expert.rating} ({expert.reviewCount})
                  </span>
                </div>

                <button
                  disabled
                  className="text-sm font-medium text-white bg-navy/40 px-4 py-2 rounded-lg cursor-not-allowed"
                >
                  문의하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
