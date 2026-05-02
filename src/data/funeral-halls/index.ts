import { generatedHalls } from "./generated";
import type { FuneralHallGenerated } from "./types";

export interface FuneralHall {
  id: string;
  name: string;
  region: string;
  district: string;
  type: "hospital" | "public" | "private";
  address: string;
  phone: string;
  rooms: number;
  naverMapUrl: string;
  priceRange?: { min: number; max: number };
  features: string[];
}

export const hallTypeLabels: Record<string, string> = {
  hospital: "병원 장례식장",
  public: "공설 장례식장",
  private: "전문 장례식장",
};

export const regionList = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

/**
 * 수동 관리 가격 정보
 * API에서 가격이 제공되지 않으므로, 확인된 장례식장의 가격만 여기에 추가합니다.
 * key: 시설명(fcltNm)과 매칭
 */
const priceOverrides: Record<string, { min: number; max: number }> = {
  "서울대학교병원장례식장": { min: 50, max: 100 },
  "삼성서울병원장례식장": { min: 60, max: 120 },
  "서울특별시립승화원": { min: 30, max: 60 },
  "서울아산병원장례식장": { min: 55, max: 110 },
  "보라매병원장례식장": { min: 40, max: 80 },
  "분당서울대학교병원장례식장": { min: 45, max: 90 },
  "아주대학교병원장례식장": { min: 40, max: 85 },
  "부산대학교병원장례식장": { min: 40, max: 80 },
  "경북대학교병원장례식장": { min: 35, max: 70 },
  "인하대병원장례식장": { min: 40, max: 80 },
  "전남대학교병원장례식장": { min: 35, max: 65 },
  "충남대학교병원장례식장": { min: 35, max: 70 },
};

function toPriceKey(name: string): string {
  return name.replace(/\s+/g, "");
}

/**
 * 공공 API 데이터 + 수동 가격 정보를 병합하여 최종 데이터 생성
 */
export const funeralHalls: FuneralHall[] = generatedHalls.map(
  (h: FuneralHallGenerated) => ({
    id: h.id,
    name: h.name,
    region: h.region,
    district: h.district,
    type: h.type,
    address: h.address,
    phone: h.phone,
    rooms: h.rooms,
    naverMapUrl: h.naverMapUrl,
    priceRange: priceOverrides[toPriceKey(h.name)],
    features: h.features,
  })
);

export function getHallsByRegion(region: string): FuneralHall[] {
  return funeralHalls.filter((h) => h.region === region);
}

export function getRegionsWithCount(): { region: string; count: number }[] {
  const counts = new Map<string, number>();
  funeralHalls.forEach((h) => {
    counts.set(h.region, (counts.get(h.region) || 0) + 1);
  });
  return regionList.map((r) => ({ region: r, count: counts.get(r) || 0 }));
}
