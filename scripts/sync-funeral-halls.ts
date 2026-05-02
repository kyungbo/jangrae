/**
 * 공공데이터포털 장례식장 데이터 동기화 스크립트
 *
 * 사용법:
 *   1. .env.local에 DATA_GO_KR_API_KEY=인코딩된_서비스키 추가
 *   2. npx tsx scripts/sync-funeral-halls.ts
 *
 * 동작:
 *   - 보건복지부 전국 장례식장 API를 호출하여 전체 데이터를 가져옴
 *   - 기존 funeral-halls/index.ts의 수동 입력 가격(priceRange)은 보존
 *   - 결과를 src/data/funeral-halls/generated.ts에 저장
 *   - 주기적으로 실행하여 최신 데이터 유지 (월 1회 권장)
 */

import * as fs from "fs";
import * as path from "path";

const API_BASE =
  "https://apis.data.go.kr/1352000/ODMS_DATA_04_1/callData04_1Api";
const API_KEY = process.env.DATA_GO_KR_API_KEY;

if (!API_KEY) {
  console.error(
    "❌ DATA_GO_KR_API_KEY 환경변수가 설정되지 않았습니다.\n" +
      "   .env.local에 DATA_GO_KR_API_KEY=인코딩된_서비스키 를 추가하세요.\n" +
      "   API 키 발급: https://www.data.go.kr/data/15122367/openapi.do"
  );
  process.exit(1);
}

// ── 타입 정의 ──

interface ApiResponse {
  resultCode: string;
  resultMsg: string;
  items: ApiItem[];
  totalCount: number;
  pageNo: string;
  numOfRows: string;
}

interface ApiItem {
  ctpv: string; // 시도
  sigungu: string; // 시군구
  fcltNm: string; // 시설명
  addr: string; // 주소
  telno: string; // 전화번호
  fxno?: string; // 팩스번호
  homepageUrl?: string; // 홈페이지
  tpkct?: string; // 주차대수
  gubun: string; // 공/사설
  mtaCnt?: string; // 빈소수
  ehrCnt?: string; // 안치가능구수
  diningFclt?: string; // 식당
  store?: string; // 매점
  pklt?: string; // 주차장
  bereavedWaitRm?: string; // 유족대기실
  sdblsPfFclt?: string; // 장애인편의시설
  operType?: string; // 운영종류
}

interface FuneralHallGenerated {
  id: string;
  name: string;
  region: string;
  district: string;
  type: "hospital" | "public" | "private";
  address: string;
  phone: string;
  rooms: number;
  naverMapUrl: string;
  features: string[];
  homepage?: string;
  parkingSpaces?: number;
  storageCapacity?: number;
}

// ── 매핑 함수 ──

function mapType(
  gubun: string,
  operType?: string
): "hospital" | "public" | "private" {
  if (gubun?.includes("공설") || gubun?.includes("공립")) return "public";
  if (
    operType?.includes("병원") ||
    operType?.includes("의료") ||
    gubun?.includes("병원")
  )
    return "hospital";
  return "private";
}

function buildFeatures(item: ApiItem): string[] {
  const features: string[] = [];
  if (item.pklt && item.pklt !== "없음" && item.pklt !== "N") {
    const spaces = parseInt(item.tpkct || "0");
    features.push(spaces > 100 ? "대형 주차장" : "주차장");
  }
  if (item.diningFclt && item.diningFclt !== "없음" && item.diningFclt !== "N")
    features.push("식당");
  if (item.store && item.store !== "없음" && item.store !== "N")
    features.push("매점");
  if (
    item.bereavedWaitRm &&
    item.bereavedWaitRm !== "없음" &&
    item.bereavedWaitRm !== "N"
  )
    features.push("유족대기실");
  if (
    item.sdblsPfFclt &&
    item.sdblsPfFclt !== "없음" &&
    item.sdblsPfFclt !== "N"
  )
    features.push("장애인편의시설");
  if (gubunIsPublic(item.gubun)) features.push("공설 시설");
  return features;
}

function gubunIsPublic(gubun: string): boolean {
  return gubun?.includes("공설") || gubun?.includes("공립") || false;
}

function generateNaverMapUrl(name: string, address: string): string {
  const query = encodeURIComponent(`${name} ${address}`);
  return `https://map.naver.com/v5/search/${query}`;
}

function normalizePhone(phone: string): string {
  return phone?.replace(/\s+/g, "").trim() || "";
}

function toId(region: string, index: number): string {
  const regionMap: Record<string, string> = {
    서울: "seoul",
    경기: "gyeonggi",
    인천: "incheon",
    부산: "busan",
    대구: "daegu",
    광주: "gwangju",
    대전: "daejeon",
    울산: "ulsan",
    세종: "sejong",
    강원: "gangwon",
    충북: "chungbuk",
    충남: "chungnam",
    전북: "jeonbuk",
    전남: "jeonnam",
    경북: "gyeongbuk",
    경남: "gyeongnam",
    제주: "jeju",
  };
  const prefix = regionMap[region] || region.toLowerCase();
  return `${prefix}-${index}`;
}

// ── API 호출 ──

async function fetchAllHalls(): Promise<ApiItem[]> {
  const allItems: ApiItem[] = [];
  let pageNo = 1;
  const numOfRows = 100;
  let totalCount = Infinity;

  while (allItems.length < totalCount) {
    const url = `${API_BASE}?serviceKey=${API_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&apiType=JSON`;
    console.log(`📡 페이지 ${pageNo} 요청 중...`);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API 오류: ${res.status} ${res.statusText}`);
    }

    const text = await res.text();

    // API가 XML 에러를 반환하는 경우 처리
    if (text.startsWith("<?xml") || text.startsWith("<")) {
      console.error("⚠️  API가 XML로 응답했습니다. 에러 메시지 확인:");
      console.error(text.substring(0, 500));
      throw new Error("API가 JSON 대신 XML을 반환했습니다. API 키를 확인하세요.");
    }

    const json: ApiResponse = JSON.parse(text);

    if (json.resultCode !== "00") {
      throw new Error(
        `API 에러: ${json.resultCode} - ${json.resultMsg}`
      );
    }

    const items = json.items || [];
    totalCount = json.totalCount || 0;
    allItems.push(...items);

    console.log(`   ✅ ${items.length}건 수신 (누적 ${allItems.length}/${totalCount})`);

    if (items.length < numOfRows) break;
    pageNo++;
  }

  return allItems;
}

// ── 변환 및 저장 ──

function transformItems(items: ApiItem[]): FuneralHallGenerated[] {
  const regionCounters: Record<string, number> = {};

  return items
    .filter((item) => item.fcltNm && item.addr)
    .map((item) => {
      const region = item.ctpv?.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, "").trim()
        || item.ctpv;

      // 지역명 정규화
      const regionNormalized = normalizeRegion(region);

      regionCounters[regionNormalized] =
        (regionCounters[regionNormalized] || 0) + 1;

      return {
        id: toId(regionNormalized, regionCounters[regionNormalized]),
        name: item.fcltNm.trim(),
        region: regionNormalized,
        district: item.sigungu?.trim() || "",
        type: mapType(item.gubun, item.operType),
        address: item.addr.trim(),
        phone: normalizePhone(item.telno),
        rooms: parseInt(item.mtaCnt || "0") || 0,
        naverMapUrl: generateNaverMapUrl(item.fcltNm.trim(), item.addr.trim()),
        features: buildFeatures(item),
        ...(item.homepageUrl && { homepage: item.homepageUrl }),
        ...(item.tpkct && { parkingSpaces: parseInt(item.tpkct) || undefined }),
        ...(item.ehrCnt && {
          storageCapacity: parseInt(item.ehrCnt) || undefined,
        }),
      };
    });
}

function normalizeRegion(raw: string): string {
  // API의 ctpv 값(예: "충청남도", "경상북도")을 regionList 값으로 매핑
  const map: Record<string, string> = {
    서울: "서울",
    경기: "경기",
    인천: "인천",
    부산: "부산",
    대구: "대구",
    광주: "광주",
    대전: "대전",
    울산: "울산",
    세종: "세종",
    강원: "강원",
    충청북: "충북",
    충북: "충북",
    충청남: "충남",
    충남: "충남",
    전라북: "전북",
    전북: "전북",
    전라남: "전남",
    전남: "전남",
    경상북: "경북",
    경북: "경북",
    경상남: "경남",
    경남: "경남",
    제주: "제주",
  };
  for (const [key, value] of Object.entries(map)) {
    if (raw.includes(key)) return value;
  }
  return raw;
}

function generateFileContent(halls: FuneralHallGenerated[]): string {
  const regionStats = halls.reduce(
    (acc, h) => {
      acc[h.region] = (acc[h.region] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statsComment = Object.entries(regionStats)
    .sort((a, b) => b[1] - a[1])
    .map(([r, c]) => `${r}: ${c}곳`)
    .join(", ");

  const today = new Date().toISOString().split("T")[0];

  return `/**
 * 공공데이터포털 자동 생성 파일
 * 생성일: ${today}
 * 출처: 보건복지부_전국 장례식장 현황 API
 * 총 ${halls.length}곳 (${statsComment})
 *
 * ⚠️ 이 파일을 직접 수정하지 마세요. scripts/sync-funeral-halls.ts로 재생성됩니다.
 * 가격 정보는 price-overrides.ts에서 별도 관리합니다.
 */

import type { FuneralHallGenerated } from "./types";

export const generatedHalls: FuneralHallGenerated[] = ${JSON.stringify(halls, null, 2)};
`;
}

// ── 메인 실행 ──

async function main() {
  console.log("🏥 전국 장례식장 데이터 동기화 시작\n");

  try {
    const items = await fetchAllHalls();
    console.log(`\n📋 총 ${items.length}건의 원본 데이터 수신`);

    const halls = transformItems(items);
    console.log(`✨ ${halls.length}건 변환 완료`);

    // 지역별 통계
    const stats: Record<string, number> = {};
    halls.forEach((h) => {
      stats[h.region] = (stats[h.region] || 0) + 1;
    });
    console.log("\n📊 지역별 현황:");
    Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([region, count]) => {
        console.log(`   ${region}: ${count}곳`);
      });

    // 파일 저장
    const outDir = path.resolve(__dirname, "../src/data/funeral-halls");
    const outPath = path.join(outDir, "generated.ts");

    fs.writeFileSync(outPath, generateFileContent(halls), "utf-8");
    console.log(`\n💾 저장 완료: ${outPath}`);

    // 타입 파일이 없으면 생성
    const typesPath = path.join(outDir, "types.ts");
    if (!fs.existsSync(typesPath)) {
      fs.writeFileSync(
        typesPath,
        `export interface FuneralHallGenerated {
  id: string;
  name: string;
  region: string;
  district: string;
  type: "hospital" | "public" | "private";
  address: string;
  phone: string;
  rooms: number;
  naverMapUrl: string;
  features: string[];
  homepage?: string;
  parkingSpaces?: number;
  storageCapacity?: number;
}
`,
        "utf-8"
      );
      console.log(`💾 타입 파일 생성: ${typesPath}`);
    }

    console.log("\n✅ 동기화 완료!");
    console.log(
      "   다음 단계: src/data/funeral-halls/index.ts에서 generated.ts 데이터를 활용하도록 업데이트"
    );
  } catch (err) {
    console.error("\n❌ 동기화 실패:", err);
    process.exit(1);
  }
}

main();
