import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-navy mb-4">404</h1>
      <p className="text-lg text-text-secondary mb-8">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
