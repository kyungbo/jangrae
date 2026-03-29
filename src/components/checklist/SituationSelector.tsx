import Link from "next/link";
import { Building2, Home, AlertTriangle } from "lucide-react";

const situations = [
  {
    href: "/checklist/hospital",
    icon: Building2,
    title: "병원에서 임종",
    description: "병원에서 사망하셨거나 임종이 임박한 경우",
    bgColor: "bg-blue-50",
    color: "text-navy",
  },
  {
    href: "/checklist/home",
    icon: Home,
    title: "자택에서 임종",
    description: "집에서 사망하신 경우 (검안 절차 필요)",
    bgColor: "bg-green-50",
    color: "text-success",
  },
  {
    href: "/checklist/accident",
    icon: AlertTriangle,
    title: "사고로 사망",
    description: "사고로 인한 사망 (수사 절차 동반)",
    bgColor: "bg-red-50",
    color: "text-error",
  },
];

export default function SituationSelector() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
          어떤 상황이신가요?
        </h1>
        <p className="text-text-secondary">
          상황을 선택하시면, 지금 바로 해야 할 일을 단계별로 안내해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {situations.map((situation) => (
          <Link
            key={situation.href}
            href={situation.href}
            className="group flex items-center gap-5 bg-white rounded-xl p-6 border border-border hover:border-navy hover:shadow-md transition-all"
          >
            <div
              className={`w-14 h-14 ${situation.bgColor} rounded-lg flex items-center justify-center shrink-0`}
            >
              <situation.icon size={28} className={situation.color} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-navy group-hover:text-navy-light transition-colors">
                {situation.title}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {situation.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
