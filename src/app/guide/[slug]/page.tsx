import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ChevronLeft, ArrowRight } from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { getGuide, getAllGuideSlugs, guides } from "@/data/guides";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return createMetadata(
    guide.title,
    guide.description,
    `/guide/${slug}`,
    guide.tags
  );
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = guides
    .filter((g) => g.slug !== slug)
    .slice(0, 2);

  return (
    <div className="py-12 px-4">
      {/* Article + BreadcrumbList 스키마 */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          datePublished: guide.publishedAt,
          dateModified: guide.updatedAt,
          author: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "홈",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "장례 가이드",
              item: `${SITE_URL}/guide`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: guide.title,
              item: `${SITE_URL}/guide/${slug}`,
            },
          ],
        }}
      />

      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li>
              <Link href="/" className="hover:text-navy transition-colors">홈</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/guide" className="hover:text-navy transition-colors">가이드</Link>
            </li>
            <li>/</li>
            <li className="text-navy font-medium truncate max-w-[200px]">
              {guide.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-navy bg-blue-50 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
            {guide.title}
          </h1>
          <p className="text-text-secondary leading-relaxed mb-4">
            {guide.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {guide.readingTime}분 읽기
            </span>
            <span className="bg-green-50 text-success px-2 py-0.5 rounded text-xs font-medium">
              {guide.updatedAt} 업데이트
            </span>
          </div>
        </header>

        {/* Table of Contents */}
        <nav className="bg-cream-dark rounded-xl p-5 mb-10">
          <h2 className="text-sm font-semibold text-navy mb-3">목차</h2>
          <ol className="space-y-2">
            {guide.sections.map((section, i) => (
              <li key={i}>
                <a
                  href={`#section-${i}`}
                  className="text-sm text-text-secondary hover:text-navy transition-colors"
                >
                  {i + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="space-y-10">
          {guide.sections.map((section, i) => (
            <section key={i} id={`section-${i}`}>
              <h2 className="text-xl font-bold text-navy mb-4 pb-2 border-b border-border">
                {section.heading}
              </h2>
              <div className="prose prose-sm max-w-none text-text-primary leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="text-lg font-bold text-navy mb-4">관련 가이드</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedGuides.map((rg) => (
                <Link
                  key={rg.slug}
                  href={`/guide/${rg.slug}`}
                  className="group flex items-start gap-3 bg-cream-dark rounded-lg p-4 hover:bg-white hover:shadow transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy group-hover:text-navy-light transition-colors truncate">
                      {rg.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {rg.description}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-text-secondary shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-navy/5 rounded-xl p-6 text-center">
          <p className="text-navy font-semibold mb-2">
            더 자세한 안내가 필요하신가요?
          </p>
          <p className="text-sm text-text-secondary mb-4">
            전문가에게 무료로 상담받아 보세요.
          </p>
          <Link
            href="/experts"
            className="inline-flex items-center justify-center bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors"
          >
            전문가 찾기
          </Link>
        </div>
      </article>
    </div>
  );
}
