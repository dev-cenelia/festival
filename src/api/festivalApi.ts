export const getFestivals = async () => {
  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

  const params = new URLSearchParams({
    serviceKey: import.meta.env.VITE_TOUR_API_KEY,
    MobileOS: "ETC",
    MobileApp: "festival",
    _type: "json",
    eventStartDate: "20261001",
    numOfRows: "10",
    pageNo: "1",
  });
  const response = await fetch(`${BASE_URL}/searchFestival2?${params}`);

  if (!response.ok) {
    throw new Error(`데이터를 가지고오지 못함., ${response.status}`);
  }

  const data = await response.json();
  console.log(data);

  return data;
};
