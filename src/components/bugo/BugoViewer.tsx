"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Copy,
  Check,
  Share2,
  CreditCard,
  Users,
  Building2,
} from "lucide-react";
import type { BugoView } from "@/lib/bugo/types";

interface BugoViewerProps {
  bugo: BugoView;
  isNew?: boolean;
}

export default function BugoViewer({ bugo, isNew }: BugoViewerProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showNewBanner, setShowNewBanner] = useState(isNew);

  useEffect(() => {
    if (showNewBanner) {
      const timer = setTimeout(() => setShowNewBanner(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showNewBanner]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${month}월 ${day}일 (${weekday}) ${ampm} ${h12}:${minutes}`;
  };

  const copyAccount = async (accountNo: string) => {
    try {
      await navigator.clipboard.writeText(accountNo);
      setCopiedAccount(accountNo);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = accountNo;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedAccount(accountNo);
      setTimeout(() => setCopiedAccount(null), 2000);
    }
  };

  const shareLink = async () => {
    const url = window.location.href.split("?")[0];
    const title = `故 ${bugo.deceased_name} 부고`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or not supported
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const mainMourner = bugo.mourners.find((m) => m.is_main);
  const otherMourners = bugo.mourners.filter((m) => !m.is_main);

  return (
    <div className="max-w-lg mx-auto">
      {/* 생성 완료 배너 */}
      {showNewBanner && (
        <div className="mb-6 space-y-3">
          <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-sm text-success">
            부고장이 생성되었습니다. 아래 공유 버튼으로 전달해 주세요.
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-navy space-y-1">
            <p className="font-semibold">부고장 관리 안내</p>
            <p className="text-text-secondary">
              나중에 수정이 필요하면{" "}
              <a href="/bugo/manage" className="text-navy underline font-medium">
                내 부고장 찾기
              </a>
              에서 대표 상주 전화번호와 비밀번호로 관리할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 부고 카드 */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {/* 헤더 */}
        <div className="bg-navy px-6 py-8 text-center">
          <p className="text-cream/70 text-xs tracking-widest mb-3">부 고</p>
          <h1 className="text-2xl font-bold text-white">
            故 {bugo.deceased_name}
          </h1>
          {bugo.deceased_age && (
            <p className="text-cream/80 text-sm mt-1">
              향년 {bugo.deceased_age}세
            </p>
          )}
        </div>

        {/* 상주 정보 */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-navy" />
            <h2 className="text-sm font-semibold text-navy">상주</h2>
          </div>
          <div className="space-y-1.5">
            {mainMourner && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-navy font-medium">
                  {mainMourner.relation} {mainMourner.name}
                </span>
                <span className="text-[10px] bg-navy/10 text-navy px-1.5 py-0.5 rounded">
                  대표
                </span>
              </div>
            )}
            {otherMourners.map((m) => (
              <p key={m.id} className="text-sm text-text-primary">
                {m.relation} {m.name}
              </p>
            ))}
          </div>
        </div>

        {/* 장례 정보 */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-navy" />
            <h2 className="text-sm font-semibold text-navy">장례 정보</h2>
          </div>

          <div className="space-y-4">
            {/* 장례식장 */}
            <div>
              <p className="font-medium text-navy">
                {bugo.hall_name}
                {bugo.hall_room && (
                  <span className="text-text-secondary font-normal"> {bugo.hall_room}</span>
                )}
              </p>
              {bugo.hall_address && (
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(bugo.hall_address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-navy mt-1"
                >
                  <MapPin size={14} />
                  <span className="underline">{bugo.hall_address}</span>
                </a>
              )}
              {bugo.hall_phone && (
                <a
                  href={`tel:${bugo.hall_phone}`}
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-navy mt-1"
                >
                  <Phone size={14} />
                  <span>{bugo.hall_phone}</span>
                </a>
              )}
            </div>

            {/* 일정 */}
            <div className="bg-cream-dark rounded-lg p-4 space-y-3">
              {bugo.encoffin_at && (
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-text-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-text-secondary">입관</p>
                    <p className="text-sm text-navy font-medium">
                      {formatDate(bugo.encoffin_at)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-navy mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary">발인</p>
                  <p className="text-sm text-navy font-semibold">
                    {formatDate(bugo.funeral_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* 장지 */}
            {bugo.burial_place && (
              <div>
                <p className="text-xs text-text-secondary">장지</p>
                <p className="text-sm text-navy">{bugo.burial_place}</p>
              </div>
            )}
          </div>
        </div>

        {/* 부의금 계좌 */}
        {bugo.accounts.length > 0 && (
          <div className="px-6 py-6 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-navy" />
              <h2 className="text-sm font-semibold text-navy">부의금 계좌</h2>
            </div>
            <div className="space-y-3">
              {bugo.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between bg-cream-dark rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">
                      {account.bank_name}
                    </p>
                    <p className="text-sm text-text-primary">
                      {account.account_no}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {account.holder_name}
                    </p>
                  </div>
                  <button
                    onClick={() => copyAccount(account.account_no)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-border text-navy hover:bg-navy hover:text-white transition-all"
                  >
                    {copiedAccount === account.account_no ? (
                      <>
                        <Check size={12} /> 복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> 복사
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 공유 버튼 */}
        <div className="px-6 py-6">
          <button
            onClick={shareLink}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-navy text-white font-medium text-sm hover:bg-navy-light transition-all"
          >
            {linkCopied ? (
              <>
                <Check size={16} /> 링크가 복사되었습니다
              </>
            ) : (
              <>
                <Share2 size={16} /> 부고장 공유하기
              </>
            )}
          </button>
        </div>
      </div>

      {/* 처음장례 브랜딩 */}
      <p className="text-center text-xs text-text-secondary mt-6">
        처음장례에서 만든 부고장입니다
      </p>
    </div>
  );
}
