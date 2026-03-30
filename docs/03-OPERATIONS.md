# 처음장례 — 운영 문서 (Operations)

> 최종 업데이트: 2026-03-31

---

## 1. 서비스 인프라 현황

| 항목 | 상태 | 계정/서비스 |
|------|------|------------|
| 도메인 | 구매 완료 | jangrae.com |
| 호스팅 | Vercel | 배포 설정 완료 |
| 코드 저장소 | GitHub | github.com/kyungbo/jangrae |
| 분석 | Google Analytics 4 | G-CF23HME4WS |
| DB | 없음 (정적 사이트) | — |
| 인증 | 미구현 | — |
| CDN | Vercel Edge Network | 자동 |
| SSL | Vercel 자동 발급 | 자동 |

---

## 2. 운영 비용

### 현재 (MVP)

| 항목 | 월 비용 | 비고 |
|------|---------|------|
| Vercel (Hobby) | $0 | 월 100GB 대역폭, 상업용 시 Pro $20/월 |
| 도메인 | ~$12/년 | 연간 비용 |
| Google Analytics | $0 | 무료 |
| **합계** | **~$1/월** | |

### 트래픽 증가 시

| 항목 | 예상 비용 | 시점 |
|------|----------|------|
| Vercel Pro | $20/월 | 상업적 사용 시작 시 |
| DB (Supabase Free) | $0 | 전문가 DB 구축 시 |
| DB (Supabase Pro) | $25/월 | MAU 5만+ 시 |
| Sentry | $0~$26/월 | 에러 모니터링 필요 시 |

---

## 3. 배포 프로세스

```
코드 수정 → git push → Vercel 자동 빌드 → 프로덕션 반영
```

- `main` 브랜치 push 시 Vercel이 자동으로 빌드 & 배포
- PR 생성 시 Preview 배포 자동 생성
- 빌드 실패 시 이전 버전 유지 (롤백 불필요)

### 환경변수

| 변수명 | 값 | 관리 위치 |
|--------|-----|----------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-CF23HME4WS` | Vercel → Settings → Environment Variables |

환경변수 추가/변경 후 **재배포** 필요 (Vercel 대시보드 → Deployments → Redeploy)

---

## 4. 콘텐츠 운영

### 가이드 기사 추가/수정 방법

1. `src/data/guides/index.ts` 파일 편집
2. `guides` 배열에 새 기사 객체 추가 또는 기존 기사 수정
3. `git push` → 자동 배포

### 체크리스트 수정

1. `src/data/checklists/` 해당 파일 편집
2. `steps` 배열에서 추가/수정/삭제
3. `git push` → 자동 배포

### 비용 데이터 업데이트

1. `src/lib/calculator/pricing-data.ts` 편집
2. `baseCosts` (기본 단가), `regionMultiplier` (지역 가중치) 수정
3. 단위: **만 원**

---

## 5. 데이터 수집 현황

### GA4 자동 수집 데이터

- 페이지뷰 (URL, 체류 시간, 이탈률)
- 사용자 속성 (기기, 브라우저, 지역, 언어)
- 세션 정보 (유입 채널, 검색어, 레퍼러)

### 커스텀 이벤트 (수동 설계)

| 이벤트 | 인사이트 |
|--------|---------|
| `checklist_step_complete` | 어떤 단계에서 이탈하는지 (퍼널 분석) |
| `checklist_complete` | 체크리스트 완주율 |
| `calculator_step` | 계산기 각 단계별 이탈률 |
| `calculator_result_view` | 계산기 완주율 + 평균 예상 비용대 |
| `phone_click` | 전화 상담 전환율 |

### GA4에서 퍼널 리포트 설정 방법

1. GA4 → Explore → Funnel exploration
2. 단계 설정:
   - Step 1: `page_view` (path = /checklist)
   - Step 2: `page_view` (path contains /checklist/)
   - Step 3: `checklist_step_complete`
   - Step 4: `checklist_complete`

---

## 6. SEO 운영

### 현재 SEO 자산

- sitemap.xml (자동 생성, 전 페이지 포함)
- robots.txt (전체 허용)
- 구조화 데이터: WebSite, HowTo, Article, FAQPage
- Open Graph + Twitter Card 전 페이지 적용
- `<html lang="ko">` 설정

### Google Search Console 등록 (미완료)

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → `jangrae.com`
3. Vercel DNS에서 TXT 레코드 추가로 소유권 확인
4. sitemap.xml 제출: `https://jangrae.com/sitemap.xml`

### 네이버 웹마스터 도구 등록 (미완료)

1. [네이버 서치어드바이저](https://searchadvisor.naver.com) 접속
2. 사이트 추가 → `jangrae.com`
3. HTML 메타 태그 또는 파일 인증
4. sitemap 제출

---

## 7. 향후 운영 과제

### 단기 (1~2주)

- [ ] Google Search Console 등록 및 sitemap 제출
- [ ] 네이버 서치어드바이저 등록
- [ ] GA4 퍼널 리포트 구성 (체크리스트, 계산기)
- [ ] 실제 전화번호로 플레이스홀더 교체 (`1588-xxxx`)
- [ ] OG 이미지 제작 및 적용

### 중기 (1~2개월)

- [ ] 추가 가이드 기사 4~6편 작성 (조문 예절, 화장장 예약, 지역별 장례식장 등)
- [ ] 전문가/장례식장 실데이터 수집 방법 확정
- [ ] Vercel Pro 전환 (상업적 사용 시)
- [ ] 로그인 시스템 구축 (카카오, 네이버, 전화번호)

### 장기 (3개월+)

- [ ] 전문가 매칭 실서비스 오픈
- [ ] 리뷰 시스템 구축
- [ ] 역경매/간편 상담 기능
- [ ] 디지털 추모 서비스

---

## 8. 주요 연락처 / 접근 권한

| 시스템 | 접근 | 비고 |
|--------|------|------|
| GitHub | github.com/kyungbo/jangrae | 레포 소유자: kyungbo |
| Vercel | Vercel 대시보드 | kyungbo 계정 |
| GA4 | analytics.google.com | 속성 ID: G-CF23HME4WS |
| 도메인 | 도메인 등록 업체 | jangrae.com |
