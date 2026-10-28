import { expect, test, type Page } from "@playwright/test";

const year = new Date().getFullYear();
const base = { addr2: "", firstimage: "", firstimage2: "", lclsSystm1: "EV", lclsSystm2: "EV01" };
const festivals = [
  { ...base, contentid: "1", title: "서울 재즈축제", addr1: "서울특별시 종로구", eventstartdate: `${year}0530`, eventenddate: `${year}0602`, lclsSystm3: "EV010200" },
  { ...base, contentid: "2", title: "청주 벚꽃축제", addr1: "충청북도 청주시", eventstartdate: `${year}0401`, eventenddate: `${year}0405`, lclsSystm3: "EV010500" },
  { ...base, contentid: "3", title: "부산 전통축제", addr1: "부산광역시", eventstartdate: `${year}1201`, eventenddate: `${year}1203`, lclsSystm3: "EV010400" },
  { ...base, contentid: "4", title: "서울 가을축제", addr1: "서울특별시 중구", eventstartdate: `${year}1001`, eventenddate: `${year}1003`, lclsSystm3: "EV010100" },
];
const categories = [
  { code: "EV010100", name: "문화관광축제" }, { code: "EV010200", name: "문화예술축제" },
  { code: "EV010300", name: "지역특산물축제" }, { code: "EV010400", name: "전통역사축제" },
  { code: "EV010500", name: "생태자연축제" }, { code: "EV010600", name: "기타축제" },
];

async function mockApi(page: Page, failFirst = false, failCategories = false) {
  const calls: string[] = [];
  await page.route("https://apis.data.go.kr/**", async (route) => {
    const url = new URL(route.request().url());
    calls.push(url.pathname + "?" + url.searchParams.get("pageNo"));
    if (url.pathname.endsWith("lclsSystmCode2")) {
      if (failCategories) return route.fulfill({ status: 503, body: "unavailable" });
      return route.fulfill({ json: { response: { header: { resultCode: "0000" }, body: { totalCount: 6, items: { item: categories } } } } });
    }
    if (failFirst) {
      failFirst = false;
      return route.fulfill({ json: { response: { header: { resultCode: "22", resultMsg: "LIMIT" } } } });
    }
    const items = url.searchParams.get("pageNo") === "1" ? festivals.slice(0, 2) : festivals.slice(2);
    return route.fulfill({ json: { response: { header: { resultCode: "0000" }, body: { totalCount: 101, items: { item: items } } } } });
  });
  return calls;
}

test("홈 검색 → 네 조건 적용 → 탭·초기화·뒤로가기·새로고침 → 상세 데이터 공유", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const calls = await mockApi(page);
  await page.goto("/");
  await expect(page.locator(".festival-card")).toHaveCount(4);
  await page.getByLabel("축제명 검색").fill("재즈");
  await page.getByLabel("시기", { exact: true }).selectOption("여름");
  await page.getByLabel("지역", { exact: true }).selectOption("서울");
  await page.getByLabel("카테고리", { exact: true }).selectOption("EV010200");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await expect(page).toHaveURL(/\/festivals\/list\?/);
  await expect(page.locator(".festival-card")).toHaveCount(1);
  await expect(page.getByLabel("축제명 검색")).toHaveValue("재즈");
  await page.getByLabel("축제명 검색").fill("없는축제");
  await expect(page.locator(".festival-card")).toHaveCount(1);
  await page.getByLabel("축제명 검색").press("Enter");
  await expect(page.getByText("조건에 맞는 축제가 없습니다.", { exact: false })).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel("축제명 검색")).toHaveValue("재즈");
  await expect(page.locator(".festival-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".festival-card")).toHaveCount(1);
  await page.getByRole("button", { name: "검색 조건 초기화" }).click();
  await expect(page.locator(".festival-card")).toHaveCount(4);
  await page.getByRole("button", { name: "겨울", exact: true }).click();
  await expect(page.locator(".festival-card")).toHaveCount(1);
  await expect(page.getByLabel("시기", { exact: true })).toHaveValue("겨울");
  await page.getByRole("button", { name: "전체", exact: true }).click();
  await page.getByRole("button", { name: "전통역사", exact: true }).click();
  await expect(page.locator(".festival-card")).toHaveCount(1);
  await page.getByRole("button", { name: "관심 축제 등록" }).click();
  await page.getByRole("link", { name: "부산 전통축제", exact: true }).click();
  await expect(page.getByRole("heading", { name: "부산 전통축제" })).toBeVisible();
  await expect(page.getByRole("button", { name: "관심 축제 해제" })).toHaveAttribute("aria-pressed", "true");
  expect(calls.filter((call) => call.includes("searchFestival2?1"))).toHaveLength(2); // 최초 + 새로고침, 라우트 이동에서는 캐시 재사용
  expect(errors).toEqual([]);
});

test("실패 응답·재시도·분류 기본값·지역 별칭", async ({ page }) => {
  await mockApi(page, true, true);
  await page.goto("/festivals/list?region=충북&category=EV010500");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(page.locator(".festival-card")).toHaveCount(1);
  await expect(page.locator(".card-title")).toContainText("청주 벚꽃축제");
  await expect(page.getByText("최신 분류를 불러오지 못해 기본 분류를 표시합니다.", { exact: false })).toBeVisible();
});
