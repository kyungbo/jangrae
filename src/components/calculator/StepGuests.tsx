"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { GUEST_RANGES } from "@/lib/constants";

export default function StepGuests() {
  const { guestCount, setGuestCount } = useCalculator();

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-navy mb-2">
        예상 조문객 수는?
      </h2>
      <p className="text-text-secondary mb-8">
        대략적인 조문객 수를 선택해 주세요. 음식 비용 산정에 활용됩니다.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GUEST_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => setGuestCount(range.value)}
            className={`py-4 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
              guestCount === range.value
                ? "border-navy bg-navy text-white"
                : "border-border bg-white text-text-primary hover:border-navy-light"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
