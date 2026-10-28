import { DEFAULT_CATEGORIES, REGIONS, SEASONS } from "../constants/festival";
import type { FestivalData, FestivalSearchParams } from "../types/festival";

export function readFilters(query: URLSearchParams): FestivalSearchParams {
  const season = query.get("season") ?? "";
  const region = query.get("region") ?? "";
  const category = query.get("category") ?? "";
  return {
    keyword: query.get("keyword") ?? "",
    season: SEASONS.includes(season) ? season : "",
    region: REGIONS.includes(region) ? region : "",
    category: DEFAULT_CATEGORIES.some((item) => item.code === category) ? category : "",
  };
}

export function filtersToQuery(filters: FestivalSearchParams): URLSearchParams {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([name, value]) => {
    if (value.trim()) query.set(name, value.trim());
  });
  return query;
}

const REGION_ALIASES: Record<string, string[]> = {
  충북: ["충북", "충청북도"], 충남: ["충남", "충청남도"],
  전북: ["전북", "전라북도"], 전남: ["전남", "전라남도"],
  경북: ["경북", "경상북도"], 경남: ["경남", "경상남도"],
};

function parseDate(value: string): Date | null {
  if (!/^\d{8}$/.test(value ?? "")) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
}

// 행사 기간 중 하루라도 선택한 계절에 속하면 통과한다. 겨울: 12~2월.
export function matchesSeason(item: FestivalData, season: string): boolean {
  if (!season) return true;
  const months: Record<string, number[]> = { 봄: [2, 3, 4], 여름: [5, 6, 7], 가을: [8, 9, 10], 겨울: [11, 0, 1] };
  const selected = months[season];
  const start = parseDate(item.eventstartdate);
  const end = parseDate(item.eventenddate) ?? start;
  if (!selected || !start || !end || end < start) return false;
  const count = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  if (count >= 11) return true;
  for (let offset = 0; offset <= count; offset++) {
    if (selected.includes((start.getMonth() + offset) % 12)) return true;
  }
  return false;
}

export function filterFestivals(items: FestivalData[], filters: FestivalSearchParams): FestivalData[] {
  const keyword = filters.keyword.trim().toLocaleLowerCase();
  return items.filter((item) => {
    const province = (item.addr1 ?? "").trim().split(/\s+/)[0];
    const matchesRegion = !filters.region || (REGION_ALIASES[filters.region] ?? [filters.region]).some((name) => province.startsWith(name));
    const matchesCategory = !filters.category || item.lclsSystm3 === filters.category;
    return (item.title ?? "").toLocaleLowerCase().includes(keyword) && matchesRegion && matchesCategory && matchesSeason(item, filters.season);
  });
}
