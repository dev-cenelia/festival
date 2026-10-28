import { Search } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { REGIONS, SEASONS } from "../constants/festival";
import { useFestivalStore } from "../stores/useFestivalStore";
import { useFestivalSearch } from "../hooks/useFestivalSearch";
import type { FestivalSearchParams } from "../types/festival";

export function SearchBar() {
  // 필요한 상태만 구독한다. 다른 상태가 바뀌어도 불필요하게 다시 렌더링하지 않는다.
  const draft = useFestivalStore((state) => state.draftFilters);
  const categories = useFestivalStore((state) => state.categories);
  const setDraftField = useFestivalStore((state) => state.setDraftField);
  const search = useFestivalSearch();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    if (["keyword", "season", "region", "category"].includes(name)) {
      setDraftField(name as keyof FestivalSearchParams, value);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-input">
        <Search size={20} />
        <input name="keyword" placeholder="어떤 축제를 찾고 계신가요?" aria-label="축제명 검색"
          value={draft.keyword} onChange={handleChange} />
      </label>
      <label className="search-select">시기
        <select name="season" aria-label="시기" value={draft.season} onChange={handleChange}>
          <option value="">전체</option>
          {SEASONS.map((season) => <option key={season} value={season}>{season}</option>)}
        </select>
      </label>
      <label className="search-select">지역
        <select name="region" aria-label="지역" value={draft.region} onChange={handleChange}>
          <option value="">전체</option>
          {REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
        </select>
      </label>
      <label className="search-select">카테고리
        <select name="category" aria-label="카테고리" value={draft.category} onChange={handleChange}>
          <option value="">전체</option>
          {categories.map((category) => <option key={category.code} value={category.code}>{category.name}</option>)}
        </select>
      </label>
      <button className="primary-button" type="submit">검색 <Search size={17} /></button>
    </form>
  );
}
