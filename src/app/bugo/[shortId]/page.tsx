import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import BugoViewer from "@/components/bugo/BugoViewer";
import type { BugoView } from "@/lib/bugo/types";

type Props = {
  params: Promise<{ shortId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getBugo(shortId: string): Promise<BugoView | null> {
  const supabase = await createServerSupabase();

  const { data: bugo, error } = await supabase
    .from("bugo")
    .select("*")
    .eq("short_id", shortId)
    .eq("status", "active")
    .single();

  if (error || !bugo) return null;

  const { data: mourners } = await supabase
    .from("mourner")
    .select("id, relation, name, is_main, phone")
    .eq("bugo_id", bugo.id)
    .order("sort_order");

  const { data: accounts } = await supabase
    .from("bugo_account")
    .select("id, bank_name, account_no, holder_name")
    .eq("bugo_id", bugo.id)
    .order("sort_order");

  const { pin_hash: _, ...bugoData } = bugo;

  return {
    ...bugoData,
    mourners: mourners || [],
    accounts: accounts || [],
  } as BugoView;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortId } = await params;
  const bugo = await getBugo(shortId);

  if (!bugo) {
    return { title: `부고 | ${SITE_NAME}` };
  }

  const mainMourner = bugo.mourners.find((m) => m.is_main);
  const title = `故 ${bugo.deceased_name} 부고`;
  const description = mainMourner
    ? `${mainMourner.relation} ${mainMourner.name} | ${bugo.hall_name}`
    : bugo.hall_name;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/bugo/${shortId}`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}

export default async function BugoPage({ params, searchParams }: Props) {
  const { shortId } = await params;
  const sp = await searchParams;
  const bugo = await getBugo(shortId);

  if (!bugo) {
    notFound();
  }

  // 조회수 증가 (fire-and-forget)
  const supabase = await createServerSupabase();
  supabase.rpc("increment_view_count", { bugo_short_id: shortId });

  return (
    <div className="py-8 sm:py-12 px-4">
      <BugoViewer bugo={bugo} isNew={sp.created === "true"} />
    </div>
  );
}
