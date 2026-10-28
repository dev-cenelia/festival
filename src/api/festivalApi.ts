import type { FestivalData } from "../types/festival";
import { getTourItems } from "./tourApi";

// 한 해의 모든 페이지를 받아야 검색 결과가 첫 10개에 제한되지 않는다.
export async function getFestivals(year = new Date().getFullYear(), signal?: AbortSignal): Promise<FestivalData[]> {
  const query = { eventStartDate: `${year}0101`, eventEndDate: `${year}1231`, numOfRows: "100", pageNo: "1" };
  const first = await getTourItems<FestivalData>("searchFestival2", query, signal);
  const items = [...first.items];
  for (let page = 2; page <= Math.ceil(first.totalCount / 100); page++) {
    const next = await getTourItems<FestivalData>("searchFestival2", { ...query, pageNo: String(page) }, signal);
    items.push(...next.items);
  }
  return [...new Map(items.map((item) => [item.contentid, item])).values()];
}
