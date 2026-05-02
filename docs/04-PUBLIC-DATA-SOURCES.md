# 공공데이터 소스 및 데이터 동기화 가이드

> 장례식장, 화장시설, 봉안시설, 자연장지, 묘지 데이터를 공공데이터포털(data.go.kr)에서 가져오는 방법을 정리한 문서입니다.

## 1. 사용 가능한 API 목록

### 1-1. 전국 장례식장 현황 (핵심)

- **제공기관**: 보건복지부
- **포털 URL**: https://www.data.go.kr/data/15122367/openapi.do
- **엔드포인트**: `https://apis.data.go.kr/1352000/ODMS_DATA_04_1/callData04_1Api`
- **데이터 필드 (18개)**:
  | 필드명 | 설명 | 비고 |
  |--------|------|------|
  | `ctpv` | 시도 | 지역 필터에 사용 |
  | `sigungu` | 시군구 | |
  | `fcltNm` | 시설명 | |
  | `addr` | 주소 | |
  | `telno` | 전화번호 | |
  | `fxno` | 팩스번호 | |
  | `homepageUrl` | 홈페이지 | |
  | `tpkct` | 주차대수 | |
  | `gubun` | 공/사설 | → type 매핑 |
  | `mtaCnt` | 빈소수 | → rooms |
  | `ehrCnt` | 안치가능구수 | |
  | `diningFclt` | 식당 | → features |
  | `store` | 매점 | → features |
  | `pklt` | 주차장 | → features |
  | `bereavedWaitRm` | 유족대기실 | → features |
  | `sdblsPfFclt` | 장애인편의시설 | → features |
  | `operType` | 운영종류 | hospital/public/private 매핑 |
- **업데이트 주기**: 연 1회 (최근 업데이트: 2026-04-09)

### 1-2. 전국 화장시설 현황

- **포털 URL**: https://www.data.go.kr/data/15122369/openapi.do
- **엔드포인트**: `https://apis.data.go.kr/1352000/ODMS_DATA_05_1/callData05_1Api`
- **추가 필드**: `brzCnt` (화장로 수)
- **CSV 다운로드**: https://www.data.go.kr/data/15143493/fileData.do (~62건)

### 1-3. 전국 봉안시설 현황

- **포털 URL**: https://www.data.go.kr/data/15122365/openapi.do
- **엔드포인트**: `https://apis.data.go.kr/1352000/ODMS_DATA_07_1/callData07_1Api`
- **추가 필드**: `frstShrYr` (최초안치기간), `etsPsstYr` (연장가능기간), `etsPsstCnt` (연장가능횟수)
- **CSV 다운로드**: https://www.data.go.kr/data/15143497/fileData.do

### 1-4. 전국 자연장지 현황

- **포털 URL**: https://www.data.go.kr/data/15122366/openapi.do
- **엔드포인트**: `https://apis.data.go.kr/1352000/ODMS_DATA_03_1/callData03_1Api`
- **CSV 다운로드**: https://www.data.go.kr/data/15143492/fileData.do (~219건)

### 1-5. 전국 묘지 현황

- **포털 URL**: https://www.data.go.kr/data/15122364/openapi.do
- **엔드포인트**: `https://apis.data.go.kr/1352000/ODMS_DATA_01_1/callData01_1Api`
- **추가 필드**: `prmsnArea` (허가면적), `cmtArea` (묘역면적), `totalBurial` (총매장능력)

---

## 2. 접근 방법

### API 키 발급

1. https://www.data.go.kr 에서 회원가입
2. 각 API 페이지에서 "활용신청" 클릭
3. 개발용 키는 즉시 발급 (운영용은 활용사례 등록 후 확장 가능)

### 요청 방식

```
GET https://apis.data.go.kr/1352000/ODMS_DATA_04_1/callData04_1Api
  ?serviceKey={API_KEY}
  &pageNo=1
  &numOfRows=100
  &apiType=JSON
  &ctpv=서울    # (선택) 시도 필터
```

### 제한사항

| 항목 | 내용 |
|------|------|
| 비용 | 무료 |
| 인증 | serviceKey (쿼리파라미터) |
| 일 호출 제한 | 10,000회 (개발), 확장 가능 (운영) |
| 응답 형식 | XML (기본), JSON (apiType=JSON) |

---

## 3. 가격 정보 (별도 관리 필요)

**공공 API에 가격 정보는 포함되어 있지 않습니다.**

### 가격 데이터 출처

| 출처 | 형태 | URL | 비고 |
|------|------|-----|------|
| 한국장례문화진흥원 가격정보 | CSV 파일 다운로드 | https://www.data.go.kr/data/15021763/fileData.do | 마지막 업데이트 2023-06, 오래됨 |
| e하늘 장사정보시스템 | 웹 포털 | https://www.15774129.go.kr | 실시간 가격, API 없음 |

> 장례식장은 법적으로 가격표 공개 의무가 있으며, e하늘 시스템에 가격을 등록해야 합니다.
> 그러나 공식 API가 없으므로, 가격 데이터는 수동 관리하거나 별도 수집 방법이 필요합니다.

---

## 4. 데이터 매핑 (API → FuneralHall 타입)

현재 `src/data/funeral-halls/index.ts`의 `FuneralHall` 인터페이스에 매핑:

```typescript
// API 응답 → FuneralHall 매핑
{
  id: `${ctpv}-${index}`,           // 자동 생성
  name: fcltNm,                      // 시설명
  region: ctpv,                      // 시도
  district: sigungu,                 // 시군구
  type: mapGubun(gubun, operType),   // 공/사설 → hospital|public|private
  address: addr,                     // 주소
  phone: telno,                      // 전화번호
  rooms: parseInt(mtaCnt),           // 빈소수
  naverMapUrl: generateNaverMapUrl(fcltNm, addr),  // 네이버맵 검색 URL 생성
  priceRange: undefined,             // API에 없음 → 수동 관리
  features: buildFeatures({          // 시설정보 조합
    diningFclt, store, pklt,
    bereavedWaitRm, sdblsPfFclt, tpkct
  }),
}
```

### type 매핑 규칙

```typescript
function mapGubun(gubun: string, operType: string): "hospital" | "public" | "private" {
  if (gubun === "공설") return "public";
  if (operType?.includes("병원")) return "hospital";
  return "private";
}
```

### 네이버맵 URL 생성

```typescript
// 시설명 + 주소로 네이버맵 검색 링크 생성
function generateNaverMapUrl(name: string, address: string): string {
  const query = encodeURIComponent(`${name} ${address}`);
  return `https://map.naver.com/v5/search/${query}`;
}
```

---

## 5. 동기화 전략

### 권장 방식: 빌드타임 스크립트

공공 데이터는 연 1회 업데이트이므로, 실시간 API 호출보다 **주기적 스크립트**가 적합합니다.

```
scripts/sync-public-data.ts
  → API 호출 → 데이터 정제 → src/data/funeral-halls/index.ts 업데이트
  → 가격 정보는 기존 수동 데이터와 병합 (API 데이터로 덮어쓰지 않음)
```

### 실행 주기

- **장례식장/화장시설/봉안시설**: 월 1회 (공공 데이터 연 1회 업데이트이므로 충분)
- **가격 정보**: 분기 1회 수동 확인 (e하늘 시스템 참고)

### 데이터 병합 규칙

1. API에서 새 시설이 추가되면 → 자동 추가 (가격은 빈 값)
2. API에서 기존 시설 정보가 변경되면 → 주소, 전화, 빈소수 등 업데이트
3. 수동으로 입력한 가격 정보 → 보존 (API 데이터로 덮어쓰지 않음)
4. API에서 사라진 시설 → 삭제하지 않고 플래그 처리 (확인 후 수동 삭제)

---

## 6. 추가 참고 자료

- **e하늘 장사정보시스템**: https://www.15774129.go.kr
  - 장례식장 가격표, 화장시설 예약 현황, 장사시설 검색
- **소비자상담센터**: 1372 (장례 비용 관련 상담)
- **한국장례문화진흥원**: 02-6930-9334
- **공공데이터 제공신청**: data.go.kr에서 추가 데이터(가격 API 등) 요청 가능
