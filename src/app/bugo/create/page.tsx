import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import BugoCreateWizard from "@/components/bugo/BugoCreateWizard";

export const metadata: Metadata = createMetadata(
  "부고장 만들기",
  "무료로 온라인 부고장을 만들고 카카오톡, 문자로 간편하게 공유하세요. 회원가입 없이 3분이면 완성됩니다.",
  "/bugo/create",
  ["부고장 만들기", "온라인 부고", "부고 작성", "모바일 부고장", "부고 공유"]
);

export default function BugoCreatePage() {
  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-navy">부고장 만들기</h1>
        <p className="text-sm text-text-secondary mt-2">
          회원가입 없이 무료로 만들 수 있습니다.
        </p>
      </div>
      <BugoCreateWizard />
    </div>
  );
}
