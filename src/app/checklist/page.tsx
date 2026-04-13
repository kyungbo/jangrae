import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SituationSelector from "@/components/checklist/SituationSelector";

export const metadata: Metadata = createMetadata(
  "사망 직후 체크리스트",
  "사망 직후 해야 할 일을 상황별로 단계적으로 안내합니다. 병원, 자택, 사고 상황에 맞는 가이드를 확인하세요.",
  "/checklist",
  ["사망 직후 할 일", "장례 준비 체크리스트", "장례 절차", "사망신고 방법", "사망진단서"]
);

export default function ChecklistPage() {
  return (
    <div className="py-12 px-4">
      <SituationSelector />
    </div>
  );
}
