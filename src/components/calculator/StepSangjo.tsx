"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { Check, X } from "lucide-react";

export default function StepSangjo() {
  const { hasSangjo, setHasSangjo } = useCalculator();

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-navy mb-2">
        상조 회원이신가요?
      </h2>
      <p className="text-text-secondary mb-8">
        상조 가입 여부에 따라 의전 비용이 달라집니다.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <button
          onClick={() => setHasSangjo(true)}
          className={`flex flex-col items-center gap-3 py-8 px-4 rounded-xl border-2 transition-all ${
            hasSangjo
              ? "border-navy bg-navy/5"
              : "border-border bg-white hover:border-navy-light"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hasSangjo ? "bg-navy text-white" : "bg-cream-dark text-text-secondary"
            }`}
          >
            <Check size={24} />
          </div>
          <span className="font-semibold text-navy">네, 가입했어요</span>
        </button>

        <button
          onClick={() => setHasSangjo(false)}
          className={`flex flex-col items-center gap-3 py-8 px-4 rounded-xl border-2 transition-all ${
            !hasSangjo
              ? "border-navy bg-navy/5"
              : "border-border bg-white hover:border-navy-light"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              !hasSangjo
                ? "bg-navy text-white"
                : "bg-cream-dark text-text-secondary"
            }`}
          >
            <X size={24} />
          </div>
          <span className="font-semibold text-navy">아니요</span>
        </button>
      </div>
    </div>
  );
}
