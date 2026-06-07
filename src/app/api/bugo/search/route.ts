import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * POST /api/bugo/search — 전화번호로 부고장 찾기
 */
export async function POST(request: NextRequest) {
  const { phone } = await request.json();

  if (!phone || !/^01[016789]\d{7,8}$/.test(phone.replace(/-/g, ""))) {
    return NextResponse.json(
      { error: "올바른 전화번호를 입력해 주세요." },
      { status: 400 }
    );
  }

  const phoneDigits = phone.replace(/-/g, "");
  const supabase = await createServerSupabase();

  // 대표 상주의 전화번호로 부고 검색
  const { data, error } = await supabase
    .from("mourner")
    .select("bugo_id, bugo:bugo_id(short_id, deceased_name, hall_name, created_at, status)")
    .eq("phone", phoneDigits)
    .eq("is_main", true);

  if (error) {
    console.error("부고 검색 실패:", error);
    return NextResponse.json(
      { error: "검색에 실패했습니다." },
      { status: 500 }
    );
  }

  const results = (data || [])
    .filter((row) => {
      const bugo = row.bugo as unknown as Record<string, unknown> | null;
      return bugo && bugo.status === "active";
    })
    .map((row) => {
      const bugo = row.bugo as unknown as Record<string, unknown>;
      return {
        short_id: bugo.short_id,
        deceased_name: bugo.deceased_name,
        hall_name: bugo.hall_name,
        created_at: bugo.created_at,
      };
    });

  return NextResponse.json({ results });
}
