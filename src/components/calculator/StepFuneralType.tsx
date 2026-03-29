"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { FUNERAL_TYPES } from "@/lib/constants";

const descriptions: Record<string, string> = {
  "standard-3day":
    "가장 일반적인 형태. 3일 동안 조문을 받고 발인합니다.",
  family:
    "가까운 가족과 지인만 참석하는 소규모 장례. 2일 진행.",
  "cremation-direct":
    "조문 절차 없이 바로 화장을 진행합니다. 1일 소요.",
};

export default function StepFuneralType() {
  const { funeralType, setFuneralType } = useCalculator();

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-navy mb-2">
        장례 유형은?
      </h2>
      <p className="text-text-secondary mb-8">
        장례 기간에 따라 시설비와 음식비가 달라집니다.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {FUNERAL_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setFuneralType(type.value)}
            className={`text-left py-4 px-5 rounded-lg border-2 transition-all ${
              funeralType === type.value
                ? "border-navy bg-navy/5"
                : "border-border bg-white hover:border-navy-light"
            }`}
          >
            <span className="font-semibold text-navy">{type.label}</span>
            <p className="text-sm text-text-secondary mt-1">
              {descriptions[type.value]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
