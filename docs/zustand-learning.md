# Zustand로 전환한 검색·필터 흐름

전환 전 직접 작성한 코드는 [before-zustand.md](./before-zustand.md)에 보관했다.

## 파일별 역할

| 파일 | 역할 |
| --- | --- |
| `src/types/festival.ts` | 축제 데이터, 검색 조건, 카테고리 타입 |
| `src/stores/useFestivalStore.ts` | 공유 상태와 상태 변경 함수 |
| `src/components/SearchBar.tsx` | 스토어의 입력값 표시·변경, 검색 제출 |
| `src/hooks/useFestivalSearch.ts` | 검색 조건 확정, 목록 URL로 이동 |
| `src/pages/FestivalListPage.tsx` | URL 복원, 탭, 결과 목록 표시 |
| `src/utils/festivalFilters.ts` | 검색 조건으로 배열을 거르는 순수 함수 |
| `src/api/tourApi.ts` | 공통 요청, HTTP/API 오류 검사, 응답 정규화 |
| `src/api/festivalApi.ts` | 올해 행사 목록의 모든 페이지 조회 |
| `src/api/categoryApi.ts` | EV → EV01 소분류 코드 조회 |

## 1. 입력 중 상태

`draftFilters`는 입력창에서 편집 중인 조건이다.

```tsx
const draft = useFestivalStore((state) => state.draftFilters);
const setDraftField = useFestivalStore((state) => state.setDraftField);
setDraftField("region", "서울");
```

컴포넌트는 필요한 상태나 함수만 선택해서 구독한다. 입력할 때는 `appliedFilters`가 바뀌지 않으므로 검색 결과도 그대로다.

## 2. 검색 확정

`SearchBar`가 제출되면 `useFestivalSearch`의 `search()`가 실행된다.

1. `applyFilters()`가 입력 중 조건을 확정 조건에 복사한다.
2. `filtersToQuery()`가 확정 조건을 URL 쿼리로 만든다.
3. `/festivals/list?...`로 이동한다.

`onSearch`, `initialFilters`를 부모에서 내려주던 방식은 스토어 직접 구독으로 바뀌었다. 검색창과 페이지는 같은 상태를 읽는다.

## 3. 새로고침·뒤로 가기

메모리에 있는 Zustand 상태는 새로고침하면 사라진다. 검색 조건은 URL에 남기므로, 목록 페이지에서 `useSearchParams`로 읽고 `applyFilters`로 복원한다. 이때 입력 중 조건도 같이 갱신한다.

홈 화면의 입력값은 스토어에 남아 페이지 간 공유된다. 목록을 URL 없이 직접 열면 전체 조건으로 초기화된다.

## 4. 결과 계산

결과 배열은 별도 상태에 저장하지 않는다. 원본 축제 배열과 확정 검색 조건으로 계산한다.

```tsx
const results = useMemo(
  () => filterFestivals(festivals, filters),
  [festivals, filters]
);
```

- 검색어: 앞뒤 공백을 제거하고 제목에 포함되는지 확인, 영문 대소문자 무시
- 지역: 주소의 시·도 부분 비교, 충북/충청북도 같은 별칭 처리
- 시기: 봄 3~5월, 여름 6~8월, 가을 9~11월, 겨울 12~2월. 행사 기간이 겹치면 포함
- 카테고리: 제목 추측 대신 `lclsSystm3`와 선택한 코드를 정확히 비교
- 모든 조건은 AND로 적용

분류 탭은 같은 계절 또는 카테고리를 다시 누르면 해제된다. ‘전체’는 계절·카테고리만 해제하고, ‘검색 조건 초기화’는 검색어·지역까지 모두 해제한다.

## 5. 비동기 상태

`loadFestivals`가 `idle → loading → success/error` 상태를 관리한다. 조회 완료 데이터는 홈·목록·상세가 공유한다. 이미 조회 중이거나 올해 데이터가 있으면 다시 요청하지 않는다. 재시도는 `loadFestivals(true)`로 실행한다.

현재 조회 범위는 **현재 연도에 시작하는 축제·공연·행사**다. 총 개수에 맞춰 모든 API 페이지를 조회한 뒤 필터링하므로, 첫 10개만 검색하는 제한은 없다. 데이터가 많으면 최초 로딩에 시간이 걸릴 수 있다.

카테고리 목록도 별도로 조회한다. 실패하면 실제로 확인했던 6개 소분류를 기본값으로 사용하고 안내와 재시도 버튼을 표시한다. 소분류가 없는 행사는 전체에서는 보이지만 카테고리를 선택하면 제외된다.

관심 축제 버튼은 `savedIds`와 `toggleSaved`를 사용해 카드·상세에서 공유한다. 현재 관심 목록은 **메모리 상태**이므로 새로고침하면 초기화된다.

## 다시 만들어 보는 순서

1. `create<Store>()`로 검색 조건과 `setDraftField`만 구현한다.
2. 검색창 한 개를 스토어에 연결한다.
3. 입력 중/확정 조건을 나눠 `applyFilters`를 구현한다.
4. 순수 `filter` 함수로 결과를 계산한다.
5. 홈과 목록이 같은 상태를 사용하는지 확인한다.
6. URL 저장·복원과 비동기 조회를 추가한다.

## 검증 명령

```sh
npm test
npm run test:e2e
npm run build
npm run lint
```

브라우저 테스트는 Chrome을 사용하고 API 응답을 모의 처리한다. 테스트 서버에는 `test-key`를 주입해 실제 로컬 키를 전송하지 않는다. 실제 API 연결 상태와 별개로 화면·스토어·요청/응답 흐름을 재현할 수 있다.
