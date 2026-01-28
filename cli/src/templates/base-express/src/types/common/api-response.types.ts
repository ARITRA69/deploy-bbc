/**
 * Common API response types
 */


export type TApiSuccess<T =unknown> = {
  data?: T;
  message: string;
  pagination?: TPaginationResponse
}

export type TApiError = {
  status_code: number;
  message: string;
}

export type TApiResponse<T = unknown> = TApiSuccess<T> | TApiError

export type TPaginationResponse = {
  page: number;
  limit: number;
  total_pages: number;
  total_count: number;
}

