import { Shield, Eye, Clock } from "lucide-react";

const signals = [
  {
    icon: Clock,
    title: "24시간 정보 제공",
    description: "새벽이든 주말이든, 언제든지 필요한 정보를 확인하세요.",
  },
  {
    icon: Eye,
    title: "투명한 비용 공개",
    description: "감추어진 비용 없이, 예상 장례 비용을 미리 알 수 있습니다.",
  },
  {
    icon: Shield,
    title: "전문가 검증 정보",
    description: "장례 전문가가 검증한 정확한 절차와 가이드를 제공합니다.",
  },
];

export default function TrustSignals() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm text-text-secondary">
            매년 약 <span className="font-semibold text-navy">30만 건</span>의
            장례가 치러집니다.
          </p>
          <p className="text-sm text-text-secondary">
            준비된 정보로 현명하게 대처하세요.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signals.map((signal) => (
            <div key={signal.title} className="text-center">
              <div className="w-14 h-14 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <signal.icon size={24} className="text-navy" />
              </div>
              <h3 className="font-semibold text-navy mb-2">{signal.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {signal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
