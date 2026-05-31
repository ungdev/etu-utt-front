export interface Pagination<T> {
  items: T[];
  itemsPerPage: number;
  itemCount: number;
}

export interface ApiError {
  errorCode: number;
  error: string;
}
