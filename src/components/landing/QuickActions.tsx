import Link from "next/link";
import { ClipboardCheck, Calculator, BookOpen, Users } from "lucide-react";

const actions = [
  {
    href: "/checklist",
    icon: ClipboardCheck,
    title: "긴급 체크리스트",
    description: "사망 직후 해야 할 일을 상황별로 단계적으로 안내합니다.",
    color: "text-error",
    bgColor: "bg-red-50",
  },
  {
    href: "/calculator",
    icon: Calculator,
    title: "비용 계산기",
    description: "조문객 수, 지역, 장례 방식에 따른 예상 비용을 확인하세요.",
    color: "text-navy",
    bgColor: "bg-blue-50",
  },
  {
    href: "/guide",
    icon: BookOpen,
    title: "장례 가이드",
    description: "초보 상주 가이드, 조문 예절, 사후 행정까지 총정리.",
    color: "text-success",
    bgColor: "bg-green-50",
  },
  {
    href: "/experts",
    icon: Users,
    title: "전문가 찾기",
    description: "지역 기반으로 신뢰할 수 있는 장례 전문가를 연결해 드립니다.",
    color: "text-accent",
    bgColor: "bg-amber-50",
  },
];

export default function QuickActions() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-4">
          무엇이 필요하신가요?
        </h2>
        <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">
          상황에 맞는 도구를 선택하세요. 로그인 없이 바로 이용 가능합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group block bg-cream-dark rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}
              >
                <action.icon size={24} className={action.color} />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-navy-light transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
