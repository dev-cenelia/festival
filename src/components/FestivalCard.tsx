import { Heart, MapPin } from "lucide-react";
import type { FestivalData } from "../types/festival";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import { DEFAULT_CATEGORIES } from "../constants/festival";
import { useFestivalStore } from "../stores/useFestivalStore";

export function FestivalCard({ festival }: { festival: FestivalData }) {
  const region = (festival.addr1 ?? "").split(/\s+/).slice(0, 2).join(" ");
  const category = DEFAULT_CATEGORIES.find((item) => item.code === festival.lclsSystm3)?.name ?? "축제·공연·행사";
  const saved = useFestivalStore((state) => state.savedIds.includes(festival.contentid));
  const toggleSaved = useFestivalStore((state) => state.toggleSaved);

  return (
    <article className="festival-card">
      <Link to={`/festivals/${festival.contentid}`} className="card-image">
        {festival.firstimage || festival.firstimage2 ? <img
          src={festival.firstimage || festival.firstimage2}
          alt={festival.title}
          loading="lazy"
        /> : <span className="image-placeholder">이미지 준비 중</span>}
        <span className="badge">{category}</span>
      </Link>
      <div className="card-body">
        <div className="card-title">
          <Link to={`/festivals/${festival.contentid}`}>{festival.title}</Link>
          <button
            type="button"
            className={`icon-button${saved ? " saved" : ""}`}
            aria-label={saved ? "관심 축제 해제" : "관심 축제 등록"}
            aria-pressed={saved}
            onClick={() => toggleSaved(festival.contentid)}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <p>
          {formatDate(festival.eventstartdate)} –{" "}
          {formatDate(festival.eventenddate)}
        </p>
        <span className="card-location">
          <MapPin size={13} />
          {region}
        </span>
      </div>
    </article>
  );
}

