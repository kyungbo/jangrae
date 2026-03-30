# 처음장례 — 기술 문서 (Technical)

> 최종 업데이트: 2026-03-31

---

## 1. 기술 스택

| 레이어 | 기술 | 버전 |
|--------|------|------|
| 프레임워크 | Next.js (App Router) | 16.2.1 |
| 언어 | TypeScript (strict mode) | ^5 |
| UI | React | 19.2.4 |
| 스타일 | Tailwind CSS | v4 |
| 상태관리 | Zustand | ^5.0.12 |
| 아이콘 | Lucide React | ^1.7.0 |
| 분석 | Google Analytics 4 | G-CF23HME4WS |
| 배포 | Vercel | - |
| 노드 | Node.js | >=20 |

### 의도적으로 사용하지 않은 것

- **DB**: MVP는 모든 데이터가 정적 TypeScript 파일. 서버/DB 비용 없음
- **CMS**: 콘텐츠를 코드로 관리 (guides/index.ts). 추후 MDX 또는 Headless CMS 전환 가능
- **인증 라이브러리**: 아직 미설치. 로그인 필요 시점에 NextAuth v5 도입 예정
- **UI 컴포넌트 라이브러리**: Tailwind 직접 사용. shadcn/ui 도입 검토 가능

---

## 2. 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx          # 루트 레이아웃 (Header, Footer, GA)
│   ├── page.tsx            # 홈페이지
│   ├── globals.css         # 디자인 시스템 CSS 변수 + Tailwind
│   ├── checklist/          # 체크리스트 (상황 선택 → 단계별 가이드)
│   ├── calculator/         # 비용 계산기
│   ├── guide/              # 가이드 기사
│   ├── experts/            # 전문가 디렉토리
│   ├── sitemap.ts          # 동적 사이트맵
│   └── robots.ts           # robots.txt
│
├── components/             # 재사용 컴포넌트
│   ├── analytics/          # GA4 통합
│   ├── calculator/         # 계산기 단계별 폼
│   ├── checklist/          # 체크리스트 인터랙션
│   ├── landing/            # 랜딩 페이지 섹션
│   ├── layout/             # Header, Footer
│   └── seo/                # JSON-LD 구조화 데이터
│
├── data/                   # 정적 데이터 (DB 대체)
│   ├── checklists/         # 상황별 체크리스트 데이터
│   ├── guides/             # 가이드 기사 콘텐츠
│   └── experts/            # 목업 전문가 데이터
│
├── hooks/                  # Zustand 스토어
│   ├── useCalculator.ts
│   └── useChecklist.ts
│
└── lib/                    # 유틸리티, 타입, 상수
    ├── analytics.ts        # GA4 이벤트 헬퍼
    ├── constants.ts        # 사이트 상수
    ├── metadata.ts         # SEO 메타데이터 생성 헬퍼
    ├── types.ts            # 공유 타입 정의
    └── calculator/         # 비용 계산 로직
```

---

## 3. 빠른 시작

```bash
# 클론
git clone https://github.com/kyungbo/jangrae.git
cd jangrae

# 의존성 설치 (Node 20 이상 필요)
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local에 NEXT_PUBLIC_GA_MEASUREMENT_ID=G-CF23HME4WS 입력

# 개발 서버
npm run dev        # http://localhost:3000

# 프로덕션 빌드
npm run build
npm start
```

---

## 4. 라우트 맵

| 경로 | 렌더링 | 설명 |
|------|--------|------|
| `/` | Static | 랜딩 페이지 |
| `/checklist` | Static | 상황 선택 |
| `/checklist/[situation]` | SSG (3개) | 단계별 체크리스트 |
| `/calculator` | Static | 비용 계산기 |
| `/guide` | Static | 가이드 목록 |
| `/guide/[slug]` | SSG (4개) | 가이드 기사 상세 |
| `/experts` | Static | 전문가 디렉토리 |
| `/sitemap.xml` | Generated | 사이트맵 |
| `/robots.txt` | Generated | 크롤러 설정 |

- **SSG**: `generateStaticParams`로 빌드 시 정적 생성
- **전체 17개 페이지**, 서버 런타임 없음 (CDN에서 서빙 가능)

---

## 5. 핵심 데이터 구조

### 체크리스트 (ChecklistData)

```typescript
interface ChecklistData {
  situation: string;        // "hospital" | "home" | "accident"
  title: string;
  description: string;
  steps: ChecklistStep[];
}

interface ChecklistStep {
  id: number;
  title: string;
  description: string;
  tip?: string;             // 팁 (파란 박스)
  warning?: string;         // 경고 (빨간 박스)
  phone?: string;           // 전화 버튼
  phoneName?: string;
}
```

**파일 위치**: `src/data/checklists/hospital.ts`, `home.ts`, `accident.ts`

### 가이드 (GuideArticle)

```typescript
interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  tags: string[];
  sections: { heading: string; content: string; }[];
}
```

**파일 위치**: `src/data/guides/index.ts` (4개 기사 포함)

### 비용 계산기

```typescript
// 입력
interface CalculatorInputs {
  guestCount: number;   // 조문객 수
  region: string;       // 지역 코드
  funeralType: string;  // 장례 유형
  hasSangjo: boolean;   // 상조 가입 여부
}

// 출력
interface CostBreakdown {
  facilityRental: { min: number; max: number; label: string };
  food: { min: number; max: number; label: string };
  sangjo: { min: number; max: number; label: string };
  cremation: { min: number; max: number; label: string };
  misc: { min: number; max: number; label: string };
  total: { min: number; max: number };
}
```

**계산 로직**: `src/lib/calculator/calculate.ts`
**가격 데이터**: `src/lib/calculator/pricing-data.ts`

---

## 6. 데이터 수정 가이드

### 가이드 기사 추가

`src/data/guides/index.ts`의 `guides` 배열에 객체 추가:

```typescript
{
  slug: "funeral-etiquette",     // URL 경로용
  title: "조문 예절 완벽 가이드",
  description: "...",
  publishedAt: "2026-03-31",
  updatedAt: "2026-03-31",
  readingTime: 5,
  tags: ["예절", "조문"],
  sections: [
    { heading: "조문 시 복장", content: "..." },
    { heading: "조문 시 인사말", content: "..." },
  ],
}
```

추가 후 `npm run build`하면 자동으로 SSG 페이지와 사이트맵에 반영됨.

### 체크리스트 수정

`src/data/checklists/hospital.ts` 등에서 `steps` 배열 수정.

### 비용 데이터 수정

`src/lib/calculator/pricing-data.ts`에서 `baseCosts`, `regionMultiplier` 수정.

---

## 7. 상태관리 (Zustand)

두 개의 독립적인 클라이언트 스토어:

### useChecklist

```typescript
{
  currentStep: number;            // 현재 표시 중인 단계 인덱스
  completedSteps: Set<number>;    // 완료 체크한 단계 ID들
  // actions: completeStep, goNext, goPrev, reset
}
```

### useCalculator

```typescript
{
  step: number;        // 0~4 (입력 4단계 + 결과)
  guestCount: number;
  region: string;
  funeralType: string;
  hasSangjo: boolean;
  result: CostBreakdown | null;
  // actions: nextStep, prevStep, reset, set*
}
```

---

## 8. Analytics 이벤트 구조

### 페이지뷰 (자동)

SPA 라우트 변경 시 `GoogleAnalytics.tsx`에서 자동 전송.

### 커스텀 이벤트

| 이벤트명 | 파라미터 | 발생 시점 |
|----------|----------|----------|
| `checklist_step_complete` | situation, step_id, step_title | 체크리스트 단계 체크 |
| `checklist_complete` | situation | 체크리스트 전체 완료 |
| `calculator_step` | step, step_label | 계산기 단계 진행 |
| `calculator_result_view` | total_min, total_max | 계산 결과 확인 |
| `phone_click` | phone_number, context | 전화 버튼 클릭 |

**미연결 이벤트** (함수는 있으나 아직 컴포넌트에 연결 안 됨):
- `trackSituationSelect` — 상황 선택 카드 클릭 시
- `trackGuideView` — 가이드 기사 열람 시
- `trackExpertContact` — 전문가 문의 클릭 시

---

## 9. 배포

### Vercel 설정

| 항목 | 값 |
|------|-----|
| Framework | Next.js (자동 감지) |
| Build Command | `next build` |
| Node Version | 20 (.nvmrc) |
| 환경변수 | `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-CF23HME4WS` |

### 도메인

- 프로덕션: `jangrae.com`
- DNS: Vercel 네임서버 또는 A/CNAME 레코드 설정 필요

---

## 10. 향후 기술 과제

| 과제 | 설명 | 난이도 |
|------|------|--------|
| 인증 (NextAuth v5) | 카카오, 네이버, 전화번호 로그인 | 중 |
| 전문가 DB | Supabase 또는 PlanetScale + API 라우트 | 중 |
| MDX 콘텐츠 | 가이드를 MDX로 전환하여 비개발자도 편집 가능 | 하 |
| 이미지 최적화 | OG 이미지 자동 생성, 가이드 삽화 | 하 |
| 모니터링 | Sentry 에러 트래킹, Web Vitals | 하 |
| 성능 | 폰트 서브셋 (Pretendard local), ISR 전환 | 하 |

---

## 11. 알려진 이슈

1. **hospital.ts**의 상조 전화번호가 `1588-xxxx` (플레이스홀더)
2. **전문가 페이지** 문의 버튼 비활성화 상태 (백엔드 없음)
3. `trackGuideView`, `trackExpertContact` 이벤트가 컴포넌트에 미연결
4. `src/components/ui/` 디렉토리 비어있음 (공통 UI 컴포넌트 미추출)
