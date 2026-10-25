import { CalendarDays, Heart, MapPin, Wind } from "lucide-react";
import { FestivalCard } from "../components/FestivalUI";

export default function FestivalDetailPage() {
  return (
    <div className="detail-page">
      <section className="detail-hero">
        <div className="container detail-title">
          <span className="badge">지역</span><h1>축제 이름</h1>
          <p>분홍빛 꽃길 사이로 불어오는 선선한 바람. 잠시 일상을 내려놓고 가을의 색을 천천히 걸어보세요.</p>
          <button type="button" className="detail-save icon-button" aria-label="관심 축제 등록"><Heart /></button>
        </div>
      </section>
      <div className="container">
        <div className="detail-meta"><span><CalendarDays size={18} />2026.10.01 – 2026.11.15</span><span><MapPin size={18} />축제 지역 · 장소</span></div>
        <nav className="detail-tabs" aria-label="상세 페이지 메뉴"><a href="#introduction">축제 소개</a><a href="#information">방문 정보</a><a href="#related">함께 둘러볼 축제</a></nav>
        <section id="introduction" className="detail-section introduction">
          <div><h2><Wind />축제 소개</h2><p>축제 소개 내용이 들어갈 자리입니다.</p><p>아름다운 풍경 속에서 여유롭게 산책하고, 소중한 사람들과 새로운 추억을 남겨보세요.</p></div>
          <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=85" alt="분홍빛 꽃밭" />
        </section>
        <section id="information" className="info-panel">
          <div><CalendarDays /><span>축제 기간<strong>2026.10.01 – 2026.11.15</strong></span></div>
          <div><MapPin /><span>장소<strong>축제 지역 · 장소</strong></span></div>
          <p>화면 구성용 예시입니다. 실제 축제 정보를 연결해주세요.</p>
        </section>
        <section id="related" className="detail-section"><h2><Wind />함께 둘러볼 축제</h2><div className="festival-grid list-grid"><FestivalCard /><FestivalCard /><FestivalCard /></div></section>
      </div>
    </div>
  );
}
