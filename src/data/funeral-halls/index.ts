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

export const funeralHalls: FuneralHall[] = [
  // 서울
  {
    id: "seoul-1",
    name: "서울대학교병원 장례식장",
    region: "서울",
    district: "종로구",
    type: "hospital",
    address: "서울특별시 종로구 대학로 101",
    phone: "02-2072-0505",
    rooms: 12,
    naverMapUrl: "https://naver.me/xF1GRZYA",
    priceRange: { min: 50, max: 100 },
    features: ["대형 주차장", "장례 용품점", "식당"],
  },
  {
    id: "seoul-2",
    name: "삼성서울병원 장례식장",
    region: "서울",
    district: "강남구",
    type: "hospital",
    address: "서울특별시 강남구 일원로 81",
    phone: "02-3410-0101",
    rooms: 15,
    naverMapUrl: "https://naver.me/5Ry3X5Zq",
    priceRange: { min: 60, max: 120 },
    features: ["대형 주차장", "식당", "편의점"],
  },
  {
    id: "seoul-3",
    name: "서울특별시립 서울추모공원",
    region: "서울",
    district: "서초구",
    type: "public",
    address: "서울특별시 서초구 헌릉로 8",
    phone: "02-570-1234",
    rooms: 8,
    naverMapUrl: "https://naver.me/GlG8P8Dw",
    priceRange: { min: 30, max: 60 },
    features: ["공설 시설", "저렴한 이용료", "화장장 인접"],
  },
  {
    id: "seoul-4",
    name: "서울아산병원 장례식장",
    region: "서울",
    district: "송파구",
    type: "hospital",
    address: "서울특별시 송파구 올림픽로43길 88",
    phone: "02-3010-3500",
    rooms: 14,
    naverMapUrl: "https://naver.me/FxGxI1xE",
    priceRange: { min: 55, max: 110 },
    features: ["대형 주차장", "식당", "VIP빈소"],
  },
  {
    id: "seoul-5",
    name: "보라매병원 장례식장",
    region: "서울",
    district: "동작구",
    type: "hospital",
    address: "서울특별시 동작구 보라매로5길 20",
    phone: "02-870-2345",
    rooms: 6,
    naverMapUrl: "https://naver.me/5g91xeB0",
    priceRange: { min: 40, max: 80 },
    features: ["소규모 장례 적합", "접근성 좋음"],
  },
  // 경기
  {
    id: "gyeonggi-1",
    name: "분당서울대학교병원 장례식장",
    region: "경기",
    district: "성남시",
    type: "hospital",
    address: "경기도 성남시 분당구 구미로173번길 82",
    phone: "031-787-7114",
    rooms: 10,
    naverMapUrl: "https://naver.me/FJqGLhf3",
    priceRange: { min: 45, max: 90 },
    features: ["대형 주차장", "식당"],
  },
  {
    id: "gyeonggi-2",
    name: "아주대학교병원 장례식장",
    region: "경기",
    district: "수원시",
    type: "hospital",
    address: "경기도 수원시 영통구 월드컵로 164",
    phone: "031-219-5114",
    rooms: 8,
    naverMapUrl: "https://naver.me/GnGQYLhe",
    priceRange: { min: 40, max: 85 },
    features: ["주차장", "식당", "편의점"],
  },
  {
    id: "gyeonggi-3",
    name: "경기도립 의정부 추모의 집",
    region: "경기",
    district: "의정부시",
    type: "public",
    address: "경기도 의정부시 호원로 10",
    phone: "031-870-6600",
    rooms: 6,
    naverMapUrl: "https://naver.me/GRX5QDZK",
    priceRange: { min: 25, max: 50 },
    features: ["공설 시설", "저렴한 이용료"],
  },
  // 부산
  {
    id: "busan-1",
    name: "부산대학교병원 장례식장",
    region: "부산",
    district: "서구",
    type: "hospital",
    address: "부산광역시 서구 구덕로 179",
    phone: "051-240-7114",
    rooms: 10,
    naverMapUrl: "https://naver.me/5gQ9wU6L",
    priceRange: { min: 40, max: 80 },
    features: ["대형 주차장", "식당"],
  },
  {
    id: "busan-2",
    name: "부산시립 영락공원 장례식장",
    region: "부산",
    district: "금정구",
    type: "public",
    address: "부산광역시 금정구 체육공원로 49",
    phone: "051-580-3800",
    rooms: 8,
    naverMapUrl: "https://naver.me/FoH7kfwR",
    priceRange: { min: 25, max: 50 },
    features: ["공설 시설", "화장장 인접", "저렴한 이용료"],
  },
  // 대구
  {
    id: "daegu-1",
    name: "경북대학교병원 장례식장",
    region: "대구",
    district: "중구",
    type: "hospital",
    address: "대구광역시 중구 동덕로 130",
    phone: "053-200-5114",
    rooms: 8,
    naverMapUrl: "https://naver.me/xyJDGLjR",
    priceRange: { min: 35, max: 70 },
    features: ["대형 주차장", "식당"],
  },
  // 인천
  {
    id: "incheon-1",
    name: "인하대병원 장례식장",
    region: "인천",
    district: "중구",
    type: "hospital",
    address: "인천광역시 중구 인항로 27",
    phone: "032-890-2114",
    rooms: 7,
    naverMapUrl: "https://naver.me/xqGkNH39",
    priceRange: { min: 40, max: 80 },
    features: ["주차장", "식당"],
  },
  {
    id: "incheon-2",
    name: "인천시립 승학장례식장",
    region: "인천",
    district: "미추홀구",
    type: "public",
    address: "인천광역시 미추홀구 매소홀로 54",
    phone: "032-440-7700",
    rooms: 6,
    naverMapUrl: "https://naver.me/F6G6mH39",
    priceRange: { min: 25, max: 45 },
    features: ["공설 시설", "저렴한 이용료"],
  },
  // 광주
  {
    id: "gwangju-1",
    name: "전남대학교병원 장례식장",
    region: "광주",
    district: "동구",
    type: "hospital",
    address: "광주광역시 동구 제봉로 42",
    phone: "062-220-5114",
    rooms: 8,
    naverMapUrl: "https://naver.me/xqJ9GLYZ",
    priceRange: { min: 35, max: 65 },
    features: ["주차장", "식당"],
  },
  // 대전
  {
    id: "daejeon-1",
    name: "충남대학교병원 장례식장",
    region: "대전",
    district: "중구",
    type: "hospital",
    address: "대전광역시 중구 문화로 282",
    phone: "042-280-7114",
    rooms: 8,
    naverMapUrl: "https://naver.me/GkQ5LhT1",
    priceRange: { min: 35, max: 70 },
    features: ["대형 주차장", "식당"],
  },
  {
    id: "daejeon-2",
    name: "대전시립장례식장",
    region: "대전",
    district: "유성구",
    type: "public",
    address: "대전광역시 유성구 도안대로 389",
    phone: "042-611-3800",
    rooms: 10,
    naverMapUrl: "https://naver.me/xkGLzh55",
    priceRange: { min: 25, max: 50 },
    features: ["공설 시설", "대규모 시설", "저렴한 이용료"],
  },
];

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
