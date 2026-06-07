"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink } from "lucide-react";

interface BugoResult {
  short_id: string;
  deceased_name: string;
  hall_name: string;
  created_at: string;
}

export default function BugoManage() {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<BugoResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneDigits = phone.replace(/-/g, "");
  const isValidPhone = /^01[016789]\d{7,8}$/.test(phoneDigits);

  const handleSearch = async () => {
    if (!isValidPhone || isSearching) return;
    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch("/api/bugo/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneDigits }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "검색에 실패했습니다.");
        return;
      }

      setResults(data.results);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            대표 상주 전화번호
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ""))}
              placeholder="010-0000-0000"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-3 border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
            <button
              onClick={handleSearch}
              disabled={!isValidPhone || isSearching}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isValidPhone && !isSearching
                  ? "bg-navy text-white hover:bg-navy-light"
                  : "bg-border text-text-secondary cursor-not-allowed"
              }`}
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-error/30 rounded-lg p-3 text-sm text-error">
            {error}
          </div>
        )}

        {results !== null && (
          <div>
            {results.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                <p className="text-sm">해당 전화번호로 등록된 부고장이 없습니다.</p>
                <Link
                  href="/bugo/create"
                  className="inline-block mt-4 text-sm text-navy font-medium underline"
                >
                  새 부고장 만들기
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">
                  {results.length}건의 부고장을 찾았습니다.
                </p>
                {results.map((bugo) => (
                  <Link
                    key={bugo.short_id}
                    href={`/bugo/${bugo.short_id}`}
                    className="block bg-cream-dark rounded-lg p-4 hover:bg-cream transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-navy text-sm">
                          故 {bugo.deceased_name}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {bugo.hall_name} · {formatDate(bugo.created_at)}
                        </p>
                      </div>
                      <ExternalLink size={16} className="text-text-secondary" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-text-secondary mt-6">
        부고장 수정 시 생성할 때 설정한 비밀번호가 필요합니다.
      </p>
    </div>
  );
}
