"use client";

import type { CostBreakdown } from "@/lib/types";
import { RotateCcw, Users } from "lucide-react";
import Link from "next/link";

interface Props {
  result: CostBreakdown;
  onReset: () => void;
}

function formatMoney(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}억 ${amount % 10000 > 0 ? `${amount % 10000}만` : ""}`;
  }
  return `${amount}만`;
}

export default function CostResult({ result, onReset }: Props) {
  const items = [
    result.facilityRental,
    result.food,
    result.sangjo,
    result.cremation,
    result.misc,
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy mb-2">예상 장례 비용</h2>
        <p className="text-text-secondary text-sm">
          실제 비용은 장례식장, 선택 상품에 따라 달라질 수 있습니다.
        </p>
      </div>

      {/* Total */}
      <div className="bg-navy text-white rounded-xl p-6 sm:p-8 mb-6 text-center">
        <p className="text-sm text-white/70 mb-2">총 예상 비용</p>
        <p className="text-3xl sm:text-4xl font-bold">
          {formatMoney(result.total.min)} ~ {formatMoney(result.total.max)}원
        </p>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border bg-cream-dark">
          <h3 className="font-semibold text-navy">비용 항목별 내역</h3>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="text-sm text-text-primary">{item.label}</span>
              <span className="text-sm font-medium text-navy">
                {formatMoney(item.min)} ~ {formatMoney(item.max)}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <h4 className="font-semibold text-navy mb-3">비용 절약 팁</h4>
        <ul className="text-sm text-navy/80 space-y-2">
          <li>
            &bull; 음식 비용이 전체의 30~40%를 차지합니다. 조문객 수를 보수적으로 잡으세요.
          </li>
          <li>
            &bull; 장례식장 가격표는 공개 의무가 있습니다. 반드시 확인하세요.
          </li>
          <li>
            &bull; 여러 곳의 견적을 비교하면 상당한 차이가 있을 수 있습니다.
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/experts"
          className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors"
        >
          <Users size={18} />
          전문가에게 정확한 견적 받기
        </Link>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 bg-white text-navy border border-border px-6 py-3 rounded-lg font-medium hover:bg-cream-dark transition-colors"
        >
          <RotateCcw size={16} />
          다시 계산하기
        </button>
      </div>
    </div>
  );
}
