const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

interface TourResponse<T> {
  response: {
    header: { resultCode: string; resultMsg: string };
    body?: { items?: { item?: T | T[] } | ""; totalCount?: number };
  };
}

export async function getTourItems<T>(endpoint: string, values: Record<string, string>, signal?: AbortSignal) {
  const serviceKey = import.meta.env.VITE_TOUR_API_KEY;
  if (!serviceKey) throw new Error("축제 API 키가 설정되지 않았습니다.");
  const params = new URLSearchParams({ serviceKey, MobileOS: "ETC", MobileApp: "festival", _type: "json", ...values });
  const response = await fetch(`${BASE_URL}/${endpoint}?${params}`, { signal });
  if (!response.ok) throw new Error(`데이터 조회에 실패했습니다. (${response.status})`);
  const data = await response.json() as TourResponse<T>;
  if (data.response?.header?.resultCode !== "0000") throw new Error("관광정보 API 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  const body = data.response.body;
  if (!body) throw new Error("관광정보 응답 형식이 올바르지 않습니다.");
  const raw = body.items && body.items.item;
  const items = Array.isArray(raw) ? raw : raw && typeof raw === "object" ? [raw] : [];
  return { items, totalCount: Number(body.totalCount ?? items.length) };
}
