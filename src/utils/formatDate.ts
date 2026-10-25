// YYYYMMDD 형식의 날짜를 YYYY.MM.DD로 표시합니다.
export function formatDate(date: string) {
  return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;
}
