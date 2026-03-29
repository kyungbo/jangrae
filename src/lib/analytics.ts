// GA4 Measurement ID - .env.local에서 관리
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Google Analytics 페이지뷰
export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// 커스텀 이벤트 전송
export function event(action: string, params?: Record<string, string | number | boolean>) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", action, params);
}

// ── 사전 정의 이벤트 헬퍼 ──

/** 체크리스트: 상황 선택 */
export function trackSituationSelect(situation: string) {
  event("checklist_situation_select", { situation });
}

/** 체크리스트: 단계 완료 */
export function trackStepComplete(situation: string, stepId: number, stepTitle: string) {
  event("checklist_step_complete", { situation, step_id: stepId, step_title: stepTitle });
}

/** 체크리스트: 전체 완료 */
export function trackChecklistComplete(situation: string) {
  event("checklist_complete", { situation });
}

/** 계산기: 단계 진행 */
export function trackCalculatorStep(step: number, label: string) {
  event("calculator_step", { step, step_label: label });
}

/** 계산기: 결과 확인 */
export function trackCalculatorResult(totalMin: number, totalMax: number) {
  event("calculator_result_view", { total_min: totalMin, total_max: totalMax });
}

/** 가이드: 기사 열람 */
export function trackGuideView(slug: string, title: string) {
  event("guide_view", { slug, title });
}

/** 전문가: 문의 클릭 */
export function trackExpertContact(expertId: string, region: string) {
  event("expert_contact_click", { expert_id: expertId, region });
}

/** CTA: 전화 버튼 클릭 */
export function trackPhoneClick(phone: string, context: string) {
  event("phone_click", { phone_number: phone, context });
}

// gtag 타입 선언
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}
