// 지역별 장례식장 임대료 가중치 (서울 기준 1.0)
export const regionMultiplier: Record<string, number> = {
  seoul: 1.0,
  gyeonggi: 0.9,
  busan: 0.85,
  daegu: 0.8,
  incheon: 0.85,
  gwangju: 0.75,
  daejeon: 0.8,
  ulsan: 0.8,
  sejong: 0.8,
  gangwon: 0.7,
  chungbuk: 0.7,
  chungnam: 0.7,
  jeonbuk: 0.7,
  jeonnam: 0.65,
  gyeongbuk: 0.7,
  gyeongnam: 0.75,
  jeju: 0.8,
};

// 기본 비용 데이터 (만원 단위)
export const baseCosts = {
  // 장례식장 시설 임대료 (1일 기준)
  facilityPerDay: { min: 30, max: 80 },

  // 안치료 (1일 기준)
  storagePerDay: { min: 5, max: 15 },

  // 1인당 평균 식대 (만원)
  foodPerPerson: { min: 2, max: 3.5 },

  // 상조 서비스 패키지 (관, 수의, 상복, 도우미 등)
  sangjoPackage: { min: 150, max: 400 },

  // 비상조 시 개별 구매
  noSangjo: {
    coffin: { min: 30, max: 150 },     // 관
    shroud: { min: 20, max: 80 },       // 수의
    mourningClothes: { min: 5, max: 15 }, // 상복
    helper: { min: 30, max: 60 },       // 도우미 인건비
    hearse: { min: 20, max: 40 },       // 운구차
    flowers: { min: 15, max: 50 },      // 제단 꽃
  },

  // 화장 비용
  cremation: {
    resident: { min: 5, max: 15 },      // 관내
    nonResident: { min: 15, max: 30 },   // 관외
  },

  // 장지 비용
  burial: {
    columbarium: { min: 30, max: 100 },  // 납골당
    naturalBurial: { min: 50, max: 200 }, // 수목장
    cemetery: { min: 100, max: 500 },     // 묘지
  },

  // 기타 비용
  misc: {
    deathCertificate: { min: 0, max: 1 },
    transportation: { min: 5, max: 20 },
    thanksGifts: { min: 5, max: 20 },    // 답례품
  },
};

// 장례 유형별 일수
export const funeralDays: Record<string, number> = {
  "standard-3day": 3,
  family: 2,
  "cremation-direct": 1,
};
