export const SITE_NAME = "임종닷컴";
export const SITE_URL = "https://imjong.com";
export const SITE_DESCRIPTION = "장례 정보의 모든 것. 당황하지 마세요, 하나씩 안내해 드립니다.";
export const SITE_TAGLINE = "당황하지 마세요, 하나씩 안내해 드립니다.";

export const REGIONS = [
  { value: "seoul", label: "서울" },
  { value: "gyeonggi", label: "경기" },
  { value: "busan", label: "부산" },
  { value: "daegu", label: "대구" },
  { value: "incheon", label: "인천" },
  { value: "gwangju", label: "광주" },
  { value: "daejeon", label: "대전" },
  { value: "ulsan", label: "울산" },
  { value: "sejong", label: "세종" },
  { value: "gangwon", label: "강원" },
  { value: "chungbuk", label: "충북" },
  { value: "chungnam", label: "충남" },
  { value: "jeonbuk", label: "전북" },
  { value: "jeonnam", label: "전남" },
  { value: "gyeongbuk", label: "경북" },
  { value: "gyeongnam", label: "경남" },
  { value: "jeju", label: "제주" },
] as const;

export const FUNERAL_TYPES = [
  { value: "standard-3day", label: "일반 3일장" },
  { value: "family", label: "가족장 (소규모)" },
  { value: "cremation-direct", label: "직장 (화장 후 바로)" },
] as const;

export const GUEST_RANGES = [
  { value: 50, label: "50명 이하" },
  { value: 100, label: "약 100명" },
  { value: 150, label: "약 150명" },
  { value: 200, label: "약 200명" },
  { value: 300, label: "약 300명" },
  { value: 500, label: "300명 이상" },
] as const;
