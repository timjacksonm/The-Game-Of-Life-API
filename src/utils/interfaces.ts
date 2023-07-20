export interface IQuery extends Request {
  select: string;
  offset?: number;
  limit?: number;
  value?: string;
}
