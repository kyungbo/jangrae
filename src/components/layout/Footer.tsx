import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">{SITE_NAME}</h3>
            <p className="text-sm leading-relaxed text-white/60">
              장례 정보의 모든 것.
              <br />
              당황하지 마세요, 하나씩 안내해 드립니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/checklist" className="hover:text-white transition-colors">
                  사망 직후 체크리스트
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-white transition-colors">
                  장례 비용 계산기
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  장례 가이드
                </Link>
              </li>
              <li>
                <Link href="/experts" className="hover:text-white transition-colors">
                  전문가 찾기
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">안내</h4>
            <p className="text-xs leading-relaxed text-white/50">
              본 서비스에서 제공하는 정보는 일반적인 안내 목적이며, 법률 자문이나
              의료 조언을 대체하지 않습니다. 구체적인 상황에 대해서는 관련
              전문가에게 상담하시기 바랍니다.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
