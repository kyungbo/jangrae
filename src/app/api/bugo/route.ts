import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createShortId, hashPin } from "@/lib/bugo/helpers";
import type { BugoCreateRequest } from "@/lib/bugo/types";

/**
 * POST /api/bugo — 부고 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body: BugoCreateRequest = await request.json();

    // 필수 필드 검증
    if (!body.deceased_name?.trim()) {
      return NextResponse.json(
        { error: "고인 성함을 입력해 주세요." },
        { status: 400 }
      );
    }
    if (!body.hall_name?.trim()) {
      return NextResponse.json(
        { error: "장례식장을 선택해 주세요." },
        { status: 400 }
      );
    }
    if (!body.funeral_at) {
      return NextResponse.json(
        { error: "발인 일시를 입력해 주세요." },
        { status: 400 }
      );
    }
    if (!body.pin || body.pin.length !== 4 || !/^\d{4}$/.test(body.pin)) {
      return NextResponse.json(
        { error: "수정용 비밀번호 4자리를 입력해 주세요." },
        { status: 400 }
      );
    }
    if (!body.mourners?.length) {
      return NextResponse.json(
        { error: "상주 정보를 1명 이상 입력해 주세요." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const shortId = createShortId();
    const pinHash = await hashPin(body.pin);

    // 부고 생성
    const { data: bugo, error: bugoError } = await supabase
      .from("bugo")
      .insert({
        short_id: shortId,
        pin_hash: pinHash,
        deceased_name: body.deceased_name.trim(),
        deceased_age: body.deceased_age || null,
        deceased_gender: body.deceased_gender || null,
        deceased_photo_url: body.deceased_photo_url || null,
        hall_id: body.hall_id || null,
        hall_name: body.hall_name.trim(),
        hall_address: body.hall_address || null,
        hall_phone: body.hall_phone || null,
        hall_room: body.hall_room || null,
        encoffin_at: body.encoffin_at || null,
        funeral_at: body.funeral_at,
        burial_place: body.burial_place || null,
      })
      .select("id")
      .single();

    if (bugoError) {
      console.error("부고 생성 실패:", bugoError);
      return NextResponse.json(
        { error: "부고 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    // 상주 등록
    const mourners = body.mourners.map((m, i) => ({
      bugo_id: bugo.id,
      relation: m.relation,
      name: m.name,
      is_main: m.is_main ?? i === 0,
      phone: m.phone || null,
      sort_order: i,
    }));

    const { error: mournerError } = await supabase
      .from("mourner")
      .insert(mourners);

    if (mournerError) {
      console.error("상주 등록 실패:", mournerError);
    }

    // 계좌 등록
    if (body.accounts?.length) {
      const accounts = body.accounts.map((a, i) => ({
        bugo_id: bugo.id,
        bank_name: a.bank_name,
        account_no: a.account_no,
        holder_name: a.holder_name,
        sort_order: i,
      }));

      const { error: accountError } = await supabase
        .from("bugo_account")
        .insert(accounts);

      if (accountError) {
        console.error("계좌 등록 실패:", accountError);
      }
    }

    return NextResponse.json(
      { short_id: shortId, id: bugo.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("부고 생성 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
