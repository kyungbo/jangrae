import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/metadata";
import { getChecklist, isValidSituation } from "@/data/checklists";
import ChecklistInteractive from "@/components/checklist/ChecklistInteractive";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME } from "@/lib/constants";

interface PageProps {
  params: Promise<{ situation: string }>;
}

export async function generateStaticParams() {
  return [
    { situation: "hospital" },
    { situation: "home" },
    { situation: "accident" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { situation } = await params;
  const data = getChecklist(situation);
  if (!data) return {};
  return createMetadata(
    data.title,
    data.description,
    `/checklist/${situation}`
  );
}

export default async function SituationPage({ params }: PageProps) {
  const { situation } = await params;

  if (!isValidSituation(situation)) {
    notFound();
  }

  const data = getChecklist(situation)!;

  return (
    <div className="py-12 px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: data.title,
          description: data.description,
          publisher: { "@type": "Organization", name: SITE_NAME },
          step: data.steps.map((step, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: step.title,
            text: step.description,
          })),
        }}
      />
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">
          {data.title}
        </h1>
        <p className="text-text-secondary">{data.description}</p>
      </div>
      <ChecklistInteractive data={data} />
    </div>
  );
}
