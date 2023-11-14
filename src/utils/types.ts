export interface Pattern {
  _id: string;
  title?: string;
  author?: string;
  description?: string[];
  size?: {
    x: number;
    y: number;
  };
  rleString?: string;
  favorite?: boolean;
}

export interface QueryResponse {
  results: Pattern[];
  totalCount: { count: number }[];
}
