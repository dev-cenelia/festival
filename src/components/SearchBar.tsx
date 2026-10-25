import { Search } from "lucide-react";

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

