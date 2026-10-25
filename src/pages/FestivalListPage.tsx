import { Wind } from "lucide-react";
import { FestivalCard } from "../components/FestivalCard";
import { SearchBar } from "../components/SearchBar";
import { useEffect, useState } from "react";
import { getFestivals } from "../api/festivalApi";
import type { FestivalData } from "../types/festival";

export default function FestivalListPage() {
  const [festivalList, setFestivalList] = useState<FestivalData[]>([]);

  useEffect(() => {
    getFestivals()
      .then((data) => {
        setFestivalList(data.response.body.items.item ?? []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="container list-page">
      <section className="list-intro">
        <div>
          <span className="eyebrow">전국의 특별한 축제를 만나보세요</span>
          <h1>전국 축제 탐색</h1>
          <p>계절, 지역, 취향에 맞는 나만의 축제를 찾아보세요.</p>
        </div>
        <Wind className="intro-wind" size={100} strokeWidth={1} />
      </section>
      <SearchBar />
      {/* selected 클래스는 선택 상태의 스타일 예시입니다. */}
      <div className="filter-tabs" aria-label="축제 분류">
        <button type="button" className="selected">
          전체
        </button>
        <button type="button">봄</button>
        <button type="button">여름</button>
        <button type="button">가을</button>
        <button type="button">겨울</button>
        <button type="button">문화예술</button>
        <button type="button">자연생태</button>
        <button type="button">전통역사</button>
        <button type="button">체험</button>
      </div>
      <div className="results-line">
        <p>
          총 <strong>{festivalList.length}개</strong>의 축제가 있습니다.
        </p>
        <span>화면 구성용 예시</span>
      </div>
      <div className="festival-grid list-grid">
        {festivalList.map((item) => (
          <FestivalCard key={item.contentid} festival={item} />
        ))}
      </div>
    </div>
  );
}
