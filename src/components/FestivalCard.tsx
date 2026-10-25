import { Heart, MapPin } from "lucide-react";
import type { FestivalData } from "../types/festival";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

export function FestivalCard({ festival }: { festival: FestivalData }) {
  const region = festival.addr1.split(/\s+/).slice(0, 2).join(" ");

  return (
    <article className="festival-card">
      <Link to={`/festivals/${festival.contentid}`} className="card-image">
        <img
          src={festival.firstimage || festival.firstimage2}
          alt={festival.title}
          loading="lazy"
        />
        <span className="badge">자연생태</span>
      </Link>
      <div className="card-body">
        <div className="card-title">
          <Link to={`/festivals/${festival.contentid}`}>{festival.title}</Link>
          <button
            type="button"
            className="icon-button"
            aria-label="관심 축제 등록"
          >
            <Heart size={18} />
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

