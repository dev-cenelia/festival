# Before Zustand

## src/components/SearchBar.tsx

```tsx
﻿import { Search } from "lucide-react";
import type { FestivalSearchParams } from "../pages/FestivalListPage";
import { useState, type ChangeEvent } from "react";

type SearchBarProps = {
  onSearch: (params: FestivalSearchParams) => void;
  initialFilters?: FestivalSearchParams;
};

export function SearchBar({ onSearch, initialFilters }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState<FestivalSearchParams>(
    initialFilters ?? {
      keyword: "",
      season: "",
      region: "",
      category: "",
    },
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log(searchParams);

  return (
    <div className="search-bar">
      <label className="search-input">
        <Search size={20} />
        <input
          name="keyword"
          placeholder="어떤 축제를 찾고 계신가요?"
          aria-label="축제명 검색"
          onChange={handleChange}
          value={searchParams.keyword}
        />
      </label>
      <label className="search-select">
        시기
        <select
          name="season"
          value={searchParams.season}
          onChange={handleChange}
        >
          <option value="">전체</option>
          <option>봄</option>
          <option>여름</option>
          <option>가을</option>
          <option>겨울</option>
        </select>
      </label>
      <label className="search-select">
        지역
        <select
          name="region"
          value={searchParams.region}
          onChange={handleChange}
        >
          <option value="">전체</option>
          <option>서울</option>
          <option>부산</option>
          <option>제주</option>
        </select>
      </label>
      <label className="search-select">
        카테고리
        <select
          name="category"
          value={searchParams.category}
          onChange={handleChange}
        >
          <option value="">전체</option>
          <option value="EV010100">문화관광</option>
          <option value="EV010200">문화예술</option>
          <option value="EV010300">지역특산물</option>
          <option value="EV010400">전통역사</option>
          <option value="EV010500">생태자연</option>
          <option value="EV010600">기타</option>
        </select>
      </label>
      <button
        className="primary-button"
        type="button"
        onClick={() => onSearch(searchParams)}
      >
        검색 <Search size={17} />
      </button>
    </div>
  );
}

```

## src/pages/FestivalListPage.tsx

```tsx
﻿import { Wind } from "lucide-react";
import { FestivalCard } from "../components/FestivalCard";
import { SearchBar } from "../components/SearchBar";
import { useEffect, useState } from "react";
import { getFestivals } from "../api/festivalApi";
import type { FestivalData } from "../types/festival";
import { useSearchParams } from "react-router-dom";
import { getCategoryCodes } from "../api/categoryApi";

export interface FestivalSearchParams {
  keyword: string;
  season: string;
  region: string;
  category: string;
}

export default function FestivalListPage() {
  const [festivalList, setFestivalList] = useState<FestivalData[]>([]);

  const [urlSearchParams] = useSearchParams();
  // console.log("URL 검색어:", urlSearchParams.get("keyword"));
  const [appliedFilters, setAppliedFilters] = useState<FestivalSearchParams>({
    keyword: urlSearchParams.get("keyword") ?? "",
    season: urlSearchParams.get("season") ?? "",
    region: urlSearchParams.get("region") ?? "",
    category: urlSearchParams.get("category") ?? "",
  });

  useEffect(() => {
    getFestivals()
      .then((data) => {
        setFestivalList(data.response.body.items.item ?? []);
      })
      .catch(console.error);
    getCategoryCodes().catch(console.error);
  }, []);

  const handleSearch = (params: FestivalSearchParams) => {
    // console.log("부모가 받은 검색 조건 필터", appliedFilters);
    // console.log("부모가 받은 검색 조건 파람스", params);
    setAppliedFilters(params);
  };

  const filteredFestivals = festivalList.filter((item) => {
    const matchesKeyword = item.title.includes(appliedFilters.keyword.trim());
    const matchesRegion =
      appliedFilters.region === "" ||
      item.addr1.includes(appliedFilters.region);
    return matchesKeyword && matchesRegion;
  });

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
      <SearchBar onSearch={handleSearch} initialFilters={appliedFilters} />
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
          총 <strong>{filteredFestivals.length}개</strong>의 축제가 있습니다.
        </p>
        <span>화면 구성용 예시</span>
      </div>
      <div className="festival-grid list-grid">
        {filteredFestivals.map((item) => (
          <FestivalCard key={item.contentid} festival={item} />
        ))}
      </div>
    </div>
  );
}

```

## src/pages/HomePage.tsx

```tsx
﻿import { ArrowRight, Wind } from "lucide-react";
import { FestivalCard } from "../components/FestivalCard";
import { SearchBar } from "../components/SearchBar";
import { useEffect, useState } from "react";
import type { FestivalData } from "../types/festival";
import { getFestivals } from "../api/festivalApi";
import type { FestivalSearchParams } from "./FestivalListPage";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [festival, setFestivalList] = useState<FestivalData[]>([]);
  useEffect(() => {
    getFestivals()
      .then((data) => {
        setFestivalList(data.response.body.items.item ?? []);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (params: FestivalSearchParams) => {
    // console.log("홈에서 입력한 검색조건", params);
    const query = new URLSearchParams({
      keyword: params.keyword,
      season: params.season,
      region: params.region,
      category: params.category,
    });

    navigate(`/festivals/list?${query.toString()}`);
  };

  const navigate = useNavigate();
  return (
    <>
      <section className="home-hero">
        <div className="container hero-content">
          <span className="eyebrow">
            좋은 날, 좋은 곳으로 <Wind size={26} />
          </span>
          <h1>
            오늘은 어디로
            <br />
            바람 쐬러 갈까?
          </h1>
          <p>
            계절마다 특별한 축제가 기다리는 곳,
            <br />
            콧바람과 함께 전국의 축제를 만나보세요.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      <div className="container home-sections">
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">지금 떠나기 좋은 순간</span>
              <h2>지금 눈여겨볼 축제</h2>
              <p>이번 나들이를 특별하게 만들어줄 축제를 소개합니다.</p>
            </div>
            <button type="button" className="text-button">
              전체 보기 <ArrowRight size={17} />
            </button>
          </div>
          {/* 반복 출력과 실제 데이터는 직접 연결하세요. */}
          <div className="festival-grid home-grid">
            {festival.slice(0, 4).map((item) => (
              <FestivalCard key={item.contentid} festival={item} />
            ))}
          </div>
        </section>
        <section>
          <div className="section-heading">
            <div>
              <h2>다음 바람은 어디로?</h2>
              <p>다가올 계절의 설렘을 미리 만나보세요.</p>
            </div>
          </div>
          <div className="festival-grid home-grid">
            {festival.slice(4, 8).map((item) => (
              <FestivalCard key={item.contentid} festival={item} />
            ))}
          </div>
        </section>
        <div className="travel-banner">
          <Wind size={48} />
          <div>
            <h2>
              바람이 머무는 곳에
              <br />
              언제나 축제가 있습니다.
            </h2>
            <p>일상의 쉼표가 되는 특별한 여행, 콧바람</p>
          </div>
          <button type="button" className="banner-arrow" aria-label="축제 탐색">
            <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

```

## src/api/festivalApi.ts

```tsx
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

```

## src/api/categoryApi.ts

```tsx
export const getCategoryCodes = async () => {
  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

  const params = new URLSearchParams({
    serviceKey: import.meta.env.VITE_TOUR_API_KEY,
    MobileOS: "ETC",
    MobileApp: "festival",
    _type: "json",
    lclsSystm1: "EV",
    lclsSystm2: "EV01",
  });
  const response = await fetch(`${BASE_URL}/lclsSystmCode2?${params}`);

  if (!response.ok) {
    throw new Error(`데이터를 못가져옴.,${response.status}`);
  }
  const data = await response.json();
  console.log("카테고리 데이터", data);

  return data;
};

```
