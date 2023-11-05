export interface IQuery extends Request {
  select: Object;
  offset?: number;
  limit?: number;
  value?: string;
}
