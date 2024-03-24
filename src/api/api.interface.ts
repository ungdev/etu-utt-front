export interface Pagination<T> {
  items: T[];
  itemsPerPage: number;
  itemCount: number;
}
