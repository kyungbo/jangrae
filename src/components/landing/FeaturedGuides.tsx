import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { guides } from "@/data/guides";

export default function FeaturedGuides() {
  const featured = guides.slice(0, 3);

  return (
    <section className="py-16 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-2">
              장례 가이드
            </h2>
            <p className="text-text-secondary">
              많이 검색하는 장례 정보를 정리했습니다.
            </p>
          </div>
          <Link
            href="/guide"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-navy hover:text-navy-light transition-colors"
          >
            전체 보기 <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="group block bg-white rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {guide.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-navy bg-blue-50 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-navy-light transition-colors">
                {guide.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                {guide.description}
              </p>
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <Clock size={14} />
                <span>{guide.readingTime}분 읽기</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-sm font-medium text-navy"
          >
            전체 가이드 보기 <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
