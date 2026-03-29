"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { calculateCost } from "@/lib/calculator/calculate";
import StepGuests from "./StepGuests";
import StepRegion from "./StepRegion";
import StepFuneralType from "./StepFuneralType";
import StepSangjo from "./StepSangjo";
import CostResult from "./CostResult";

const TOTAL_STEPS = 4;

export default function CalculatorForm() {
  const store = useCalculator();

  const handleCalculate = () => {
    const result = calculateCost({
      guestCount: store.guestCount,
      region: store.region,
      funeralType: store.funeralType,
      hasSangjo: store.hasSangjo,
    });
    store.setResult(result);
    store.nextStep();
  };

  const canProceed = () => {
    switch (store.step) {
      case 0:
        return store.guestCount > 0;
      case 1:
        return store.region !== "";
      case 2:
        return store.funeralType !== "";
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (store.step === TOTAL_STEPS && store.result) {
    return <CostResult result={store.result} onReset={store.reset} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
          <span>
            {store.step + 1} / {TOTAL_STEPS}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-navy h-2 rounded-full transition-all duration-300"
            style={{ width: `${((store.step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8 mb-6 min-h-[300px] flex flex-col justify-center step-transition">
        {store.step === 0 && <StepGuests />}
        {store.step === 1 && <StepRegion />}
        {store.step === 2 && <StepFuneralType />}
        {store.step === 3 && <StepSangjo />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={store.prevStep}
          disabled={store.step === 0}
          className="text-sm font-medium text-text-secondary hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          이전
        </button>

        {store.step < TOTAL_STEPS - 1 ? (
          <button
            onClick={store.nextStep}
            disabled={!canProceed()}
            className="bg-navy text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-navy-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            다음
          </button>
        ) : (
          <button
            onClick={handleCalculate}
            className="bg-navy text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
          >
            비용 계산하기
          </button>
        )}
      </div>
    </div>
  );
}
