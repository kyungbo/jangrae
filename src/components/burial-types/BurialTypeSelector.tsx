"use client";

import { useState } from "react";
import { burialTypes, type BurialType } from "@/data/burial-types";
import { ChevronDown, ChevronUp, Check, AlertTriangle, Lightbulb, Scale } from "lucide-react";

export default function BurialTypeSelector() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? burialTypes.find((b) => b.id === selectedId) : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* 선택 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {burialTypes.map((bt) => (
          <button
            key={bt.id}
            onClick={() => setSelectedId(bt.id === selectedId ? null : bt.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              bt.id === selectedId
                ? "border-navy bg-navy/5 shadow-md"
                : "border-border bg-white hover:border-navy-light"
            }`}
          >
            <h3 className="font-semibold text-navy text-sm">{bt.name}</h3>
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">
              {bt.shortDescription}
            </p>
            <p className="text-xs text-accent font-medium mt-2">
              약 {bt.costRange.min}~{bt.costRange.max}만 원
            </p>
          </button>
        ))}
      </div>

      {/* 상세 정보 */}
      {selected && <BurialTypeDetail type={selected} />}

      {!selected && (
        <div className="text-center py-12 text-text-secondary">
          <p>위에서 장례 방식을 선택하시면 상세 절차와 팁을 확인하실 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}

function BurialTypeDetail({ type }: { type: BurialType }) {
  const [faqOpen, setFaqOpen] = useState<string | null>(null);

  return (
    <div className="space-y-8 step-transition">
      {/* 개요 */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold text-navy mb-3">{type.name}</h2>
        <p className="text-text-primary leading-relaxed mb-4">{type.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
          <span className="bg-cream-dark px-3 py-1 rounded">비용: {type.costRange.min}~{type.costRange.max}만 원</span>
          <span className="bg-cream-dark px-3 py-1 rounded">소요: {type.duration}</span>
          <span className="bg-cream-dark px-3 py-1 rounded text-xs">법적 근거: {type.legalBasis}</span>
        </div>
      </div>

      {/* 절차 */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-navy mb-4">진행 절차</h3>
        <div className="space-y-4">
          {type.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </div>
              <div>
                <h4 className="font-semibold text-navy">{step.title}</h4>
                <p className="text-sm text-text-secondary mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 장단점 비교 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Check size={18} className="text-success" />
            <h3 className="font-semibold text-success">장점</h3>
          </div>
          <ul className="space-y-2">
            {type.pros.map((p, i) => (
              <li key={i} className="text-sm text-text-primary flex gap-2">
                <span className="text-success shrink-0">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-error" />
            <h3 className="font-semibold text-error">단점</h3>
          </div>
          <ul className="space-y-2">
            {type.cons.map((c, i) => (
              <li key={i} className="text-sm text-text-primary flex gap-2">
                <span className="text-error shrink-0">-</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 팁 */}
      <div className="bg-blue-50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-navy" />
          <h3 className="font-semibold text-navy">꼭 알아두세요</h3>
        </div>
        <ul className="space-y-2">
          {type.tips.map((t, i) => (
            <li key={i} className="text-sm text-navy/80 leading-relaxed">• {t}</li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      {type.faq.length > 0 && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 bg-cream-dark flex items-center gap-2">
            <Scale size={18} className="text-navy" />
            <h3 className="font-semibold text-navy">자주 묻는 질문</h3>
          </div>
          <div className="divide-y divide-border">
            {type.faq.map((f) => (
              <div key={f.question}>
                <button
                  onClick={() => setFaqOpen(faqOpen === f.question ? null : f.question)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream-dark/50 transition-colors"
                >
                  <span className="text-sm font-medium text-navy">{f.question}</span>
                  {faqOpen === f.question ? (
                    <ChevronUp size={16} className="text-text-secondary shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-text-secondary shrink-0" />
                  )}
                </button>
                {faqOpen === f.question && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-text-secondary leading-relaxed">{f.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
