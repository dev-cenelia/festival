import { useFestivalStore } from "../stores/useFestivalStore";

export function FestivalDataStatus() {
  const status = useFestivalStore((state) => state.status);
  const error = useFestivalStore((state) => state.error);
  const loadFestivals = useFestivalStore((state) => state.loadFestivals);
  if (status === "idle" || status === "loading") return <p className="empty-state" role="status">축제 정보를 불러오는 중입니다.</p>;
  if (status === "error") return <div className="empty-state" role="alert"><p>{error}</p><button type="button" className="primary-button" onClick={() => void loadFestivals(true)}>다시 시도</button></div>;
  return null;
}
