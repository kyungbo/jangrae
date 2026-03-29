import type { ChecklistData, Situation } from "@/lib/types";
import { hospitalChecklist } from "./hospital";
import { homeChecklist } from "./home";
import { accidentChecklist } from "./accident";

export const checklists: Record<Situation, ChecklistData> = {
  hospital: hospitalChecklist,
  home: homeChecklist,
  accident: accidentChecklist,
};

export function getChecklist(situation: string): ChecklistData | undefined {
  return checklists[situation as Situation];
}

export function isValidSituation(situation: string): situation is Situation {
  return ["hospital", "home", "accident"].includes(situation);
}
