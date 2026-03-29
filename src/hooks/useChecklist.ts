"use client";

import { create } from "zustand";

interface ChecklistState {
  currentStep: number;
  completedSteps: Set<number>;
  completeStep: (stepId: number) => void;
  goNext: (totalSteps: number) => void;
  goPrev: () => void;
  reset: () => void;
}

export const useChecklist = create<ChecklistState>((set) => ({
  currentStep: 0,
  completedSteps: new Set(),
  completeStep: (stepId) =>
    set((state) => {
      const newSet = new Set(state.completedSteps);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return { completedSteps: newSet };
    }),
  goNext: (totalSteps) =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, totalSteps - 1),
    })),
  goPrev: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),
  reset: () => set({ currentStep: 0, completedSteps: new Set() }),
}));
