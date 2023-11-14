export interface IQuery extends Request {
  select: Record<string, number>;
  offset?: number;
  limit?: number;
  value?: string;
  sort?: string;
}
