"use client";

import { useState, useMemo } from "react";
import { funeralHalls, hallTypeLabels, regionList, type FuneralHall } from "@/data/funeral-halls";
import { MapPin, Phone, ExternalLink, SlidersHorizontal, ChevronDown } from "lucide-react";

type SortKey = "name" | "price-low" | "price-high" | "rooms";
type HallType = "all" | "hospital" | "public" | "private";

export default function FuneralHallList() {
  const [selectedRegion, setSelectedRegion] = useState<string>("서울");
  const [hallType, setHallType] = useState<HallType>("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = funeralHalls.filter((h) => h.region === selectedRegion);
    if (hallType !== "all") {
      result = result.filter((h) => h.type === hallType);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.priceRange?.min ?? 999) - (b.priceRange?.min ?? 999);
        case "price-high":
          return (b.priceRange?.max ?? 0) - (a.priceRange?.max ?? 0);
        case "rooms":
          return b.rooms - a.rooms;
        default:
          return a.name.localeCompare(b.name, "ko");
      }
    });
    return result;
  }, [selectedRegion, hallType, sortBy]);

  const regionsWithData = regionList.filter((r) =>
    funeralHalls.some((h) => h.region === r)
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* 지역 선택 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-navy mb-3">지역 선택</h2>
        <div className="flex flex-wrap gap-2">
          {regionList.map((r) => {
            const count = funeralHalls.filter((h) => h.region === r).length;
            return (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                disabled={count === 0}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  r === selectedRegion
                    ? "bg-navy text-white"
                    : count > 0
                      ? "bg-white border border-border text-text-secondary hover:border-navy-light"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                {r}
                {count > 0 && (
                  <span className="text-xs ml-1 opacity-60">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 필터/정렬 */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-navy font-medium"
        >
          <SlidersHorizontal size={16} />
          필터 및 정렬
          <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {showFilters && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream-dark rounded-xl p-4">
            <div>
              <label className="text-xs font-medium text-navy block mb-2">시설 유형</label>
              <div className="flex flex-wrap gap-2">
                {(["all", "hospital", "public", "private"] as HallType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setHallType(t)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      hallType === t
                        ? "bg-navy text-white"
                        : "bg-white border border-border text-text-secondary"
                    }`}
                  >
                    {t === "all" ? "전체" : hallTypeLabels[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-navy block mb-2">정렬</label>
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "name" as SortKey, label: "이름순" },
                  { key: "price-low" as SortKey, label: "가격 낮은순" },
                  { key: "price-high" as SortKey, label: "가격 높은순" },
                  { key: "rooms" as SortKey, label: "빈소 많은순" },
                ]).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      sortBy === s.key
                        ? "bg-navy text-white"
                        : "bg-white border border-border text-text-secondary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 결과 */}
      <div className="mb-4 text-sm text-text-secondary">
        {selectedRegion} 지역 <span className="font-medium text-navy">{filtered.length}곳</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p className="mb-2">해당 지역에 등록된 장례식장이 없습니다.</p>
          <p className="text-xs">장례식장 정보를 지속적으로 추가하고 있습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      )}

      {/* 안내 */}
      <div className="mt-8 bg-blue-50 rounded-xl p-5 text-sm">
        <p className="font-semibold text-navy mb-2">안내</p>
        <p className="text-navy/70 leading-relaxed">
          표시된 비용은 1일 기준 예상 빈소 임대료이며, 음식·상조 비용은 포함되지 않았습니다.
          정확한 비용은 각 장례식장에 직접 문의해 주세요. 장례식장의 가격표 공개는 법적 의무사항입니다.
        </p>
      </div>
    </div>
  );
}

function HallCard({ hall }: { hall: FuneralHall }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-navy">{hall.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
              hall.type === "public"
                ? "bg-green-50 text-success"
                : hall.type === "hospital"
                  ? "bg-blue-50 text-navy"
                  : "bg-amber-50 text-accent"
            }`}>
              {hallTypeLabels[hall.type]}
            </span>
          </div>
          <p className="text-sm text-text-secondary flex items-center gap-1 mb-2">
            <MapPin size={14} className="shrink-0" />
            {hall.address}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {hall.features.map((f) => (
              <span key={f} className="text-xs bg-cream-dark px-2 py-0.5 rounded text-text-secondary">
                {f}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>빈소 {hall.rooms}실</span>
            {hall.priceRange && (
              <span className="font-medium text-navy">
                {hall.priceRange.min}~{hall.priceRange.max}만 원/일
              </span>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <a
            href={`tel:${hall.phone}`}
            className="inline-flex items-center justify-center gap-1.5 bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors"
          >
            <Phone size={14} />
            전화
          </a>
          <a
            href={hall.naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-white text-navy border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-cream-dark transition-colors"
          >
            <ExternalLink size={14} />
            네이버맵
          </a>
        </div>
      </div>
    </div>
  );
}
