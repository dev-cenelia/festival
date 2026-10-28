import assert from "node:assert/strict";
import { test } from "node:test";
import { EMPTY_FILTERS } from "../src/constants/festival";
import { useFestivalStore } from "../src/stores/useFestivalStore";
import { filterFestivals, filtersToQuery, matchesSeason, readFilters } from "../src/utils/festivalFilters";
import type { FestivalData } from "../src/types/festival";

const base = { addr2: "", firstimage: "", firstimage2: "" };
const festivals: FestivalData[] = [
  { ...base, contentid: "1", title: "서울 재즈축제", addr1: "서울특별시 강남구", eventstartdate: "20260530", eventenddate: "20260602", lclsSystm3: "EV010200" },
  { ...base, contentid: "2", title: "벚꽃축제", addr1: "충청북도 청주시", eventstartdate: "20260301", eventenddate: "20260303", lclsSystm3: "EV010500" },
  { ...base, contentid: "3", title: "전통 국악축제", addr1: "부산광역시", eventstartdate: "20261230", eventenddate: "20270103", lclsSystm3: "EV010400" },
];

test("검색어·지역·시기·실제 소분류 코드를 모두 만족해야 통과", () => {
  assert.equal(filterFestivals(festivals, EMPTY_FILTERS).length, 3);
  assert.equal(filterFestivals(festivals, { ...EMPTY_FILTERS, keyword: "  재즈  ", region: "서울", season: "여름", category: "EV010200" })[0].contentid, "1");
  assert.equal(filterFestivals(festivals, { ...EMPTY_FILTERS, region: "충북", category: "EV010500" })[0].contentid, "2");
  assert.equal(filterFestivals(festivals, { ...EMPTY_FILTERS, region: "서울", category: "EV010400" }).length, 0);
});

test("계절 경계·연말·누락되거나 잘못된 행사 날짜", () => {
  assert.equal(matchesSeason(festivals[0], "봄"), true);
  assert.equal(matchesSeason(festivals[0], "여름"), true);
  assert.equal(matchesSeason(festivals[0], "겨울"), false);
  assert.equal(matchesSeason(festivals[2], "겨울"), true);
  assert.equal(matchesSeason({ ...festivals[0], eventstartdate: "20260230", eventenddate: "" }, "봄"), false);
  assert.equal(matchesSeason({ ...festivals[0], eventstartdate: "", eventenddate: "" }, "봄"), false);
});

test("URL 왕복과 잘못된 선택값 정규화", () => {
  const filters = { keyword: "불꽃 & 음악", season: "가을", region: "서울", category: "EV010200" };
  assert.deepEqual(readFilters(filtersToQuery(filters)), filters);
  assert.deepEqual(readFilters(new URLSearchParams("season=invalid&region=invalid&category=invalid")), EMPTY_FILTERS);
});

test("Zustand: 입력/적용 분리, 객체 복사, 초기화, 관심 축제 공유", () => {
  const store = useFestivalStore;
  store.getState().resetFilters();
  const previous = store.getState().draftFilters;
  store.getState().setDraftField("keyword", "  재즈  ");
  assert.equal(previous.keyword, "");
  assert.equal(store.getState().appliedFilters.keyword, "");
  store.getState().applyFilters();
  assert.equal(store.getState().appliedFilters.keyword, "재즈");
  store.getState().setDraftField("region", "서울");
  assert.equal(store.getState().appliedFilters.region, "");
  store.getState().toggleSaved("1");
  assert.equal(store.getState().savedIds.includes("1"), true);
  store.getState().toggleSaved("1");
  assert.equal(store.getState().savedIds.includes("1"), false);
  store.getState().resetFilters();
  assert.deepEqual(store.getState().draftFilters, EMPTY_FILTERS);
  assert.deepEqual(store.getState().appliedFilters, EMPTY_FILTERS);
});
