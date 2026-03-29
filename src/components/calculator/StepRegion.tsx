"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { REGIONS } from "@/lib/constants";

export default function StepRegion() {
  const { region, setRegion } = useCalculator();

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-navy mb-2">
        장례식장 지역은?
      </h2>
      <p className="text-text-secondary mb-8">
        지역에 따라 시설 임대료가 다릅니다.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {REGIONS.map((r) => (
          <button
            key={r.value}
            onClick={() => setRegion(r.value)}
            className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
              region === r.value
                ? "border-navy bg-navy text-white"
                : "border-border bg-white text-text-primary hover:border-navy-light"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
