import type { CalculatorInputs, CostBreakdown } from "@/lib/types";
import { regionMultiplier, baseCosts, funeralDays } from "./pricing-data";

export function calculateCost(inputs: CalculatorInputs): CostBreakdown {
  const multiplier = regionMultiplier[inputs.region] ?? 0.8;
  const days = funeralDays[inputs.funeralType] ?? 3;

  // 시설 임대료 (일수 * 일 임대료 * 지역 가중치) + 안치료
  const facilityMin = Math.round(
    (baseCosts.facilityPerDay.min * days + baseCosts.storagePerDay.min * days) * multiplier
  );
  const facilityMax = Math.round(
    (baseCosts.facilityPerDay.max * days + baseCosts.storagePerDay.max * days) * multiplier
  );

  // 음식 비용 (조문객 수 * 1인 식대)
  const foodMin = Math.round(inputs.guestCount * baseCosts.foodPerPerson.min);
  const foodMax = Math.round(inputs.guestCount * baseCosts.foodPerPerson.max);

  // 상조/의전 비용
  let sangjoMin: number;
  let sangjoMax: number;

  if (inputs.hasSangjo) {
    sangjoMin = baseCosts.sangjoPackage.min;
    sangjoMax = baseCosts.sangjoPackage.max;
  } else {
    const noSangjo = baseCosts.noSangjo;
    sangjoMin =
      noSangjo.coffin.min +
      noSangjo.shroud.min +
      noSangjo.mourningClothes.min +
      noSangjo.helper.min +
      noSangjo.hearse.min +
      noSangjo.flowers.min;
    sangjoMax =
      noSangjo.coffin.max +
      noSangjo.shroud.max +
      noSangjo.mourningClothes.max +
      noSangjo.helper.max +
      noSangjo.hearse.max +
      noSangjo.flowers.max;
  }

  // 화장/장지 비용
  const cremationMin = baseCosts.cremation.resident.min + baseCosts.burial.columbarium.min;
  const cremationMax = baseCosts.cremation.nonResident.max + baseCosts.burial.naturalBurial.max;

  // 기타 비용
  const miscMin =
    baseCosts.misc.deathCertificate.min +
    baseCosts.misc.transportation.min +
    baseCosts.misc.thanksGifts.min;
  const miscMax =
    baseCosts.misc.deathCertificate.max +
    baseCosts.misc.transportation.max +
    baseCosts.misc.thanksGifts.max;

  return {
    facilityRental: { min: facilityMin, max: facilityMax, label: "장례식장 (임대+안치)" },
    food: { min: foodMin, max: foodMax, label: "음식 (조문객 접대)" },
    sangjo: {
      min: sangjoMin,
      max: sangjoMax,
      label: inputs.hasSangjo ? "상조 서비스 패키지" : "의전 용품 (관/수의/꽃 등)",
    },
    cremation: { min: cremationMin, max: cremationMax, label: "화장 + 장지" },
    misc: { min: miscMin, max: miscMax, label: "기타 (교통/답례품 등)" },
    total: {
      min: facilityMin + foodMin + sangjoMin + cremationMin + miscMin,
      max: facilityMax + foodMax + sangjoMax + cremationMax + miscMax,
    },
  };
}
