import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { verifyPin } from "@/lib/bugo/helpers";

/**
 * GET /api/bugo/[shortId] — 부고 조회
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  const { shortId } = await params;
  const supabase = await createServerSupabase();

  // 부고 조회
  const { data: bugo, error } = await supabase
    .from("bugo")
    .select("*")
    .eq("short_id", shortId)
    .eq("status", "active")
    .single();

  if (error || !bugo) {
    return NextResponse.json(
      { error: "부고를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 조회수 증가 (비동기, 응답 차단하지 않음)
  supabase.rpc("increment_view_count", { bugo_short_id: shortId });

  // 상주 조회
  const { data: mourners } = await supabase
    .from("mourner")
    .select("id, relation, name, is_main, phone")
    .eq("bugo_id", bugo.id)
    .order("sort_order");

  // 계좌 조회
  const { data: accounts } = await supabase
    .from("bugo_account")
    .select("id, bank_name, account_no, holder_name")
    .eq("bugo_id", bugo.id)
    .order("sort_order");

  // pin_hash 제외하고 반환
  const { pin_hash: _, ...bugoData } = bugo;

  return NextResponse.json({
    ...bugoData,
    mourners: mourners || [],
    accounts: accounts || [],
  });
}

/**
 * PATCH /api/bugo/[shortId] — 부고 수정 (PIN 검증 필요)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  const { shortId } = await params;
  const body = await request.json();
  const { pin, ...updateData } = body;

  if (!pin) {
    return NextResponse.json(
      { error: "수정용 비밀번호를 입력해 주세요." },
      { status: 401 }
    );
  }

  const supabase = await createServerSupabase();

  // 기존 부고 조회 (PIN 검증용)
  const { data: bugo, error } = await supabase
    .from("bugo")
    .select("id, pin_hash")
    .eq("short_id", shortId)
    .eq("status", "active")
    .single();

  if (error || !bugo) {
    return NextResponse.json(
      { error: "부고를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // PIN 검증
  const pinValid = await verifyPin(pin, bugo.pin_hash);
  if (!pinValid) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다." },
      { status: 403 }
    );
  }

  // 부고 업데이트 (허용 필드만)
  const allowedFields = [
    "deceased_name", "deceased_age", "deceased_gender", "deceased_photo_url",
    "hall_id", "hall_name", "hall_address", "hall_phone", "hall_room",
    "encoffin_at", "funeral_at", "burial_place",
  ];
  const filtered: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updateData) {
      filtered[key] = updateData[key];
    }
  }

  if (Object.keys(filtered).length > 0) {
    const { error: updateError } = await supabase
      .from("bugo")
      .update(filtered)
      .eq("id", bugo.id);

    if (updateError) {
      console.error("부고 수정 실패:", updateError);
      return NextResponse.json(
        { error: "수정에 실패했습니다." },
        { status: 500 }
      );
    }
  }

  // 상주 업데이트 (전체 교체 방식)
  if (updateData.mourners) {
    await supabase.from("mourner").delete().eq("bugo_id", bugo.id);
    const mourners = updateData.mourners.map((m: { relation: string; name: string; is_main?: boolean; phone?: string }, i: number) => ({
      bugo_id: bugo.id,
      relation: m.relation,
      name: m.name,
      is_main: m.is_main ?? i === 0,
      phone: m.phone || null,
      sort_order: i,
    }));
    await supabase.from("mourner").insert(mourners);
  }

  // 계좌 업데이트 (전체 교체 방식)
  if (updateData.accounts) {
    await supabase.from("bugo_account").delete().eq("bugo_id", bugo.id);
    if (updateData.accounts.length > 0) {
      const accounts = updateData.accounts.map((a: { bank_name: string; account_no: string; holder_name: string }, i: number) => ({
        bugo_id: bugo.id,
        bank_name: a.bank_name,
        account_no: a.account_no,
        holder_name: a.holder_name,
        sort_order: i,
      }));
      await supabase.from("bugo_account").insert(accounts);
    }
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/bugo/[shortId] — 부고 삭제 (PIN 검증 필요)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  const { shortId } = await params;
  const { pin } = await request.json();

  if (!pin) {
    return NextResponse.json(
      { error: "수정용 비밀번호를 입력해 주세요." },
      { status: 401 }
    );
  }

  const supabase = await createServerSupabase();

  const { data: bugo, error } = await supabase
    .from("bugo")
    .select("id, pin_hash")
    .eq("short_id", shortId)
    .eq("status", "active")
    .single();

  if (error || !bugo) {
    return NextResponse.json(
      { error: "부고를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const pinValid = await verifyPin(pin, bugo.pin_hash);
  if (!pinValid) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다." },
      { status: 403 }
    );
  }

  // soft delete
  const { error: deleteError } = await supabase
    .from("bugo")
    .update({ status: "deleted" })
    .eq("id", bugo.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "삭제에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
