import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { Plus, Search } from "lucide-react";

export const metadata: Metadata = createMetadata(
  "부고장",
  "무료 온라인 부고장을 만들거나, 이전에 만든 부고장을 찾아 수정할 수 있습니다.",
  "/bugo",
  ["부고장", "온라인 부고", "부고장 만들기", "부고장 찾기"]
);

export default function BugoPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-navy">부고장</h1>
        <p className="text-sm text-text-secondary mt-2">
          무료로 온라인 부고장을 만들고 간편하게 공유하세요.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Link
          href="/bugo/create"
          className="flex items-center gap-4 bg-navy text-white rounded-xl p-5 hover:bg-navy-light transition-all"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
            <Plus size={24} />
          </div>
          <div>
            <p className="font-semibold text-base">새 부고장 만들기</p>
            <p className="text-sm text-cream/70 mt-0.5">
              회원가입 없이 3분이면 완성됩니다
            </p>
          </div>
        </Link>

        <Link
          href="/bugo/manage"
          className="flex items-center gap-4 bg-white border border-border rounded-xl p-5 hover:bg-cream-dark transition-all"
        >
          <div className="w-12 h-12 bg-cream-dark rounded-full flex items-center justify-center shrink-0">
            <Search size={24} className="text-navy" />
          </div>
          <div>
            <p className="font-semibold text-base text-navy">내 부고장 찾기</p>
            <p className="text-sm text-text-secondary mt-0.5">
              대표 상주 전화번호로 조회 및 수정
            </p>
          </div>
        </Link>
      </div>

      <p className="text-center text-xs text-text-secondary mt-10">
        처음장례에서 제공하는 무료 서비스입니다
      </p>
    </div>
  );
}
