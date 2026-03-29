import Link from "next/link";
import { ClipboardCheck, Calculator } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-cream py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-medium text-accent mb-4 tracking-wide">
          장례 정보 안내 서비스
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
          당황하지 마세요,
          <br />
          하나씩 안내해 드립니다.
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          갑작스러운 상황에서 무엇을 해야 할지 모르시겠나요?
          <br className="hidden sm:block" />
          지금 바로 해야 할 일부터, 예상 비용까지 차근차근 알려드립니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checklist"
            className="inline-flex items-center justify-center gap-2 bg-navy text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-navy-light transition-colors"
          >
            <ClipboardCheck size={20} />
            지금 체크리스트 시작
          </Link>
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center gap-2 bg-white text-navy border-2 border-navy px-8 py-4 rounded-lg text-base font-semibold hover:bg-cream-dark transition-colors"
          >
            <Calculator size={20} />
            비용 알아보기
          </Link>
        </div>
      </div>
    </section>
  );
}
