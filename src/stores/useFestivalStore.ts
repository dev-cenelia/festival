import { create } from "zustand";
import { getFestivals } from "../api/festivalApi";
import { getCategoryCodes } from "../api/categoryApi";
import { DEFAULT_CATEGORIES, EMPTY_FILTERS } from "../constants/festival";
import type { CategoryCode, FestivalData, FestivalSearchParams } from "../types/festival";

type LoadStatus = "idle" | "loading" | "success" | "error";

interface FestivalStore {
  draftFilters: FestivalSearchParams;
  appliedFilters: FestivalSearchParams;
  festivals: FestivalData[];
  categories: CategoryCode[];
  status: LoadStatus;
  error: string;
  categoryStatus: LoadStatus;
  categoryError: string;
  loadedYear: number | null;
  savedIds: string[];
  toggleSaved: (id: string) => void;
  setDraftField: (name: keyof FestivalSearchParams, value: string) => void;
  applyFilters: (filters?: FestivalSearchParams) => void;
  resetFilters: () => void;
  loadFestivals: (force?: boolean) => Promise<void>;
  loadCategories: (force?: boolean) => Promise<void>;
}

// set: 상태 업데이트 / get: 현재 상태 읽기
// 입력 중 조건과 검색을 확정한 조건을 나눠, 입력만으로 목록이 바뀌지 않게 한다.
export const useFestivalStore = create<FestivalStore>()((set, get) => ({
  draftFilters: { ...EMPTY_FILTERS },
  appliedFilters: { ...EMPTY_FILTERS },
  festivals: [],
  categories: DEFAULT_CATEGORIES,
  status: "idle",
  error: "",
  categoryStatus: "idle",
  categoryError: "",
  loadedYear: null,
  savedIds: [],
  toggleSaved: (id) => set((state) => ({
    savedIds: state.savedIds.includes(id) ? state.savedIds.filter((saved) => saved !== id) : [...state.savedIds, id],
  })),

  setDraftField: (name, value) => set((state) => ({ draftFilters: { ...state.draftFilters, [name]: value } })),

  applyFilters: (filters) => {
    const next = { ...(filters ?? get().draftFilters) };
    next.keyword = next.keyword.trim();
    set({ appliedFilters: next, draftFilters: { ...next } });
  },

  resetFilters: () => set({ draftFilters: { ...EMPTY_FILTERS }, appliedFilters: { ...EMPTY_FILTERS } }),

  loadFestivals: async (force = false) => {
    const year = new Date().getFullYear();
    const state = get();
    // StrictMode나 여러 페이지에서 호출해도 중복 조회하지 않는다.
    if (state.status === "loading" || (!force && state.status === "success" && state.loadedYear === year)) return;
    set({ status: "loading", error: "" });
    try {
      const festivals = await getFestivals(year);
      set({ festivals, status: "success", loadedYear: year });
    } catch (error) {
      set({ status: "error", error: error instanceof Error ? error.message : "축제 조회에 실패했습니다." });
    }
  },

  loadCategories: async (force = false) => {
    const state = get();
    if (state.categoryStatus === "loading" || (!force && state.categoryStatus === "success")) return;
    set({ categoryStatus: "loading", categoryError: "" });
    try {
      const categories = await getCategoryCodes();
      if (!categories.length) throw new Error("분류 목록이 비어 있습니다.");
      set({ categories, categoryStatus: "success" });
    } catch {
      set({ categoryStatus: "error", categoryError: "최신 분류를 불러오지 못해 기본 분류를 표시합니다." });
    }
  },
}));
