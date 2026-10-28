import { useNavigate } from "react-router-dom";
import { useFestivalStore } from "../stores/useFestivalStore";
import { filtersToQuery } from "../utils/festivalFilters";
import type { FestivalSearchParams } from "../types/festival";

export function useFestivalSearch() {
  const navigate = useNavigate();
  const applyFilters = useFestivalStore((state) => state.applyFilters);
  return (filters?: FestivalSearchParams) => {
    applyFilters(filters);
    const query = filtersToQuery(useFestivalStore.getState().appliedFilters).toString();
    navigate(`/festivals/list${query ? `?${query}` : ""}`);
  };
}
