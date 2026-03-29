"use client";

import { useChecklist } from "@/hooks/useChecklist";
import type { ChecklistData } from "@/lib/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Phone,
  RotateCcw,
} from "lucide-react";
import {
  trackStepComplete,
  trackChecklistComplete,
  trackPhoneClick,
} from "@/lib/analytics";

interface Props {
  data: ChecklistData;
}

export default function ChecklistInteractive({ data }: Props) {
  const { currentStep, completedSteps, completeStep, goNext, goPrev, reset } =
    useChecklist();

  const steps = data.steps;
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const allDone = completedSteps.size === steps.length;

  const handleComplete = (stepId: number) => {
    completeStep(stepId);
    const s = steps.find((x) => x.id === stepId);
    if (s && !completedSteps.has(stepId)) {
      trackStepComplete(data.situation, stepId, s.title);
    }
    // 전체 완료 체크 (이번 toggle로 추가되는 경우 size+1)
    if (!completedSteps.has(stepId) && completedSteps.size + 1 === steps.length) {
      trackChecklistComplete(data.situation);
    }
  };

  if (allDone && isLastStep) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-4">
          모든 단계를 확인하셨습니다
        </h2>
        <p className="text-text-secondary mb-8 leading-relaxed">
          힘든 시간이시겠지만, 차분하게 잘 대처하고 계십니다.
          <br />
          추가로 궁금한 사항이 있으시면 가이드를 참고해 주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/guide"
            className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors"
          >
            장례 가이드 보기
          </a>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-white text-navy border border-border px-6 py-3 rounded-lg font-medium hover:bg-cream-dark transition-colors"
          >
            <RotateCcw size={16} />
            처음부터 다시
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
          <span>
            {currentStep + 1} / {steps.length} 단계
          </span>
          <span>{completedSteps.size}개 완료</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-navy h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step Card */}
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8 mb-6 step-transition">
        <div className="flex items-start gap-4 mb-6">
          <button
            onClick={() => handleComplete(step.id)}
            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
              completedSteps.has(step.id)
                ? "bg-success border-success text-white"
                : "border-border hover:border-navy"
            }`}
          >
            {completedSteps.has(step.id) && <Check size={16} />}
          </button>
          <div>
            <h2
              className={`text-xl font-bold mb-1 ${
                completedSteps.has(step.id)
                  ? "text-text-secondary line-through"
                  : "text-navy"
              }`}
            >
              {step.title}
            </h2>
          </div>
        </div>

        <p className="text-text-primary leading-relaxed mb-6 pl-12">
          {step.description}
        </p>

        {step.tip && (
          <div className="flex gap-3 bg-blue-50 rounded-lg p-4 mb-4 ml-12">
            <Lightbulb size={20} className="text-navy shrink-0 mt-0.5" />
            <p className="text-sm text-navy leading-relaxed">{step.tip}</p>
          </div>
        )}

        {step.warning && (
          <div className="flex gap-3 bg-red-50 rounded-lg p-4 mb-4 ml-12">
            <AlertTriangle
              size={20}
              className="text-error shrink-0 mt-0.5"
            />
            <p className="text-sm text-error leading-relaxed">
              {step.warning}
            </p>
          </div>
        )}

        {step.phone && (
          <div className="ml-12">
            <a
              href={`tel:${step.phone}`}
              onClick={() => trackPhoneClick(step.phone!, data.situation)}
              className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors"
            >
              <Phone size={16} />
              {step.phoneName || step.phone} 전화하기
            </a>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
          이전
        </button>

        <button
          onClick={() => goNext(steps.length)}
          disabled={isLastStep}
          className="flex items-center gap-1 bg-navy text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          다음 <ChevronRight size={18} />
        </button>
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-8">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => useChecklist.setState({ currentStep: i })}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentStep
                ? "bg-navy scale-125"
                : completedSteps.has(s.id)
                  ? "bg-success"
                  : "bg-border"
            }`}
            aria-label={`${i + 1}단계로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
