import type { CategoryCode, FestivalSearchParams } from "../types/festival";

export const EMPTY_FILTERS: FestivalSearchParams = { keyword: "", season: "", region: "", category: "" };
export const SEASONS = ["봄", "여름", "가을", "겨울"];
export const REGIONS = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
// 코드 조회 장애가 나도 선택 가능한, 확인된 EV01 소분류 기본값.
export const DEFAULT_CATEGORIES: CategoryCode[] = [
  { code: "EV010100", name: "문화관광" },
  { code: "EV010200", name: "문화예술" },
  { code: "EV010300", name: "지역특산물" },
  { code: "EV010400", name: "전통역사" },
  { code: "EV010500", name: "생태자연" },
  { code: "EV010600", name: "기타" },
];
