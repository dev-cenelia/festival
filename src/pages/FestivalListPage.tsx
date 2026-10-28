import { Wind } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FestivalCard } from "../components/FestivalCard";
import { SearchBar } from "../components/SearchBar";
import { EMPTY_FILTERS, SEASONS } from "../constants/festival";
import { useFestivalStore } from "../stores/useFestivalStore";
import { useFestivalSearch } from "../hooks/useFestivalSearch";
import { filterFestivals, readFilters } from "../utils/festivalFilters";

export default function FestivalListPage() {
  const festivals = useFestivalStore((state) => state.festivals);
  const filters = useFestivalStore((state) => state.appliedFilters);
  const categories = useFestivalStore((state) => state.categories);
  const status = useFestivalStore((state) => state.status);
  const error = useFestivalStore((state) => state.error);
  const categoryError = useFestivalStore((state) => state.categoryError);
  const loadFestivals = useFestivalStore((state) => state.loadFestivals);
  const loadCategories = useFestivalStore((state) => state.loadCategories);
  const applyFilters = useFestivalStore((state) => state.applyFilters);
  const search = useFestivalSearch();
  const [query] = useSearchParams();
  const queryString = query.toString();

  useEffect(() => {
    void loadFestivals();
    void loadCategories();
  }, [loadFestivals, loadCategories]);

  // 새로고침, 직접 URL 진입, 브라우저 뒤로/앞으로 가기를 스토어에 반영한다.
  useEffect(() => {
    applyFilters(readFilters(new URLSearchParams(queryString)));
  }, [queryString, applyFilters]);

  const results = useMemo(() => filterFestivals(festivals, filters), [festivals, filters]);
  const loading = status === "idle" || status === "loading";

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
      <div className="filter-tabs" aria-label="축제 분류">
        <button type="button" className={!filters.season && !filters.category ? "selected" : ""}
          aria-pressed={!filters.season && !filters.category}
          onClick={() => search({ ...filters, season: "", category: "" })}>전체</button>
        {SEASONS.map((season) => (
          <button key={season} type="button" className={filters.season === season ? "selected" : ""}
            aria-pressed={filters.season === season}
            onClick={() => search({ ...filters, season: filters.season === season ? "" : season })}>{season}</button>
        ))}
        {categories.map((category) => (
          <button key={category.code} type="button" className={filters.category === category.code ? "selected" : ""}
            aria-pressed={filters.category === category.code}
            onClick={() => search({ ...filters, category: filters.category === category.code ? "" : category.code })}>{category.name}</button>
        ))}
      </div>
      <p className="filter-help">{new Date().getFullYear()}년 시작 축제·공연·행사 기준 · 계절은 행사 기간이 겹치면 표시합니다.</p>
      {categoryError && <p className="filter-help" role="status">{categoryError} <button className="text-button" type="button" onClick={() => void loadCategories(true)}>분류 다시 불러오기</button></p>}
      <div className="results-line" aria-live="polite">
        <p>{loading ? "축제 정보를 불러오는 중입니다." : status === "error" ? "축제 조회에 실패했습니다." : <>총 <strong>{results.length}개</strong>의 축제가 있습니다.</>}</p>
        <button className="text-button" type="button" onClick={() => search(EMPTY_FILTERS)}>검색 조건 초기화</button>
      </div>
      {status === "error" && <div className="empty-state" role="alert"><p>{error}</p><button className="primary-button" type="button" onClick={() => void loadFestivals(true)}>다시 시도</button></div>}
      {status === "success" && results.length === 0 && <p className="empty-state" role="status">조건에 맞는 축제가 없습니다. 검색 조건을 변경해 보세요.</p>}
      <div className="festival-grid list-grid" aria-busy={loading}>
        {status === "success" && results.map((festival) => <FestivalCard key={festival.contentid} festival={festival} />)}
      </div>
    </div>
  );
}
