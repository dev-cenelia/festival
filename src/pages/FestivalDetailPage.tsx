import { CalendarDays, Heart, MapPin, Wind } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FestivalCard } from "../components/FestivalCard";
import { FestivalDataStatus } from "../components/FestivalDataStatus";
import { useFestivalStore } from "../stores/useFestivalStore";
import { DEFAULT_CATEGORIES } from "../constants/festival";
import { formatDate } from "../utils/formatDate";

export default function FestivalDetailPage() {
  const { id } = useParams();
  const festivals = useFestivalStore((state) => state.festivals);
  const status = useFestivalStore((state) => state.status);
  const loadFestivals = useFestivalStore((state) => state.loadFestivals);
  const saved = useFestivalStore((state) => state.savedIds.includes(id ?? ""));
  const toggleSaved = useFestivalStore((state) => state.toggleSaved);
  useEffect(() => { void loadFestivals(); }, [loadFestivals]);

  if (status !== "success") return <div className="container"><FestivalDataStatus /></div>;
  const festival = festivals.find((item) => item.contentid === id);
  if (!festival) return <div className="container empty-state"><p>현재 조회 범위에서 축제를 찾을 수 없습니다.</p><Link to="/festivals/list">축제 목록으로</Link></div>;
  const category = DEFAULT_CATEGORIES.find((item) => item.code === festival.lclsSystm3)?.name ?? "축제·공연·행사";
  const image = festival.firstimage || festival.firstimage2;
  const period = `${formatDate(festival.eventstartdate)} – ${formatDate(festival.eventenddate)}`;
  const related = festivals.filter((item) => item.contentid !== id && item.lclsSystm3 === festival.lclsSystm3).slice(0, 3);

  return (
    <div className="detail-page">
      <section className="detail-hero" style={image ? { backgroundImage: `linear-gradient(0deg, rgba(11,40,59,.85), rgba(11,40,59,.15)), url(${JSON.stringify(image)})` } : undefined}>
        <div className="container detail-title">
          <span className="badge">{category}</span>
          <h1>{festival.title}</h1>
          <p>{festival.addr1} {festival.addr2}</p>
          <button type="button" className={`detail-save icon-button${saved ? " saved" : ""}`}
            aria-label={saved ? "관심 축제 해제" : "관심 축제 등록"} aria-pressed={saved} onClick={() => toggleSaved(festival.contentid)}>
            <Heart fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </section>
      <div className="container">
        <div className="detail-meta"><span><CalendarDays size={18} />{period}</span><span><MapPin size={18} />{festival.addr1 || "주소 정보 없음"}</span></div>
        <nav className="detail-tabs" aria-label="상세 페이지 메뉴"><a href="#information">방문 정보</a><a href="#related">함께 둘러볼 축제</a></nav>
        <section id="information" className="info-panel">
          <div><CalendarDays /><span>축제 기간<strong>{period}</strong></span></div>
          <div><MapPin /><span>장소<strong>{[festival.addr1, festival.addr2].filter(Boolean).join(" ") || "주소 정보 없음"}</strong></span></div>
          <p>방문 전 주최 측의 최신 일정과 운영 정보를 확인해 주세요.</p>
        </section>
        <section id="related" className="detail-section">
          <h2><Wind />함께 둘러볼 축제</h2>
          {related.length ? <div className="festival-grid list-grid">{related.map((item) => <FestivalCard key={item.contentid} festival={item} />)}</div> : <p className="empty-state">같은 분류의 다른 축제가 없습니다.</p>}
        </section>
      </div>
    </div>
  );
}
