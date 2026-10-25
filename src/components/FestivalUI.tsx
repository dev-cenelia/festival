import { Heart, MapPin, Search } from "lucide-react";

// 스타일 확인용 정적 카드입니다. 데이터와 이동 기능은 직접 연결하세요.
export function FestivalCard() {
  return (
    <article className="festival-card">
      <div className="card-image">
        <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=85" alt="분홍빛 꽃밭" loading="lazy" />
        <span className="badge">자연생태</span>
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3>축제 이름</h3>
          <button type="button" className="icon-button" aria-label="관심 축제 등록"><Heart size={18} /></button>
        </div>
        <p>2026.10.01 – 2026.11.15</p>
        <span className="card-location"><MapPin size={13} />축제 지역 · 장소</span>
      </div>
    </article>
  );
}

// 제출과 검색 처리가 없는 검색창 마크업입니다.
export function SearchBar() {
  return (
    <div className="search-bar">
      <label className="search-input"><Search size={20} /><input name="q" placeholder="어떤 축제를 찾고 계신가요?" aria-label="축제명 검색" /></label>
      <label className="search-select">시기
        <select name="season"><option value="">전체</option><option>봄</option><option>여름</option><option>가을</option><option>겨울</option></select>
      </label>
      <label className="search-select">지역
        <select name="region"><option value="">전체</option><option>서울</option><option>부산</option><option>제주</option></select>
      </label>
      <label className="search-select">카테고리
        <select name="category"><option value="">전체</option><option>자연생태</option><option>문화예술</option><option>전통역사</option><option>체험</option></select>
      </label>
      <button className="primary-button" type="button">검색 <Search size={17} /></button>
    </div>
  );
}
