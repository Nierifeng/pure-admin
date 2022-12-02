import { QueryParam } from './query-param.model';

export interface ListQuery {
  pageSize?: number;
  pageIndex?: number;
  sort?: string;
  query?: QueryParam;
}
