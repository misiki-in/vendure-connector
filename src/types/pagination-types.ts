export type PaginatedResponse<T> = {
  data: T[] // Array of items of type T
  count: number // Total count of items in the collection
  pageSize: number // Number of items per page
  noOfPage: number // Total number of pages
  page: number // Current page number
}
