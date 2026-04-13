export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** 해당되는 사람 유형 */
  appliesTo: string[];
  deadline: string;
  tasks: AdminTask[];
}

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  where: string;
  documents: string[];
  deadline: string;
  tip?: string;
  phone?: string;
}

export type PersonType =
  | "spouse"
  | "child"
  | "parent"
  | "sibling"
  | "all";

export const personTypes = [
  { id: "spouse" as const, label: "배우자" },
  { id: "child" as const, label: "자녀" },
  { id: "parent" as const, label: "부모" },
  { id: "sibling" as const, label: "형제자매" },
  { id: "all" as const, label: "전체 보기" },
];

export const adminCategories: AdminCategory[] = [
  {
    id: "death-report",
    name: "사망신고",
    description: "가장 먼저 해야 할 법적 절차입니다.",
    icon: "FileText",
    appliesTo: ["spouse", "child", "parent", "sibling"],
    deadline: "사망 후 1개월 이내",
    tasks: [
      {
        id: "dr-1",
        title: "사망신고서 제출",
        description: "주민센터 또는 시·구청에 사망신고서를 제출합니다. 온라인(정부24)으로도 가능합니다.",
        where: "주민센터, 시·구청, 정부24(온라인)",
        documents: ["사망진단서(사체검안서)", "신고인 신분증", "사망신고서(현장 작성 가능)"],
        deadline: "1개월 이내",
        tip: "사망신고를 하면 주민등록이 말소됩니다. 이후 행정 절차의 기초가 되므로 가장 먼저 처리하세요.",
      },
    ],
  },
  {
    id: "inheritance-search",
    name: "상속재산 조회",
    description: "고인의 재산과 채무를 한 번에 조회합니다.",
    icon: "Search",
    appliesTo: ["spouse", "child", "parent", "sibling"],
    deadline: "사망 후 가능한 빨리",
    tasks: [
      {
        id: "is-1",
        title: "안심상속 원스톱 서비스 신청",
        description: "고인의 금융자산, 부동산, 자동차, 세금, 연금, 4대 보험 등을 한 번에 조회할 수 있는 정부 서비스입니다.",
        where: "주민센터, 정부24(온라인)",
        documents: ["사망신고 완료 상태", "신청인 신분증", "가족관계증명서"],
        deadline: "사망신고 후 즉시 가능",
        tip: "사망신고와 동시에 신청하면 한 번의 방문으로 처리됩니다. 조회 결과는 20일 내 문자/우편으로 도착합니다.",
        phone: "110",
      },
    ],
  },
  {
    id: "insurance",
    name: "보험 청구",
    description: "고인이 가입한 보험을 확인하고 청구합니다.",
    icon: "Shield",
    appliesTo: ["spouse", "child"],
    deadline: "보험별 상이 (보통 3년 이내)",
    tasks: [
      {
        id: "ins-1",
        title: "보험 가입 내역 확인",
        description: "안심상속 원스톱 서비스 결과 또는 생명보험협회·손해보험협회에서 고인의 보험 가입 내역을 확인합니다.",
        where: "생명보험협회(1588-6300), 손해보험협회(1566-8114)",
        documents: ["사망진단서", "가족관계증명서", "신분증"],
        deadline: "가능한 빨리 (3년 소멸시효)",
        phone: "1588-6300",
      },
      {
        id: "ins-2",
        title: "사망보험금 청구",
        description: "확인된 보험사에 사망보험금을 청구합니다. 각 보험사 콜센터 또는 지점에서 접수합니다.",
        where: "해당 보험사 콜센터 또는 지점",
        documents: ["사망진단서", "수익자 신분증", "가족관계증명서", "통장 사본"],
        deadline: "3년 이내",
        tip: "수익자가 지정되어 있으면 수익자가, 없으면 법정상속인이 청구합니다.",
      },
    ],
  },
  {
    id: "pension",
    name: "연금·건강보험",
    description: "유족연금 신청과 건강보험 정리.",
    icon: "Heart",
    appliesTo: ["spouse", "child"],
    deadline: "5년 이내 (유족연금)",
    tasks: [
      {
        id: "pen-1",
        title: "국민연금 유족연금 신청",
        description: "고인이 국민연금에 가입되어 있었다면, 유족이 유족연금을 받을 수 있습니다.",
        where: "국민연금공단 지사, 온라인(국민연금 홈페이지)",
        documents: ["사망진단서", "가족관계증명서", "신분증", "통장 사본"],
        deadline: "5년 이내",
        tip: "유족연금은 배우자 → 자녀 → 부모 순으로 우선순위가 있습니다. 배우자가 있으면 배우자가 수령합니다.",
        phone: "1355",
      },
      {
        id: "pen-2",
        title: "건강보험 자격상실 신고",
        description: "고인의 건강보험 자격을 상실 처리합니다. 피부양자였다면 자격 변경이 필요할 수 있습니다.",
        where: "국민건강보험공단 지사, 온라인",
        documents: ["사망신고 완료 상태"],
        deadline: "14일 이내",
        phone: "1577-1000",
      },
    ],
  },
  {
    id: "finance",
    name: "금융 정리",
    description: "은행, 증권, 카드 등 금융 거래를 정리합니다.",
    icon: "Wallet",
    appliesTo: ["spouse", "child"],
    deadline: "가능한 빨리",
    tasks: [
      {
        id: "fin-1",
        title: "은행 계좌 정리",
        description: "고인의 은행 계좌를 확인하고, 상속인 명의로 전환하거나 해지합니다.",
        where: "해당 은행 영업점",
        documents: ["사망진단서", "가족관계증명서", "상속인 전원의 인감증명서(또는 본인서명사실확인서)", "상속인 신분증"],
        deadline: "상속 절차 후",
        tip: "상속인 전원의 동의가 필요합니다. 협의가 안 되면 법원에 상속재산분할 심판을 청구해야 합니다.",
      },
      {
        id: "fin-2",
        title: "신용카드 해지",
        description: "고인 명의의 신용카드를 해지하고, 미결제 금액을 확인합니다.",
        where: "해당 카드사",
        documents: ["사망진단서", "가족관계증명서"],
        deadline: "가능한 빨리",
      },
    ],
  },
  {
    id: "property",
    name: "부동산·자동차",
    description: "부동산 상속 등기 및 자동차 명의 이전.",
    icon: "Home",
    appliesTo: ["spouse", "child"],
    deadline: "6개월 이내 (상속세 신고)",
    tasks: [
      {
        id: "prop-1",
        title: "부동산 상속 등기",
        description: "고인 명의의 부동산이 있다면 상속 등기를 해야 합니다.",
        where: "관할 등기소(온라인: 인터넷등기소)",
        documents: ["사망진단서", "가족관계증명서", "상속인 전원 인감증명서", "상속재산분할협의서", "취득세 납부 영수증"],
        deadline: "상속 개시 후 가능한 빨리",
        tip: "상속 등기를 하지 않으면 처분(매매 등)이 불가능합니다. 분쟁 방지를 위해 빠르게 처리하세요.",
      },
      {
        id: "prop-2",
        title: "자동차 명의 이전",
        description: "고인 명의의 자동차를 상속인 명의로 이전합니다.",
        where: "관할 차량등록사업소",
        documents: ["사망진단서", "가족관계증명서", "상속인 신분증", "자동차등록증"],
        deadline: "상속 개시일로부터 3개월 이내",
        tip: "기한을 넘기면 과태료가 부과됩니다 (10일 초과 시 1일 1만 원).",
      },
    ],
  },
  {
    id: "tax",
    name: "상속세 신고",
    description: "상속재산에 대한 세금 신고.",
    icon: "Receipt",
    appliesTo: ["spouse", "child"],
    deadline: "사망일로부터 6개월 이내",
    tasks: [
      {
        id: "tax-1",
        title: "상속세 신고·납부",
        description: "상속재산 총액이 기초공제(5억 원) 이상이면 상속세를 신고·납부해야 합니다. 배우자가 있으면 배우자 공제(최소 5억 원)가 추가됩니다.",
        where: "관할 세무서, 국세청 홈택스",
        documents: ["사망진단서", "상속재산 목록", "가족관계증명서", "부동산 등기부등본"],
        deadline: "상속 개시일로부터 6개월 이내",
        tip: "총 상속재산이 10억 원(배우자 있을 때) 이하이면 상속세가 없는 경우가 많습니다. 그래도 신고는 하는 것이 안전합니다.",
        phone: "126",
      },
    ],
  },
  {
    id: "digital",
    name: "디지털·구독 정리",
    description: "휴대폰, 인터넷, 구독 서비스 해지 또는 이전.",
    icon: "Smartphone",
    appliesTo: ["spouse", "child", "sibling"],
    deadline: "가능한 빨리",
    tasks: [
      {
        id: "dig-1",
        title: "휴대폰 해지/명의변경",
        description: "고인의 휴대폰 회선을 해지하거나 명의를 변경합니다.",
        where: "해당 통신사 대리점 또는 고객센터",
        documents: ["사망진단서", "가족관계증명서", "신분증"],
        deadline: "가능한 빨리",
        tip: "해지하면 번호가 삭제되므로, 해당 번호로 연결된 서비스(2차 인증 등)를 먼저 정리하세요.",
      },
      {
        id: "dig-2",
        title: "구독 서비스 해지",
        description: "넷플릭스, 유튜브 프리미엄, 네이버 멤버십 등 정기 결제 중인 구독 서비스를 해지합니다.",
        where: "각 서비스 홈페이지 또는 앱",
        documents: ["고인의 계정 정보 (가능한 경우)"],
        deadline: "다음 결제일 전",
        tip: "신용카드가 해지되면 자동으로 결제 실패되지만, 미납금이 쌓일 수 있으므로 직접 해지하는 것이 안전합니다.",
      },
      {
        id: "dig-3",
        title: "SNS 계정 추모 전환/삭제",
        description: "페이스북, 인스타그램 등은 추모 계정으로 전환하거나 삭제를 요청할 수 있습니다.",
        where: "각 플랫폼의 추모 계정 요청 페이지",
        documents: ["사망 증빙(사망진단서 등)", "관계 증빙"],
        deadline: "선택 사항",
      },
    ],
  },
];

export function getCategoriesForPerson(personType: PersonType): AdminCategory[] {
  if (personType === "all") return adminCategories;
  return adminCategories.filter((c) => c.appliesTo.includes(personType));
}
