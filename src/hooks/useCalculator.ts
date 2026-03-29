"use client";

import { create } from "zustand";
import type { CostBreakdown } from "@/lib/types";

interface CalculatorState {
  step: number;
  guestCount: number;
  region: string;
  funeralType: string;
  hasSangjo: boolean;
  result: CostBreakdown | null;
  setStep: (step: number) => void;
  setGuestCount: (count: number) => void;
  setRegion: (region: string) => void;
  setFuneralType: (type: string) => void;
  setHasSangjo: (has: boolean) => void;
  setResult: (result: CostBreakdown) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useCalculator = create<CalculatorState>((set) => ({
  step: 0,
  guestCount: 100,
  region: "",
  funeralType: "",
  hasSangjo: false,
  result: null,
  setStep: (step) => set({ step }),
  setGuestCount: (guestCount) => set({ guestCount }),
  setRegion: (region) => set({ region }),
  setFuneralType: (funeralType) => set({ funeralType }),
  setHasSangjo: (hasSangjo) => set({ hasSangjo }),
  setResult: (result) => set({ result }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  reset: () =>
    set({
      step: 0,
      guestCount: 100,
      region: "",
      funeralType: "",
      hasSangjo: false,
      result: null,
    }),
}));
