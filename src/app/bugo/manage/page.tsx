import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import BugoManage from "@/components/bugo/BugoManage";

export const metadata: Metadata = createMetadata(
  "내 부고장 찾기",
  "대표 상주 전화번호로 작성한 부고장을 찾고 수정할 수 있습니다.",
  "/bugo/manage"
);

export default function BugoManagePage() {
  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-navy">내 부고장 찾기</h1>
        <p className="text-sm text-text-secondary mt-2">
          대표 상주 전화번호로 작성한 부고장을 찾을 수 있습니다.
        </p>
      </div>
      <BugoManage />
    </div>
  );
}
