export interface FestivalSearchParams {
  keyword: string;
  season: string;
  region: string;
  category: string;
}

export interface CategoryCode {
  code: string;
  name: string;
}

export type FestivalData = {
  title: string;
  addr1: string;
  addr2: string;
  contentid: string;
  eventstartdate: string;
  eventenddate: string;
  firstimage: string;
  firstimage2: string;
  lclsSystm1?: string;
  lclsSystm2?: string;
  lclsSystm3?: string;
};
