import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ChevronLeft } from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { getGuide, getAllGuideSlugs } from "@/data/guides";
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
  return createMetadata(guide.title, guide.description, `/guide/${slug}`);
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="py-12 px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          datePublished: guide.publishedAt,
          dateModified: guide.updatedAt,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />

      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy transition-colors"
          >
            <ChevronLeft size={16} />
            가이드 목록
          </Link>
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
            <span>최근 업데이트: {guide.updatedAt}</span>
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

        {/* CTA */}
        <div className="mt-12 bg-navy/5 rounded-xl p-6 text-center">
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
