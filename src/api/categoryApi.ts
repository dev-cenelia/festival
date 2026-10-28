import type { CategoryCode } from "../types/festival";
import { getTourItems } from "./tourApi";

export async function getCategoryCodes(): Promise<CategoryCode[]> {
  const { items } = await getTourItems<CategoryCode>("lclsSystmCode2", {
    lclsSystm1: "EV", lclsSystm2: "EV01", numOfRows: "100", pageNo: "1",
  });
  return items.map((item) => ({ code: item.code, name: item.name.replace(/축제$/, "") }));
}
