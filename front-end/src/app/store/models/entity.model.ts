export interface Paging {
  list?: PagingList;
}
export interface PagingList {
  pagination?: Pagination;
  entries?: any[];
}
export interface Pagination {
  count?: number;
  hasMoreItems?: boolean;
  totalItems?: number;
  skipCount?: number;
  maxItems?: number;
}
