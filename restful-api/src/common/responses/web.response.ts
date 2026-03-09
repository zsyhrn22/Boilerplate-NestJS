import { PartialType } from '@nestjs/mapped-types';

export class PaginationResponseBase {
  total!: number;
  currentPage!: number;
  maxPage!: number;
}

export class WebResponse<T> extends PartialType(PaginationResponseBase) {
  message!: string;
  data!: T;
}

export class WebPaginationResponse<T> extends PaginationResponseBase {
  data!: T;
}
