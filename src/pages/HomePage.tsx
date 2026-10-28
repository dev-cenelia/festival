import { ArrowRight, Wind } from "lucide-react";
import { FestivalCard } from "../components/FestivalCard";
import { SearchBar } from "../components/SearchBar";
import { useEffect } from "react";
import { useFestivalStore } from "../stores/useFestivalStore";
import { FestivalDataStatus } from "../components/FestivalDataStatus";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const festival = useFestivalStore((state) => state.festivals);
  const loadFestivals = useFestivalStore((state) => state.loadFestivals);
  const loadCategories = useFestivalStore((state) => state.loadCategories);
  useEffect(() => {
    void loadFestivals();
    void loadCategories();
  }, [loadFestivals, loadCategories]);

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
          <SearchBar />
        </div>
      </section>
      <div className="container home-sections">
        <FestivalDataStatus />
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">지금 떠나기 좋은 순간</span>
              <h2>지금 눈여겨볼 축제</h2>
              <p>이번 나들이를 특별하게 만들어줄 축제를 소개합니다.</p>
            </div>
            <button type="button" className="text-button" onClick={() => navigate("/festivals/list")}>
              전체 보기 <ArrowRight size={17} />
            </button>
          </div>
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
          <button type="button" className="banner-arrow" aria-label="축제 탐색" onClick={() => navigate("/festivals/list")}>
            <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}
