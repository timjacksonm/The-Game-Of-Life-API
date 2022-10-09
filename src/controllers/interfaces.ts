export interface IQuery extends Request {
  select: string;
  limit: number;
  value?: string;
}
